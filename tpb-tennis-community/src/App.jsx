import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";

import { Home } from "./pages/Home";
import CreateProfile from "./pages/CreateProfile";
import OAuthRedirectHandler from "./pages/OAuthRedirectHandler";
import { AuthProvider } from "./context/AuthContext";
import { ProtectedRoutes } from "../routes/ProtectedRoutes";
import { Requests } from "./pages/Requests";
import LoadingDemo from "./pages/LoadingDemo";
import Rankings from "./pages/Rankings";
import Profiles from "./pages/Profiles";
import Profile from "./pages/Profile";
import HostAGame from "./pages/HostAGame";
import Games from "./pages/Games";
import TestGames from "./pages/TestGames";
import TestGames2 from "./pages/TestGames2";
import OnBoardingRoutes from "../routes/onBoardingRoutes";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Toaster position="top-right" />
        <Routes>
          {/* Public routes */}
          <Route path="/sign-up" element={<SignUp />} />
          <Route
            path="/login"
            element={
              <OnBoardingRoutes>
                <Login />
              </OnBoardingRoutes>
            }
          />
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
          <Route
            path="/profile/:id"
            element={
              <ProtectedRoutes>
                <Profile />
              </ProtectedRoutes>
            }
          />
          <Route
            path="/hostGame"
            element={
              <ProtectedRoutes>
                <HostAGame />
              </ProtectedRoutes>
            }
          />
          <Route
            path="/games"
            element={
              <ProtectedRoutes>
                <TestGames2 />
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
