import { UserAuth } from "../src/context/AuthContext";
import { Navigate } from "react-router-dom";

export const ProtectedRoutes = (props) => {
  const { session } = UserAuth();

  if (!session) {
    return <Navigate to="/login" />;
  }

  return props.children;
};
