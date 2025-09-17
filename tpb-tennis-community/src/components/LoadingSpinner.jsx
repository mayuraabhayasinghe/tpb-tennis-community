"use client";

import React from "react";
import AnimatedLogo from "./AnimatedLogo";

/**
 * A loading spinner component that uses the AnimatedLogo
 * @param {Object} props - Component props
 * @param {string} props.text - Optional text to display below the spinner
 * @param {string} props.size - Size of the logo ('sm', 'default', 'lg', 'xl')
 * @param {string} props.type - Animation type ('spin', 'pulse', 'bounce')
 * @param {string} props.className - Additional classes for the container
 * @returns {JSX.Element} - The loading spinner component
 */
export const LoadingSpinner = ({
  text = "Loading...",
  size = "default",
  type = "spin",
  className = "",
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center p-4 ${className}`}
    >
      <AnimatedLogo isLoading={true} size={size} type={type} />
      {text && <p className="mt-3 text-sm text-gray-500 font-medium">{text}</p>}
    </div>
  );
};

export default LoadingSpinner;
