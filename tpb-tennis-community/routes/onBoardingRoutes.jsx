import { useState, useEffect } from "react";
import { UserAuth } from "../src/context/AuthContext";
import { Navigate } from "react-router-dom";

export default function OnBoardingRoutes(props) {
  const { session, profile } = UserAuth();
  

  const [Loading, setLoading] = useState(true);

  useEffect(() => {
    // Give auth system time to initialize
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  if (!session) {
    return <Navigate to="/login" />;
  }
  if (session && profile) {
    return <Navigate to="/" />;
  }
  return props.children;
}
