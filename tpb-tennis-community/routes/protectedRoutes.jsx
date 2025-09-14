import { UserAuth } from "../src/context/AuthContext";
import { Navigate } from "react-router-dom";

export const ProtectedRoutes = (props) => {
  const { session, profile } = UserAuth();

  if (!session) {
    return <Navigate to="/login" />;
  }
  if (session && !profile) {
    return <Navigate to="/create-profile" />;
  }
  return props.children;
};
