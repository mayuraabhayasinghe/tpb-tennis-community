import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { UserAuth } from "../context/AuthContext";
import { TbNumber1Small } from "react-icons/tb";
import heroBg from "../asset/bgPic1.jpg";
import Games from "../asset/games.jpeg";
import Ranking from "../asset/rankings.jpg";
import requests from "../asset/request.jpg";
import { useNavigate } from "react-router-dom";
import { FaCheckCircle } from "react-icons/fa";
import { MdOutlineAccessTimeFilled } from "react-icons/md";
import { IoPeopleCircle } from "react-icons/io5";
import { HowItWorksZigZagClean } from "../components/ui/HowItWorksZigZagClean";

export const Home = () => {
  // const { session } = UserAuth();
  // const [user, setUser] = useState(null);
  // useEffect(() => {
  //   if (!session) {
  //     setUser(null);
  //   }
  //   setUser(session.user);
  // }, [session]);

  const navigate = useNavigate();

  return (
    <div className="flex flex-col">
      <Navbar />
      <div className="text-center mt-15">
        <div
          className="h-[600px] flex flex-col items-center justify-center bg-center bg-cover relative"
          style={{ backgroundImage: `url(${heroBg})` }}
        >
          <div className="absolute inset-0 bg-black/40"></div>
          <div className="text-white text-center z-10">
            <h1 className="font-bold text-3xl">
              Find Your Perfect Tennis Buddy
            </h1>
            <p className="mt-2">
              Connect with tennis players in your area, join games, or host your
              own matches.
            </p>
          </div>

          <div className="flex flex-row gap-3 z-10">
            <button
              className="bg-white px-4 py-2 text-green-600 mt-5 rounded-3xl cursor-pointer font-bold text-sm transition duration-300 hover:bg-blue-100/80"
              onClick={() => {
                navigate("/sign-up");
              }}
            >
              Join Now
            </button>
            <button
              className="border border-white text-white font-semibold px-4 py-2 mt-5 rounded-3xl cursor-pointer transition duration-300 hover:bg-white/20 hover:text-white"
              onClick={() => {
                navigate("/login");
              }}
            >
              Sign In
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 justify-items-center mt-12 px-6">
          <div
            className="relative w-95 h-80 rounded-2xl overflow-hidden shadow-lg group  cursor-pointer"
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
            <div className="absolute bottom-0 p-6 text-white z-10">
              <h2 className="text-2xl font-bold">Games</h2>
              <p className="mt-2 text-sm">
                Browse available games in your area or create your own and
                invite others to join.
              </p>
            </div>
          </div>

          <div
            className="relative w-95 h-80 rounded-2xl overflow-hidden shadow-lg group cursor-pointer transform transition duration-300 hover:shadow-2xl hover:-translate-y-1"
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
            <div className="absolute bottom-0 p-6 text-white z-10">
              <h2 className="text-xl font-bold">Game Requests</h2>
              <p className="mt-2 text-sm">
                Send or respond to game requests from other players and find the
                perfect partner that matches your availability.
              </p>
            </div>
          </div>

          <div
            className="relative  w-95 h-80 rounded-2xl overflow-hidden shadow-lg group cursor-pointer"
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

            <div className="absolute bottom-0 p-6 text-white z-10">
              <h2 className="text-2xl font-bold">Ranking</h2>
              <p className="mt-2 text-sm">
                Enjoy your tennis match and rate your partners to help build a
                trusted community.
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center text-center mt-10">
          <h1 className="font-bold text-2xl ">Why Choose The Perfect Buddy</h1>

          <div className="m-5 grid grid-cols-1 md:grid-cols-2 gap-10 text-left">
            <div className="flex flex-row items-center gap-2">
              <FaCheckCircle className="text-yellow-400 text-3xl" />
              <div>
                <h2 className="font-semibold text-lg">
                  Find Players at Your Level
                </h2>
                <p className="text-gray-600">
                  Our skill-matching system ensures you play with partners at
                  your level.
                </p>
              </div>
            </div>

            <div className="flex flex-row items-center gap-2">
              <MdOutlineAccessTimeFilled className="text-green-400 text-4xl" />
              <div>
                <h2 className="font-semibold text-lg">Convenient Scheduling</h2>
                <p className="text-gray-600">
                  Easily find games that fit your schedule or create your own.
                </p>
              </div>
            </div>

            <div className="flex flex-row items-center gap-2">
              <IoPeopleCircle className="text-yellow-400 text-4xl" />
              <div>
                <h2 className="font-semibold text-lg">Trusted Community</h2>
                <p className="text-gray-600">
                  Our rating system helps you find reliable and friendly tennis
                  partners.
                </p>
              </div>
            </div>

            <div className="flex flex-row items-center gap-2">
              <FaCheckCircle className="text-green-400 text-3xl" />
              <div>
                <h2 className="font-semibold text-lg">Safe and Secure</h2>
                <p className="text-gray-600">
                  Verified profiles and secure messaging to ensure a safe
                  experience.
                </p>
              </div>
            </div>
          </div>
        </div>

        <HowItWorksZigZagClean/>

        <div className="h-[300px] flex flex-col items-center justify-center bg-gradient-to-r from-green-400 to-yellow-400 mt-10 relative">
          <div className="absolute inset-0 bg-black/40"></div>
          <div className="space-y-2.5 z-10">
            <h1 className="text-white font-bold text-3xl">
              Ready to Find Your Perfect Tennis Buddy?
            </h1>
            <p className="text-white text-lg">
              Join our community today and never miss a chance to play tennis
              with the
              <br />
              bperfect partner.
            </p>
            <button
              className="border border-white text-green-400 font-semibold px-4 py-2 mt-5 rounded-3xl cursor-pointer transition duration-300 hover:bg-white/20 hover:text-white z-10"
              onClick={() => {
                navigate("/sign-up");
              }}
            >
              Sign Up Now
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};
