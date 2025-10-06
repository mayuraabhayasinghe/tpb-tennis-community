import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../services/createClient";

const OAuthRedirectHandler = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const handleOAuthRedirect = async () => {
      try {
        // Get the current session after OAuth flow completes
        const { data, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error("OAuth session error:", sessionError.message);
          setError(sessionError.message);
          setLoading(false);
          return;
        }

        if (!data?.session?.user) {
          console.error("No user found after OAuth redirect");
          setError("Authentication failed. Please try again.");
          setLoading(false);
          navigate("/login");
          return;
        }

        const userId = data.session.user.id;
        console.log("OAuth login successful for user:", userId);

        // Check profile completion status
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("isProfileComplete")
          .eq("id", userId)
          .single();
        
        // If profile doesn't exist, create one with isProfileComplete = false
        if (profileError && profileError.code === "PGRST116") {
          console.log("Profile doesn't exist, creating one...");
          const { error: createError } = await supabase
            .from("profiles")
            .insert({ id: userId, isProfileComplete: false });
            
          if (createError) {
            console.error("Error creating profile:", createError.message);
          }
          
          // Redirect to profile creation
          navigate("/create-profile");
          return;
        } else if (profileError) {
          console.error("Error checking profile:", profileError.message);
        }
        
        const isProfileComplete = profileData?.isProfileComplete || false;
        console.log("Profile completion status:", isProfileComplete);
        
        if (isProfileComplete) {
          navigate("/");
        } else {
          navigate("/create-profile");
        }
      } catch (err) {
        console.error("Unexpected error during OAuth redirect handling:", err);
        setError("An unexpected error occurred. Please try again.");
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    handleOAuthRedirect();
  }, [navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      {loading ? (
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Processing your login...</h2>
          <p>Please wait while we complete your authentication</p>
        </div>
      ) : error ? (
        <div className="text-center text-red-600">
          <h2 className="text-xl font-semibold mb-2">Authentication Error</h2>
          <p>{error}</p>
        </div>
      ) : null}
    </div>
  );
};

export default OAuthRedirectHandler;
