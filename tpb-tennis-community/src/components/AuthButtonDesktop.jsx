import React, { useContext } from "react";
import { authContext } from "../context/AuthContext";
import { Button } from "./ui/button";
import { Link } from "react-router-dom";

export const AuthButtonDesktop = () => {
  const { user, signOut, logoutError } = useContext(authContext);

  // Debug output to check what's in the user state
  // console.log(
  //   "AuthButtonDesktop rendering with user:",
  //   user ? "Logged in" : "Not logged in"
  // );
  // if (user) {
  //   console.log("AuthButtonDesktop - user details:", {
  //     id: user.id,
  //     email: user.email,
  //   });
  // }

  return (
    <div>
      {user ? (
        <Button
          onClick={signOut}
          className="hidden md:flex md:display rounded-xl bg-green-600 hover:bg-green-700 text-white text-sm lg:text-[15px]"
        >
          Log out
        </Button>
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
