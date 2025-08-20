import React, { createContext, useEffect, useState } from "react";
import { supabase } from "../services/createClient";

export const authContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [logoutError, setLogoutError] = useState("");

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      setLogoutError(error.message);
      return;
    }
  };

  useEffect(() => {
    //fetching user session object using getSession()
    const getUser = async function () {
      try {
        const { data: authData, error } = await supabase.auth.getSession();
        if (error) {
          console.log(error);
          setError(error.message);
          return;
        }
        setSession(authData.session);
        setUser(authData.session?.user ?? null);
        setLoading(false);
      } catch (err) {
        console.log(err.message);
        setError(err.message);
      }
    };

    getUser();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  return (
    <authContext.Provider value={{ user, signOut, logoutError, loading }}>
      {!loading && children}
    </authContext.Provider>
  );
};
