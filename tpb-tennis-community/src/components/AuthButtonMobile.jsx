import React, { useContext, useState } from "react";
import { UserAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

export const AuthButtonMobile = () => {
  const { session, signOut } = UserAuth();

  const [loading, setLoading] = useState(false);

  const handleSignOut = async () => {
    try {
      setLoading(true);
      await signOut();
    } catch (error) {
      console.error("Unexpected error occured at log out: ", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {session ? (
        <div className="flex flex-col gap-5">
          <Link
            className="hover:text-green-500 px-3 py-1 text-center rounded-xl border-1 border-green-600 font-sans font-medium transition-colors duration-200"
            to="/profile"
          >
            Profile
          </Link>
          <button
            onClick={handleSignOut}
            className="flex items-center justify-center px-3 py-1.5 w-[75px] text-center rounded-xl bg-green-600 font-sans text-white font-medium transition-colors duration-200"
          >
            {loading ? (
              <div className="w-3 py-[4px]  text-white">
                <svg
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12,1A11,11,0,1,0,23,12,11,11,0,0,0,12,1Zm0,19a8,8,0,1,1,8-8A8,8,0,0,1,12,20Z"
                    opacity=".25"
                  ></path>
                  <path d="M12,4a8,8,0,0,1,7.89,6.7A1.53,1.53,0,0,0,21.38,12h0a1.5,1.5,0,0,0,1.48-1.75,11,11,0,0,0-21.72,0A1.5,1.5,0,0,0,2.62,12h0a1.53,1.53,0,0,0,1.49-1.3A8,8,0,0,1,12,4Z">
                    <animateTransform
                      attributeName="transform"
                      type="rotate"
                      dur="0.75s"
                      values="0 12 12;360 12 12"
                      repeatCount="indefinite"
                    ></animateTransform>
                  </path>
                </svg>
              </div>
            ) : (
              "Log out"
            )}
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-5 w-[75px]">
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
