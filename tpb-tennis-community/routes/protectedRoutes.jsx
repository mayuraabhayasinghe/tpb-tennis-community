import React, { useContext } from "react";
import { authContext } from "../src/context/AuthContext";

export const ProtectedRoutes = (props) => {
  const { user, loading } = useContext(authContext);
  if (loading) {
    return <div>Loading...</div>;
  }
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  if (!user.profile_complete) {
    return <Navigate to="/create-profile" replace />;
  }
  return props.children;
};
