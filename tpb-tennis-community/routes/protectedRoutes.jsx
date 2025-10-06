import { useEffect } from "react";
import { UserAuth } from "../src/context/AuthContext";
import { Navigate, useNavigate } from "react-router-dom";
import AnimatedLogo from "../src/components/AnimatedLogo";

export const ProtectedRoutes = (props) => {
  const { session, loading } = UserAuth();
  
  if(loading){
    return <div>Loading...</div>
  }
  if (!session) {
    return <Navigate to="/login" />;
  }

  return props.children;
};
