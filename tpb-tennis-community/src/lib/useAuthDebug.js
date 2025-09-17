import { useEffect, useState } from "react";
import { supabase } from "../services/createClient";

/**
 * Custom hook to debug auth state changes
 * This hook can be added to any component to monitor auth state
 */
export function useAuthDebug() {
  const [authState, setAuthState] = useState({
    user: null,
    session: null,
    loading: true,
    lastEvent: null,
  });

  useEffect(() => {
    // Check current auth state
    async function checkAuth() {
      try {
        // Get current session
        const { data: sessionData } = await supabase.auth.getSession();

        // Get current user
        const { data: userData } = await supabase.auth.getUser();

        setAuthState({
          user: userData?.user || null,
          session: sessionData?.session || null,
          loading: false,
          lastEvent: "initial",
        });

        console.log("[AuthDebug] Initial state:", {
          hasUser: !!userData?.user,
          hasSession: !!sessionData?.session,
        });
      } catch (error) {
        console.error("[AuthDebug] Error checking auth:", error);
      }
    }

    // Run initial check
    checkAuth();

    // Set up listener
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("[AuthDebug] Auth event:", event, "Session:", !!session);

        if (session?.user) {
          setAuthState({
            user: session.user,
            session: session,
            loading: false,
            lastEvent: event,
          });
        } else {
          setAuthState({
            user: null,
            session: null,
            loading: false,
            lastEvent: event,
          });
        }
      }
    );

    // Cleanup
    return () => {
      if (authListener?.subscription) {
        authListener.subscription.unsubscribe();
      }
    };
  }, []);

  return authState;
}
