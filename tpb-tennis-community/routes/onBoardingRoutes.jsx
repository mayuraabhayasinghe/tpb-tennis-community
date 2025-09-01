import React, { useContext } from "react";
import { authContext } from "../src/context/AuthContext";
import { Navigate } from "react-router-dom";

export default function OnBoardingRoutes(props) {
  const { user, loading } = useContext(authContext);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.profile_complete) {
    return <Navigate to="/" replace />;
  }
  return props.children;
}
