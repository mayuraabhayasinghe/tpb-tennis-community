import React from "react";
import { Navbar } from "../components/Navbar";
import { UserAuth } from "../context/AuthContext";

export const Requests = () => {
  const { session, profile } = UserAuth();
  console.log(profile);
  return (
    <>
      <Navbar />
      <div className="mt-20">Requests</div>;
    </>
  );
};
