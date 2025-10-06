import { useState, useEffect } from "react";
import { UserAuth } from "../src/context/AuthContext";
import { Navigate } from "react-router-dom";

export default function OnBoardingRoutes(props) {
  const { session, loading } = UserAuth();
  if (loading) {
    return <div> Loading ...</div>;
  }

  if (session) {
    return <Navigate to="/" />;
  }

  return props.children;
}
