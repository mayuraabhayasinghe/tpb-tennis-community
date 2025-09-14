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
        <Button
          onClick={handleSignOut}
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
