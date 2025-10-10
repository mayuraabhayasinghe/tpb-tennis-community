import { motion } from "framer-motion";
import { FaTrophy, FaHandshake, FaCalendarAlt, FaShieldAlt } from "react-icons/fa";
import tennisBall from "../../asset/tennis-ball.png"; // optional: can keep or remove

export const WhyChooseTPB = () => {
  return (
    <section className="relative flex flex-col items-center justify-center py-20 bg-white overflow-hidden">
      {/* Title */}
      <motion.h1
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-4xl md:text-3xl font-bold text-black mb-12 text-center drop-shadow-lg"
      >
        Why Choose <span className="text-yellow-500 font-bold">The Perfect Buddy</span>
      </motion.h1>

      {/* Main Animated Card */}
      <motion.div
        className="relative bg-white border border-green-200 shadow-2xl rounded-3xl p-10 max-w-5xl w-[90%] hover:shadow-green-200/60 transition-all duration-500"
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7 }}
        whileHover={{ scale: 1.02 }}
      >
        {/* Spinning tennis ball effect (optional) */}
        <motion.img
          src={tennisBall}
          alt="tennis ball"
          className="absolute -top-8 -right-8 w-16 h-16"
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 6, ease: "linear" }}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mt-5">
          {/* Feature 1 */}
          <motion.div whileHover={{ x: 5 }} className="flex items-start gap-5">
            <div className="bg-gradient-to-br from-green-400 to-yellow-400 p-4 rounded-2xl shadow-md text-white">
              <FaTrophy size={30} />
            </div>
            <div>
              <h3 className="font-bold text-lg text-black text-start">
                Skill-Based Matchmaking
              </h3>
              <p className="text-gray-600 text-sm mt-1 text-start">
                We connect you with players who match your skill level — every game feels just right.
              </p>
            </div>
          </motion.div>

          {/* Feature 2 */}
          <motion.div whileHover={{ x: 5 }} className="flex items-start gap-5">
            <div className="bg-gradient-to-br from-yellow-400 to-orange-400 p-4 rounded-2xl shadow-md text-white">
              <FaCalendarAlt size={30} />
            </div>
            <div>
              <h3 className="font-bold text-lg text-black text-start">
                Smart Scheduling
              </h3>
              <p className="text-gray-600 text-sm mt-1 text-start">
                Automatically find perfect match times — or create your own flexible sessions.
              </p>
            </div>
          </motion.div>

          {/* Feature 3 */}
          <motion.div whileHover={{ x: 5 }} className="flex items-start gap-5">
            <div className="bg-gradient-to-br from-green-400 to-cyan-400 p-4 rounded-2xl shadow-md text-white">
              <FaHandshake size={30} />
            </div>
            <div>
              <h3 className="font-bold text-lg text-black text-start">
                Trusted Tennis Community
              </h3>
              <p className="text-gray-600 text-sm mt-1 text-start">
                Rate, review, and build trust — join a respectful and passionate player base.
              </p>
            </div>
          </motion.div>

          {/* Feature 4 */}
          <motion.div whileHover={{ x: 5 }} className="flex items-start gap-5">
            <div className="bg-gradient-to-br from-green-500 to-emerald-400 p-4 rounded-2xl shadow-md text-white">
              <FaShieldAlt size={30} />
            </div>
            <div>
              <h3 className="font-bold text-lg text-black text-start">Secure & Verified</h3>
              <p className="text-gray-600 text-sm mt-1 text-start">
                Verified users and encrypted chat ensure every connection is safe and genuine.
              </p>
            </div>
          </motion.div>
        </div>

        {/* Decorative glowing line */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[80%] h-[2px] bg-gradient-to-r from-green-400 via-yellow-400 to-green-400 rounded-full mt-8 animate-pulse"></div>
      </motion.div>
    </section>
  );
};
