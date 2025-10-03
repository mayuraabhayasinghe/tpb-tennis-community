import React, { useContext, useState } from "react";
import { UserAuth } from "../context/AuthContext";
import { Button } from "./ui/button";
import { Link } from "react-router-dom";

export const AuthButtonDesktop = () => {
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
    <div>
      {session ? (
        <div className="hidden md:display md:flex items-center gap-2">
          <Link
            className="hover:text-green-500 w-[85px] px-3 py-1 text-center rounded-xl border-1 border-green-600 font-sans font-medium transition-colors duration-200"
            to="/profile"
          >
            Profile
          </Link>
          <Button
            onClick={handleSignOut}
            className="hidden w-[85px] md:flex md:display rounded-xl bg-green-600 hover:bg-green-700 text-white text-sm lg:text-[15px]"
          >
            {loading ? (
              <div className="w-3 flex items-center justify-center text-white">
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
          </Button>
          
        </div>
      ) : (
        <div className="hidden md:flex md:display items-center gap-2">
          <Button className="rounded-xl px-6" variant="ghost" asChild>
            <Link className="text-sm lg:text-[15px]" to="/login">
              Log in
            </Link>
          </Button>
          <Button
            className="rounded-xl bg-green-600 hover:bg-green-700 text-white"
            asChild
          >
            <Link className="text-sm lg:text-[15px]" to="/sign-up">
              Sign up
            </Link>
          </Button>
        </div>
      )}
    </div>
  );
};
