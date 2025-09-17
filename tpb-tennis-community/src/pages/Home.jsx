import React, { useEffect, useState } from "react";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { UserAuth } from "../context/AuthContext";

export const Home = () => {
  // const { session } = UserAuth();
  // const [user, setUser] = useState(null);
  // useEffect(() => {
  //   if (!session) {
  //     setUser(null);
  //   }
  //   setUser(session.user);
  // }, [session]);
  return (
    <div className="flex flex-col">
      <Navbar />
      <div className="mt-[100px] text-2xl text-center">
        Welcome to TPB (The Perfect Buddy)
      </div>
      <Footer />
    </div>
  );
};
