import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import SignUp from "./pages/SignUp.jsx";
import Login from "./pages/Login.jsx";
import { Home } from "./pages/Home.jsx";
import CreateProfile from "./pages/CreateProfile.jsx";
import OAuthRedirectHandler from "./pages/OAuthRedirectHandler.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import { Requests } from "./pages/Requests.jsx";
import LoadingDemo from "./pages/LoadingDemo.jsx";
import Rankings from "./pages/Rankings.jsx";
import Profiles from "./pages/Profiles.jsx";
import Profile from "./pages/Profile.jsx";
import ProfileById from "./pages/ProfileById.jsx";
import HostAGame from "./pages/HostAGame.jsx";
import TestGames2 from "./pages/TestGames2.jsx";
import OnBoardingRoutes from "../routes/OnBoardingRoutes.jsx";
import ProtectedRoutes from "../routes/ProtectedRoutes.jsx";

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
            path="/profile"
            element={
              <ProtectedRoutes>
                <Profile />
              </ProtectedRoutes>
            }
          />

          <Route
            path="/profile/:id"
            element={
              <ProtectedRoutes>
                <ProfileById />
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
