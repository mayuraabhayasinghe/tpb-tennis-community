import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../services/createClient";
import { useNavigate } from "react-router-dom";

// Create auth context
export const authContext = createContext();

export const AuthProvider = ({ children }) => {
  const [session, setSession] = useState(undefined);
  const [profile, setProfile] = useState(null);

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

    return { success: true, data };
  };

  //Sign in
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

  //Sign out
  const signOut = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error("Logout error:", error);
      return;
    }

    console.log("User signed out successfully");
    navigate("/");
  };

  //Fetch user profile
  const fetchProfile = async (userId) => {
    try {
      if (!userId) {
        return null;
      }
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) {
        console.log("Error fetch profile: ", error.message);
        return null;
      }

      setProfile(data);
      return data;
    } catch (error) {
      console.error("Unexpected error fetching profile:", error);
      return null;
    }
  };

  useEffect(() => {
    async function getSessionAndProfile() {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setSession(session);

      if (session?.user) {
        await fetchProfile(session.user.id);
      }
    }

    getSessionAndProfile();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      if (session?.user) {
        await fetchProfile(session.user.id);
      } else {
        setProfile(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <authContext.Provider value={{ session, signUp, signIn, signOut, profile }}>
      {children}
    </authContext.Provider>
  );
};

export const UserAuth = () => {
  return useContext(authContext);
};
