
import { UserAuth } from "../src/context/AuthContext";
import { Navigate } from "react-router-dom";

export default function OnBoardingRoutes(props) {
  const { session, profile } = UserAuth();
  if (!session) {
    <Navigate to="/login" />;
  }
  if (session && profile) {
    <Navigate to="/" />;
  }
  return props.children;
}
