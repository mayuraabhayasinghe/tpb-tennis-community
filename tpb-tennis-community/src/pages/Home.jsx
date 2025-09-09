import React from "react";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";

export const Home = () => {
  return (
    <div className="flex flex-col">
      <Navbar />
      <div className="mt-[100px] text-2xl text-center">Welcome to TPB (The Perfect Buddy)</div>
      <Footer/>
    </div>
  );
};
