import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from 'react-hot-toast';
import { SignUp } from "./pages/SignUp";
import { Login } from "./pages/Login";
import {Home} from "./pages/Home";
import HostAGame from "./pages/HostAGame";
import Games from "./pages/Games";

function App() {
  return (
    <>
      <BrowserRouter>
      <Toaster position='top-right' />
        <Routes>
          <Route path="/register" element={<SignUp/>}/>
          <Route path="/login" element={<Login/>}/>
          <Route path="/" element={<Home/>}/>
          <Route path="/hostGame" element={<HostAGame/>}/>
          <Route path="/games" element={<Games/>}/>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
