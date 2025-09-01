import React, { useContext } from "react";
import { authContext } from "../src/context/AuthContext";

export const PublicRoutes = (props) => {
  const { user, loading } = useContext(authContext);
  if (loading) {
    return <div>Loading...</div>;
  }

  if (user) {
    return <Navigate to="/" replace />;
  }
  return props.children;
};
