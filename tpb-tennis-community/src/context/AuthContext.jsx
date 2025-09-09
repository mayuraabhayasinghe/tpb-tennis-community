import React, { createContext, useEffect, useState } from "react";
import { supabase } from "../services/createClient";

// Create auth context
export const authContext = createContext();

export const AuthProvider = ({ children }) => {
  // State declarations
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [logoutError, setLogoutError] = useState(null);

  /**
   * Fetch user profile data from Supabase
   * @param {string} userId - The user ID to fetch profile data for
   */
  async function fetchUserProfile(userId) {
    if (!userId) {
      console.error("fetchUserProfile called with no userId");
      return null;
    }

    console.log("Fetching profile data for user:", userId);
    try {
      const { data: profileData, error: fetchProfileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (fetchProfileError) {
        console.error("Profile fetch error:", fetchProfileError.message);
        return null;
      }

      console.log(
        "Profile data retrieved successfully:",
        profileData ? "Yes" : "No"
      );
      return profileData;
    } catch (err) {
      console.error("Unexpected error fetching profile:", err);
      return null;
    }
  }

  /**
   * Fetch authenticated user data and profile
   */
  async function fetchUser() {
    try {
      console.log("Fetching user session...");
      // First try to get the session, which is more reliable for checking auth status
      const { data: sessionData, error: sessionError } =
        await supabase.auth.getSession();

      console.log("Session data received:", sessionData ? "Yes" : "No");

      if (sessionError) {
        console.error("Session error:", sessionError.message);
        setError(sessionError.message);
        setLoading(false);
        return;
      }

      // If no session or no user in the session, set state and return
      if (!sessionData?.session?.user) {
        console.log("No user session found, setting user to null");
        setUser(null);
        setLoading(false);
        return;
      }

      console.log("User session found, user ID:", sessionData.session.user.id);
      console.log("Fetching profile data...");
      // Get user profile data
      const profileData = await fetchUserProfile(sessionData.session.user.id);

      // Set the user with combined auth and profile data
      console.log(
        "Setting user state with profile complete:",
        profileData ? profileData.isProfileComplete : false
      );

      setUser({
        ...sessionData.session.user,
        profile_complete: profileData ? profileData.isProfileComplete : false,
      });
    } catch (err) {
      console.error("Unexpected error in fetchUser:", err);
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  }

  /**
   * Sign out the current user
   */
  async function signOut() {
    try {
      console.log("Sign out initiated");
      setLogoutError(null); // Reset any previous errors

      // First set user to null to update UI immediately
      setUser(null);

      // Then perform the actual signout with Supabase
      const { error } = await supabase.auth.signOut();

      if (error) {
        console.error("Logout error:", error.message);
        setLogoutError(error.message);
        return;
      }

      console.log("User signed out successfully");

      // Navigate programmatically if needed - add this if you want automatic navigation
      window.location.href = "/";
    } catch (err) {
      console.error("Unexpected error during signout:", err);
      setLogoutError("An unexpected error occurred during logout");
    }
  }

  /**
   * Update user state based on session data
   */
  async function handleAuthStateChange(_event, session) {
    console.log(
      "Auth state changed:",
      _event,
      "at",
      new Date().toLocaleTimeString()
    );

    try {
      if (session?.user) {
        // Log the user ID from the session
        console.log(
          "Auth state change - user authenticated, ID:",
          session.user.id
        );

        // Get profile data
        console.log("Fetching user profile for authenticated user...");
        const profileData = await fetchUserProfile(session.user.id);
        console.log(
          "Profile data fetched:",
          profileData ? "Success" : "Not found"
        );

        // Update the user state with the new data
        console.log("Updating user state in context...");
        setUser({
          ...session.user,
          profile_complete: profileData ? profileData.isProfileComplete : false,
        });
        console.log("User state updated in context");
      } else {
        console.log("Auth state change - no user, setting user state to null");
        setUser(null);
      }
    } catch (err) {
      console.error("Error handling auth state change:", err);
    } finally {
      // Always ensure loading is false after processing
      setLoading(false);
    }
  }

  // Initialize auth state and set up listener
  useEffect(() => {
    console.log("Auth provider initialized");

    // Initial fetch with error handling
    (async () => {
      try {
        console.log("Performing initial auth check...");
        await fetchUser();
        console.log("Initial auth check complete");
      } catch (err) {
        console.error("Error during fetchUser:", err);
        setError("Failed to fetch authentication status");
        setLoading(false);
      }
    })();

    // Set up auth state change listener
    console.log("Setting up auth state change listener...");
    const { data: authListener } = supabase.auth.onAuthStateChange(
      handleAuthStateChange
    );

    // Cleanup subscription on unmount
    return () => {
      if (authListener?.subscription) {
        console.log("Cleaning up auth listener");
        authListener.subscription.unsubscribe();
      }
    };
  }, []); // No dependencies needed since all functions are defined inside the component

  // Debug log current user state on every render
  console.log(
    "AuthContext current user state:",
    user ? "User is set" : "No user"
  );
  if (user) {
    console.log("User details:", {
      id: user.id,
      email: user.email,
      profile_complete: user.profile_complete,
    });
  }

  return (
    <authContext.Provider
      value={{ user, signOut, logoutError, loading, error }}
    >
      {children}
    </authContext.Provider>
  );
};
