import { motion } from "framer-motion";
import {
  FaTrophy,
  FaHandshake,
  FaCalendarAlt,
  FaShieldAlt,
} from "react-icons/fa";
import tennisBall from "../../asset/tennis-ball.png"; // optional: can keep or remove

export const WhyChooseTPB = () => {
  return (
    <section className="relative flex flex-col items-center justify-center py-12 sm:py-16 md:py-20 bg-white overflow-hidden px-4 sm:px-6">
      {/* Title */}
      <motion.h1
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="text-2xl sm:text-3xl md:text-4xl font-bold text-black mb-8 sm:mb-12 text-center drop-shadow-lg max-w-xl mx-auto leading-tight"
      >
        Why Choose{" "}
        <span className="text-yellow-500 font-bold">The Perfect Buddy</span>
      </motion.h1>

      {/* Main Animated Card */}
      <motion.div
        className="relative bg-white border border-green-200 shadow-xl sm:shadow-2xl rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-10 w-full max-w-5xl hover:shadow-green-200/60 transition-all duration-500"
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7 }}
        viewport={{ once: true }}
        whileHover={{ scale: 1.01 }}
      >
        {/* Spinning tennis ball effect (optional) */}
        <motion.img
          src={tennisBall}
          alt="tennis ball"
          className="absolute -top-6 -right-6 sm:-top-8 sm:-right-8 w-12 h-12 sm:w-16 sm:h-16"
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 6, ease: "linear" }}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 md:gap-10 mt-3 sm:mt-5">
          {/* Feature 1 */}
          <motion.div
            whileHover={{ x: 5 }}
            className="flex items-start gap-3 sm:gap-5"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <div className="bg-gradient-to-br from-green-400 to-yellow-400 p-3 sm:p-4 rounded-xl sm:rounded-2xl shadow-md text-white shrink-0">
              <FaTrophy className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" />
            </div>
            <div>
              <h3 className="font-bold text-base sm:text-lg text-black text-start">
                Skill-Based Matchmaking
              </h3>
              <p className="text-gray-600 text-xs sm:text-sm mt-1 text-start">
                We connect you with players who match your skill level — every
                game feels just right.
              </p>
            </div>
          </motion.div>

          {/* Feature 2 */}
          <motion.div
            whileHover={{ x: 5 }}
            className="flex items-start gap-3 sm:gap-5"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <div className="bg-gradient-to-br from-yellow-400 to-orange-400 p-3 sm:p-4 rounded-xl sm:rounded-2xl shadow-md text-white shrink-0">
              <FaCalendarAlt className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" />
            </div>
            <div>
              <h3 className="font-bold text-base sm:text-lg text-black text-start">
                Smart Scheduling
              </h3>
              <p className="text-gray-600 text-xs sm:text-sm mt-1 text-start">
                Automatically find perfect match times — or create your own
                flexible sessions.
              </p>
            </div>
          </motion.div>

          {/* Feature 3 */}
          <motion.div
            whileHover={{ x: 5 }}
            className="flex items-start gap-3 sm:gap-5"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <div className="bg-gradient-to-br from-green-400 to-cyan-400 p-3 sm:p-4 rounded-xl sm:rounded-2xl shadow-md text-white shrink-0">
              <FaHandshake className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" />
            </div>
            <div>
              <h3 className="font-bold text-base sm:text-lg text-black text-start">
                Trusted Tennis Community
              </h3>
              <p className="text-gray-600 text-xs sm:text-sm mt-1 text-start">
                Rate, review, and build trust — join a respectful and passionate
                player base.
              </p>
            </div>
          </motion.div>

          {/* Feature 4 */}
          <motion.div
            whileHover={{ x: 5 }}
            className="flex items-start gap-3 sm:gap-5"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <div className="bg-gradient-to-br from-green-500 to-emerald-400 p-3 sm:p-4 rounded-xl sm:rounded-2xl shadow-md text-white shrink-0">
              <FaShieldAlt className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" />
            </div>
            <div>
              <h3 className="font-bold text-base sm:text-lg text-black text-start">
                Secure & Verified
              </h3>
              <p className="text-gray-600 text-xs sm:text-sm mt-1 text-start">
                Verified users and encrypted chat ensure every connection is
                safe and genuine.
              </p>
            </div>
          </motion.div>
        </div>

        {/* Decorative glowing line */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[85%] sm:w-[80%] h-[2px] bg-gradient-to-r from-green-400 via-yellow-400 to-green-400 rounded-full mt-6 sm:mt-8 animate-pulse"></div>
      </motion.div>
    </section>
  );
};
