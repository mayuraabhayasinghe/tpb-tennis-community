import { BrowserRouter, Routes, Route } from "react-router-dom";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";

import { Home } from "./pages/Home";
import CreateProfile from "./pages/CreateProfile";
import OAuthRedirectHandler from "./pages/OAuthRedirectHandler";
import { AuthProvider } from "./context/AuthContext";
import { ProtectedRoutes } from "../routes/protectedRoutes";
import OnBoardingRoutes from "../routes/OnBoardingRoutes";
import { Requests } from "./pages/Requests";
import LoadingDemo from "./pages/LoadingDemo";
import Rankings from "./pages/Rankings";
import Profiles from "./pages/Profiles";
// import { AuthDebugPanel } from "./components/AuthDebugPanel";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public routes */}
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Home />} />

          <Route path="/loading-demo" element={<LoadingDemo />} />

          {/* Protected routes */}
          <Route
            path="/requests"
            element={
              <ProtectedRoutes>
                <Requests />
              </ProtectedRoutes>
            }
          />
          <Route
            path="/rankings"
            element={
              <ProtectedRoutes>
                <Rankings />
              </ProtectedRoutes>
            }
          />
          <Route
            path="/profiles"
            element={
              <ProtectedRoutes>
                <Profiles />
              </ProtectedRoutes>
            }
          />

          {/* Onboarding protected route */}
          <Route path="/create-profile" element={<CreateProfile />} />

          {/* Fallback route - redirects to home if no other routes match */}
          <Route path="*" element={<Home />} />

          {/* OAuth redirect handler */}
          <Route path="/oauth-redirect" element={<OAuthRedirectHandler />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
