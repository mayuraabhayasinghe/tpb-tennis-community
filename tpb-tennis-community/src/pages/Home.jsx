import React from "react";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";

export const Home = () => {
  return (
    <div className="flex flex-col">
      <Navbar />
      <div className="">This is boady</div>
      <Footer/>
    </div>
  );
};
