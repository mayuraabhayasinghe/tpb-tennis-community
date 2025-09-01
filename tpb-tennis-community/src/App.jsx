import { BrowserRouter, Routes, Route } from "react-router-dom";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import { Home } from "./pages/Home";
import CreateProfile from "./pages/CreateProfile";
import { AuthProvider } from "./context/AuthContext";
import { PublicRoutes } from "../routes/publicRoutes";
import OnBoardingRoutes from "../routes/onBoardingRoutes";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/login" element={<Login />} />

        <Route path="/" element={<Home />} />

        {/* Onboarding routes */}
        <Route path="/create-profile" element={<CreateProfile />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
