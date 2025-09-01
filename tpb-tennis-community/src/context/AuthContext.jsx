import React, { createContext, useEffect, useState, useCallback } from "react";
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
  const fetchUserProfile = useCallback(async (userId) => {
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
      
      return profileData;
    } catch (err) {
      console.error("Unexpected error fetching profile:", err);
      return null;
    }
  }, []);

  /**
   * Fetch authenticated user data and profile
   */
  const fetchUser = useCallback(async () => {
    try {
      // Get authentication data
      const { data: authData, error: authError } = await supabase.auth.getUser();
      
      if (authError) {
        console.error("Auth error:", authError.message);
        setError(authError.message);
        setLoading(false);
        return;
      }
      
      // If no user, set state and return
      if (!authData?.user) {
        setUser(null);
        setLoading(false);
        return;
      }
      
      // Get user profile data
      const profileData = await fetchUserProfile(authData.user.id);
      
      // Set the user with combined auth and profile data
      setUser({
        ...authData.user,
        profile_complete: profileData ? profileData.isProfileComplete : false,
      });
    } catch (err) {
      console.error("Unexpected error in fetchUser:", err);
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  }, [fetchUserProfile]);

  /**
   * Sign out the current user
   */
  const signOut = async () => {
    try {
      setLogoutError(null); // Reset any previous errors
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error("Logout error:", error.message);
        setLogoutError(error.message);
      }
    } catch (err) {
      console.error("Unexpected error during signout:", err);
      setLogoutError("An unexpected error occurred during logout");
    }
  };

  // Initialize auth state and set up listener
  useEffect(() => {
    // Initial fetch
    fetchUser();

    // Set up auth state change listener
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (session?.user) {
          // Get profile data when auth state changes
          const profileData = await fetchUserProfile(session.user.id);
          
          setUser({
            ...session.user,
            profile_complete: profileData ? profileData.isProfileComplete : false,
          });
        } else {
          setUser(null);
        }
      }
    );

    // Cleanup subscription on unmount
    return () => {
      if (authListener?.subscription) {
        authListener.subscription.unsubscribe();
      }
    };
  }, [fetchUser, fetchUserProfile]);

  return (
    <authContext.Provider value={{ user, signOut, logoutError, loading }}>
      {!loading && children}
    </authContext.Provider>
  );
};
