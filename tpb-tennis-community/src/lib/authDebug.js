import { supabase } from "../services/createClient";

/**
 * Debug helper function to check auth state
 * Call this function when troubleshooting auth issues
 */
export const debugAuthState = async () => {
  try {
    console.group("Auth State Debug");
    
    // Check current session
    const { data: sessionData } = await supabase.auth.getSession();
    console.log("Current session:", sessionData?.session ? "Active" : "None");
    if (sessionData?.session) {
      console.log("- Session user ID:", sessionData.session.user.id);
      console.log("- Session expires at:", new Date(sessionData.session.expires_at * 1000).toLocaleString());
    }
    
    // Check current user
    const { data: userData } = await supabase.auth.getUser();
    console.log("Current user:", userData?.user ? "Authenticated" : "Not authenticated");
    if (userData?.user) {
      console.log("- User ID:", userData.user.id);
      console.log("- User email:", userData.user.email);
      console.log("- User created at:", userData.user.created_at);
    }
    
    console.groupEnd();
    return { sessionData, userData };
  } catch (error) {
    console.error("Error checking auth state:", error);
    return { error };
  }
};
