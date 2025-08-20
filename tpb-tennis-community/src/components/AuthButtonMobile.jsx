import React, { useContext } from "react";
import { authContext } from "../context/AuthContext";
import { Link } from "react-router-dom";

export const AuthButtonMobile = () => {
  const { user, signOut } = useContext(authContext);
  return (
    <>
      {user ? (
        <button
          onClick={signOut}
          className="px-3 py-1.5 text-center rounded-xl bg-green-600 font-sans text-white font-medium transition-colors duration-200"
        >
          Log out
        </button>
      ) : (
        <div className="flex flex-col gap-5">
          <Link
            className="hover:text-green-500 px-3 py-1 text-center rounded-xl border-1 border-green-600 font-sans font-medium transition-colors duration-200"
            to="/login"
          >
            Log in
          </Link>
          <Link
            className="px-3 py-1.5 text-center rounded-xl bg-green-600 font-sans text-white font-medium transition-colors duration-200"
            to="/sign-up"
          >
            Sign Up
          </Link>
        </div>
      )}
    </>
  );
};
