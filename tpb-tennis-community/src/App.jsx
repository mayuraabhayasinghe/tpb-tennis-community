import { BrowserRouter, Routes, Route } from "react-router-dom";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";

import { Home } from "./pages/Home";
import CreateProfile from "./pages/CreateProfile";
import OAuthRedirectHandler from "./pages/OAuthRedirectHandler";
import { AuthProvider } from "./context/AuthContext";
import { PublicRoutes } from "../routes/publicRoutes";
import OnBoardingRoutes from "../routes/onBoardingRoutes";
import TestLogin from "./pages/TeStLogin";
// import { AuthDebugPanel } from "./components/AuthDebugPanel";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public routes */}
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
          <Route path="/test-login" element={<TestLogin />} />

          <Route path="/" element={<Home />} />

          {/* Onboarding routes */}
          <Route path="/create-profile" element={<CreateProfile />} />

          {/* OAuth redirect handler */}
          <Route path="/oauth-redirect" element={<OAuthRedirectHandler />} />

          {/* Fallback route - redirects to home if no other routes match */}
          <Route path="*" element={<Home />} />
        </Routes>
        {/* <AuthDebugPanel /> */}
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
