// HowItWorksZigZagClean.jsx
import React, { useEffect } from "react";
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";
import {
  FaUserPlus,
  FaSignInAlt,
  FaUserEdit,
  FaCalendarPlus,
  FaEnvelopeOpenText,
  FaCheckCircle,
  FaTrophy,
} from "react-icons/fa";

export const HowItWorksZigZagClean = () => {
  const controls = useAnimation();
  const [ref, inView] = useInView({ threshold: 0.3, triggerOnce: true }); // <-- animate only once

  useEffect(() => {
    if (inView) controls.start("visible");
  }, [controls, inView]);

  const steps = [
    {
      icon: <FaUserPlus />,
      title: "Sign Up",
      description: "Create your account to get started on The Perfect Buddy.",
    },
    {
      icon: <FaSignInAlt />,
      title: "Login",
      description:
        "Access your account and explore available games and players.",
    },
    {
      icon: <FaUserEdit />,
      title: "Make Profile",
      description:
        "Set up your profile with skills, interests, and preferences.",
    },
    {
      icon: <FaCalendarPlus />,
      title: "Host Game",
      description: "Create a game session and invite other players to join.",
    },
    {
      icon: <FaEnvelopeOpenText />,
      title: "Requests",
      description: "Receive or send requests to join games hosted by others.",
    },
    {
      icon: <FaCheckCircle />,
      title: "Accept / Decline",
      description:
        "Review incoming requests and accept or decline them easily.",
    },
    {
      icon: <FaUserEdit />,
      title: "Prepare",
      description: "Get ready with necessary details and communication.",
    },
    {
      icon: <FaCalendarPlus />,
      title: "Play",
      description: "Enjoy your scheduled game session with other participants.",
    },
    {
      icon: <FaTrophy />,
      title: "Rate & Repeat",
      description: "Rate your experience and host or join more games again!",
    },
  ];

  const boxVariant = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { delay: i * 0.15, duration: 0.4, ease: "easeOut" },
    }),
  };

  const arrowVariant = {
    hidden: { opacity: 0 },
    visible: (i) => ({
      opacity: 1,
      transition: { delay: i * 0.15 + 0.1, duration: 0.3 },
    }),
  };

  const ArrowRight = () => (
    <svg
      className="w-10 sm:w-12 md:w-15"
      height="20"
      viewBox="0 0 60 20"
      fill="none"
    >
      <line
        x1="2"
        y1="10"
        x2="50"
        y2="10"
        stroke="#16A34A"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <polygon points="50,5 58,10 50,15" fill="#16A34A" />
    </svg>
  );

  const ArrowLeft = () => (
    <svg
      className="w-10 sm:w-12 md:w-15"
      height="20"
      viewBox="0 0 60 20"
      fill="none"
    >
      <line
        x1="58"
        y1="10"
        x2="10"
        y2="10"
        stroke="#16A34A"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <polygon points="10,5 2,10 10,15" fill="#16A34A" />
    </svg>
  );

  const ArrowDown = () => (
    <svg
      className="w-4 sm:w-5 md:w-6"
      height="40"
      viewBox="0 0 20 50"
      fill="none"
    >
      <line
        x1="10"
        y1="2"
        x2="10"
        y2="40"
        stroke="#16A34A"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <polygon points="5,40 15,40 10,48" fill="#16A34A" />
    </svg>
  );

  return (
    <section
      ref={ref}
      className="flex flex-col items-center bg-white py-12 sm:py-16 md:py-20 px-4 sm:px-6 md:px-8"
    >
      <motion.h1
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="text-2xl sm:text-3xl md:text-4xl text-black font-bold mb-8 sm:mb-12 text-center drop-shadow-lg max-w-xl mx-auto leading-tight"
      >
        How It <span className="text-yellow-500 font-bold">Works</span>
      </motion.h1>

      {/* Desktop layout */}
      <div className="hidden md:flex flex-col items-center justify-center max-w-7xl mx-auto w-full">
        {/* Row 1 */}
        <div className="flex items-center justify-center w-full">
          {steps.slice(0, 3).map((step, i) => (
            <React.Fragment key={i}>
              <motion.div
                custom={i}
                initial="hidden"
                animate={controls}
                variants={boxVariant}
                className="bg-white rounded-xl sm:rounded-2xl shadow-md hover:shadow-lg p-6 sm:p-8 mx-2 sm:mx-4 w-full sm:w-72 text-center flex flex-col items-center transition-shadow duration-300"
              >
                <div className="text-green-500 text-2xl sm:text-3xl md:text-4xl mb-2 sm:mb-3">
                  {step.icon}
                </div>
                <p className="font-semibold text-base sm:text-lg">
                  {step.title}
                </p>
                <p className="text-gray-500 text-xs sm:text-sm mt-1 sm:mt-2">
                  {step.description}
                </p>
              </motion.div>

              {i < 2 && (
                <motion.div
                  custom={i}
                  initial="hidden"
                  animate={controls}
                  variants={arrowVariant}
                  className="flex items-center mx-1 sm:mx-2"
                >
                  <ArrowRight />
                </motion.div>
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Arrow down */}
        <div className="flex justify-center my-2 sm:my-4">
          <motion.div
            initial="hidden"
            animate={controls}
            variants={arrowVariant}
            custom={3}
            className="translate-x-[18rem] sm:translate-x-[22rem]"
          >
            <ArrowDown />
          </motion.div>
        </div>

        {/* Row 2 */}
        <div className="flex items-center justify-center w-full">
          {steps
            .slice(3, 6)
            .reverse()
            .map((step, i) => (
              <React.Fragment key={i}>
                <motion.div
                  custom={i + 3}
                  initial="hidden"
                  animate={controls}
                  variants={boxVariant}
                  className="bg-white rounded-xl sm:rounded-2xl shadow-md hover:shadow-lg p-6 sm:p-8 mx-2 sm:mx-4 w-full sm:w-72 text-center flex flex-col items-center transition-shadow duration-300"
                >
                  <div className="text-green-500 text-2xl sm:text-3xl md:text-4xl mb-2 sm:mb-3">
                    {step.icon}
                  </div>
                  <p className="font-semibold text-base sm:text-lg">
                    {step.title}
                  </p>
                  <p className="text-gray-500 text-xs sm:text-sm mt-1 sm:mt-2">
                    {step.description}
                  </p>
                </motion.div>

                {i < 2 && (
                  <motion.div
                    custom={i + 3}
                    initial="hidden"
                    animate={controls}
                    variants={arrowVariant}
                    className="flex items-center mx-1 sm:mx-2"
                  >
                    <ArrowLeft />
                  </motion.div>
                )}
              </React.Fragment>
            ))}
        </div>

        {/* Arrow down */}
        <div className="flex justify-center my-2 sm:my-4">
          <motion.div
            initial="hidden"
            animate={controls}
            variants={arrowVariant}
            custom={6}
            className="-translate-x-[18rem] sm:-translate-x-[22rem]"
          >
            <ArrowDown />
          </motion.div>
        </div>

        {/* Row 3 */}
        <div className="flex items-center justify-center w-full">
          {steps.slice(6, 9).map((step, i) => (
            <React.Fragment key={i}>
              <motion.div
                custom={i + 6}
                initial="hidden"
                animate={controls}
                variants={boxVariant}
                className="bg-white rounded-xl sm:rounded-2xl shadow-md hover:shadow-lg p-6 sm:p-8 mx-2 sm:mx-4 w-full sm:w-72 text-center flex flex-col items-center transition-shadow duration-300"
              >
                <div className="text-green-500 text-2xl sm:text-3xl md:text-4xl mb-2 sm:mb-3">
                  {step.icon}
                </div>
                <p className="font-semibold text-base sm:text-lg">
                  {step.title}
                </p>
                <p className="text-gray-500 text-xs sm:text-sm mt-1 sm:mt-2">
                  {step.description}
                </p>
              </motion.div>

              {i < 2 && (
                <motion.div
                  custom={i + 6}
                  initial="hidden"
                  animate={controls}
                  variants={arrowVariant}
                  className="flex items-center mx-1 sm:mx-2"
                >
                  <ArrowRight />
                </motion.div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Mobile layout */}
      <div className="flex flex-col md:hidden items-center justify-center w-full max-w-md mx-auto">
        {steps.map((step, i) => (
          <React.Fragment key={i}>
            <motion.div
              custom={i}
              initial="hidden"
              animate={controls}
              variants={boxVariant}
              className="bg-white rounded-xl shadow-md hover:shadow-lg p-5 sm:p-6 w-[90%] text-center flex flex-col items-center my-3 transition-shadow duration-300"
            >
              <div className="text-green-500 text-2xl sm:text-3xl mb-2">
                {step.icon}
              </div>
              <p className="font-semibold text-base sm:text-lg mb-1">
                {step.title}
              </p>
              <p className="text-gray-500 text-xs sm:text-sm">
                {step.description}
              </p>
            </motion.div>

            {i < steps.length - 1 && (
              <motion.div
                custom={i}
                initial="hidden"
                animate={controls}
                variants={arrowVariant}
                className="flex justify-center my-1 sm:my-2 scale-75 sm:scale-90"
              >
                <ArrowDown />
              </motion.div>
            )}
          </React.Fragment>
        ))}
      </div>
    </section>
  );
};
