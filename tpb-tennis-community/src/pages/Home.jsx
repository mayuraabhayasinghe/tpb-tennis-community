import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { UserAuth } from "../context/AuthContext";
import { TbNumber1Small } from "react-icons/tb";
import heroBg from "../asset/bgPic1.jpg";
import bottom from "../asset/wilson-2259352_1280.jpg";
import Games from "../asset/games.jpeg";
import Ranking from "../asset/rankings.jpg";
import requests from "../asset/request.jpg";
import { useNavigate } from "react-router-dom";
import { FaCheckCircle } from "react-icons/fa";
import { MdOutlineAccessTimeFilled } from "react-icons/md";
import { IoPeopleCircle } from "react-icons/io5";
import { HowItWorksZigZagClean } from "../components/ui/HowItWorksZigZagClean";
import { WhyChooseTPB } from "../components/ui/WhyChooseTPB";
import { useState } from "react";
import { Button } from "../components/ui/button";

export const Home = () => {
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

  const navigate = useNavigate();

  return (
    <div className="flex flex-col">
      <Navbar />
      <div className="text-center mt-15">
        <div
          className="h-[600px] flex flex-col items-center justify-center bg-center bg-cover relative px-5"
          style={{ backgroundImage: `url(${heroBg})` }}
        >
          <div className="absolute inset-0 bg-black/40"></div>
          <div className="text-white text-center z-10 ">
            <h1 className="font-bold text-3xl">
              Find Your Perfect Tennis Buddy
            </h1>
            <p className="mt-2">
              Connect with tennis players in your area, join games, or host your
              own matches.
            </p>
            <div className="flex justify-center items-center mt-10">
              {/* Conditional Buttons */}
              <div className="flex flex-row gap-3 z-10">
                {session ? (
                  <>
                    {/* When logged in */}
                    <button
                      className="bg-white px-3 py-1.5 w-[100px] text-green-600 mt-5 rounded-3xl cursor-pointer font-bold text-sm transition duration-300 hover:bg-blue-100/80"
                      onClick={() => navigate("/profile")}
                    >
                      Profile
                    </button>
                    <button
                      className="border flex justify-center border-white text-white font-semibold px-3 py-1.5 w-[100px] mt-5 rounded-3xl cursor-pointer transition duration-300 hover:bg-white/20 hover:text-white"
                      onClick={handleSignOut}
                      disabled={loading}
                    >
                      {loading ? (
                        <div className="w-4 py-[4px]  text-white">
                          <svg
                            fill="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                            strokeWidth="4"
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
                        "Logout"
                      )}
                    </button>
                  </>
                ) : (
                  <>
                    {/* When NOT logged in */}
                    <button
                      className="bg-white px-3 py-1.5 w-[100px] text-green-600 mt-5 rounded-3xl cursor-pointer font-bold text-sm transition duration-300 hover:bg-blue-100/80"
                      onClick={() => navigate("/sign-up")}
                    >
                      Join Now
                    </button>
                    <button
                      className="border border-white text-white font-semibold px-3 py-1.5 w-[100px] mt-5 rounded-3xl cursor-pointer transition duration-300 hover:bg-white/20 hover:text-white"
                      onClick={() => navigate("/login")}
                    >
                      Sign In
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Menu cards after the hero section */}
        <div className="flex justify-center px-4 sm:px-6 md:px-8">
          <div className="w-full max-w-7xl grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6 mt-8 md:mt-12">
            <div
              className="relative w-full aspect-[4/5] rounded-xl sm:rounded-2xl overflow-hidden shadow-lg group cursor-pointer hover:shadow-xl transition-all duration-300"
              onClick={() => {
                navigate("/games");
              }}
            >
              {/* Background image */}
              <img
                src={Games}
                alt="Game Requests"
                className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-110"
              />

              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>

              {/* Text content */}
              <div className="absolute left-0 right-0 top-[65%] sm:top-[45%] xl:top-[65%] p-4 sm:p-6 text-white z-10">
                <h2 className="text-xl sm:text-2xl font-bold mb-2">Games</h2>
                <p className="text-sm xl:text-base">
                  Browse available games in your area or create your own and
                  invite others to join.
                </p>
              </div>
            </div>

            <div
              className="relative w-full aspect-[4/5] rounded-xl sm:rounded-2xl overflow-hidden shadow-lg group cursor-pointer hover:shadow-xl transition-all duration-300"
              onClick={() => navigate("/requests")}
            >
              <img
                src={requests}
                alt="Game Requests"
                className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-110"
              />

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>

              {/* Text Content */}
              <div className="absolute left-0 right-0 top-[65%] sm:top-[45%] xl:top-[65%] p-4 sm:p-6 text-white z-10">
                <h2 className="text-xl sm:text-2xl font-bold mb-2">
                  Game Requests
                </h2>
                <p className="text-sm xl:text-base">
                  Send or respond to game requests from other players and find
                  the perfect partner that matches your availability.
                </p>
              </div>
            </div>

            <div
              className="relative w-full aspect-[4/5] rounded-xl sm:rounded-2xl overflow-hidden shadow-lg group cursor-pointer hover:shadow-xl transition-all duration-300"
              onClick={() => {
                navigate("/rankings");
              }}
            >
              <img
                src={Ranking}
                alt="Game Requests"
                className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-110"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>

              <div className="absolute left-0 right-0 top-[65%] sm:top-[45%] xl:top-[65%] p-4 sm:p-6 text-white z-10">
                <h2 className="text-xl sm:text-2xl font-bold mb-2">Ranking</h2>
                <p className="text-sm xl:text-base">
                  Enjoy your tennis match and rate your partners to help build a
                  trusted community.
                </p>
              </div>
            </div>
          </div>
        </div>

        <WhyChooseTPB />

        <HowItWorksZigZagClean />

        <div
          className="h-[300px] flex flex-col items-center justify-center mt-10 relative bg-center bg-cover px-5"
          style={{ backgroundImage: `url(${bottom})` }}
        >
          {/* Semi-transparent overlay */}
          <div className="absolute inset-0 bg-black/40"></div>

          <div className="space-y-2.5 z-10 text-center">
            <h1 className="text-white font-bold text-3xl">
              Ready to Find Your Perfect Tennis Buddy?
            </h1>
            <p className="text-white text-lg">
              Join our community today and never miss a chance to play tennis
              with the
              <br />
              perfect partner.
            </p>
            {session ? (
              ""
            ) : (
              <button
                className="border border-white text-white font-semibold px-4 py-2 mt-5 rounded-3xl cursor-pointer transition duration-300 hover:bg-white/20 hover:text-white"
                onClick={() => {
                  navigate("/sign-up");
                }}
              >
                Sign Up Now
              </button>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};
