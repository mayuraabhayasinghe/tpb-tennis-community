import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../services/createClient";
import { useNavigate } from "react-router-dom";

// Create auth context
export const authContext = createContext();

export const AuthProvider = ({ children }) => {
  const [session, setSession] = useState(undefined);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  //Sign up
  const signUp = async (email, password) => {
    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: password,
    });

    if (error) {
      console.log("There was a problem signing up: ", error);
      return { success: false, error: error.message };
    }

    // Update session immediately after successful signup
    setSession(data.session);

    return { success: true, data };
  };

  //Sign in with email/password
  const signIn = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) {
      console.log("There was a problem signin in: ", error);
      return { success: false, error: error.message };
    }

    console.log("Sign in success: ", data);
    return { success: true, data };
  };

  // Sign in with Google
  const signInWithGoogle = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: import.meta.env.VITE_SITE_URL,
      },
    });

    if (error) {
      console.error("Google login error:", error);
      return { success: false, error: error.message };
    }

    // Supabase will handle redirect → your app’s redirect URL must be set in Dashboard
    return { success: true, data };
  };

  //Sign out
  const signOut = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error("Logout error:", error);
      return;
    }
    setSession(null);
    setProfile(null);
    console.log("User signed out successfully");
    navigate("/");
  };

  //Fetch user profile
  // const fetchProfile = async (userId) => {
  //   try {
  //     if (!userId) {
  //       return null;
  //     }
  //     const { data, error } = await supabase
  //       .from("profiles")
  //       .select("*")
  //       .eq("id", userId)
  //       .single();

  //     if (error) {
  //       console.log("Error fetching profile: ", error.message);
  //       return null;
  //     }

  //     setProfile(data);
  //     return data;
  //   } catch (error) {
  //     console.error("Unexpected error fetching profile:", error);
  //     return null;
  //   }
  // };

  useEffect(() => {
    async function getSession() {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setSession(session);
      setLoading(false);
    }

    getSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setSession(session);
        setLoading(false);
      }
    );

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  return (
    <authContext.Provider
      value={{
        session,
        profile,
        signUp,
        signIn,
        signOut,
        loading,
        signInWithGoogle,
      }}
    >
      {children}
    </authContext.Provider>
  );
};

export const UserAuth = () => {
  return useContext(authContext);
};
