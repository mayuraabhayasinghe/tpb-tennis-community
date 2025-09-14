"use client";
import React from "react";

// Define keyframes for animations
const animationKeyframes = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  
  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.6; }
  }
  
  @keyframes bounce {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-10px); }
  }
  
  .animate-spin-slow {
    animation: spin 2s linear infinite;
  }
  
  .animate-pulse-custom {
    animation: pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  }
  
  .animate-bounce-custom {
    animation: bounce 1s ease-in-out infinite;
  }
`;

const AnimatedLogo = ({
  isLoading = true,
  size = "default",
  type = "spin",
}) => {
  // Size variants
  const sizeClasses = {
    sm: "text-sm",
    default: "text-lg",
    lg: "text-xl",
    xl: "text-2xl",
  };

  // Animation type variants
  const getAnimationClass = () => {
    switch (type) {
      case "spin":
        return "animate-spin-slow";
      case "pulse":
        return "animate-pulse-custom";
      case "bounce":
        return "animate-bounce-custom";
      default:
        return "animate-spin-slow";
    }
  };

  return (
    <>
      {/* Inject the animation keyframes */}
      <style dangerouslySetInnerHTML={{ __html: animationKeyframes }} />

      <div className={`relative ${isLoading ? getAnimationClass() : ""}`}>
        <div
          className={`
            ${sizeClasses[size] || sizeClasses.default} 
            font-bold px-2.5 py-1 rounded-sm
            bg-gradient-to-tr from-black via-gray-600 to-black 
            text-yellow-300 shadow-sm
            flex items-center justify-center
            transition-all duration-300
          `}
        >
          TPB
        </div>
      </div>
    </>
  );
};

export default AnimatedLogo;
