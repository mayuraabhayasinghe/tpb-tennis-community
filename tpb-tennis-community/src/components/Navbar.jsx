import React, {useState } from "react";
import { Link } from "react-router-dom";
import { AuthButtonDesktop } from "./AuthButtonDesktop";
import { AuthButtonMobile } from "./AuthButtonMobile";

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const handlClick = () => {
    setIsOpen(!isOpen);
  };
  return (
    <nav className="fixed top-0 left-0 right-0 z-50">
      <div className="w-full px-3.5 lg:px-5 py-1.5 md:py-3 flex items-center justify-between bg-white/10 backdrop-blur-md border-b border-white/20 ">
        <div className="flex items-center gap-1.5">
          <div className="text-yellow-300 text-sm lg:text-lg font-bold px-2.5 py-1 rounded-sm bg-gradient-to-tr from-black via-gray-600 to-black shadow-sm ">
            TPB
          </div>
          <span className="font-sans font-medium text-sm lg:text-lg">
            The Perfect Buddy
          </span>
        </div>

        {/* dekstop menu links */}
        <div className="hidden md:flex md:display gap-6 lg:gap-10 font-sans text-sm lg:text-[15px]">
          <Link className="hover:text-blue-500" to="/games">
            Games
          </Link>
          <Link className="hover:text-blue-500" to="/requests">
            Requests
          </Link>
          <Link className="hover:text-blue-500" to="/rankings">
            Rankings
          </Link>
          <Link className="hover:text-blue-500" to="/profiles">
            Profiles
          </Link>
        </div>
        {/* dekstop login and signup button */}
        <AuthButtonDesktop />

        {/* mobile menu icon */}
        <div className="md:hidden">
          {isOpen ? (
            <button onClick={handlClick}>
              <svg
                width="30px"
                height="30px"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                className="feather feather-x"
              >
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          ) : (
            <button onClick={handlClick}>
              <svg
                width="30px"
                height="30px"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <line
                  x1="5"
                  y1="18"
                  x2="19"
                  y2="18"
                  stroke="#020305"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <line
                  x1="5"
                  y1="13"
                  x2="19"
                  y2="13"
                  stroke="#020305"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <line
                  x1="5"
                  y1="8"
                  x2="19"
                  y2="8"
                  stroke="#020305"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          )}
        </div>
      </div>
      {/* mobile nav items */}
      <div
        className={`w-full md:hidden absolute top-full left-0 z-50 bg-white/10 backdrop-blur-md border-t border-white/20 flex flex-col items-start gap-5 px-5 pt-4 pb-7 shadow-sm rounded-b-lg text-sm transition-all duration-300 ease-in-out transform ${
          isOpen
            ? "opacity-100 translate-y-0 pointer-events-auto"
            : "opacity-0 -translate-y-2 pointer-events-none"
        }`}
      >
        <Link className="px-3 transition-colors duration-200" to="/games">
          Games
        </Link>
        <Link className="px-3 transition-colors duration-200" to="/requests">
          Requests
        </Link>
        <Link className="px-3 transition-colors duration-200" to="/rankings">
          Rankings
        </Link>
        <Link className="px-3 transition-colors duration-200" to="/profiles">
          Profiles
        </Link>
        <AuthButtonMobile />
      </div>
    </nav>
  );
};
