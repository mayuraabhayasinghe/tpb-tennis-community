import { BrowserRouter, Routes, Route } from "react-router-dom";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import { Home } from "./pages/Home";
import CreateProfile  from "./pages/CreateProfile";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Home />} />
          <Route path="/create-profile" element={<CreateProfile/>}/>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
