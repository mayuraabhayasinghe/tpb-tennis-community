"use client";

import React, { useState } from "react";
import AnimatedLogo from "../components/AnimatedLogo";

import LoadingSpinner from "../components/LoadingSpinner";

/**
 * Demo page to showcase the AnimatedLogo and LoadingSpinner components
 */
const LoadingDemo = () => {
  const [activeDemo, setActiveDemo] = useState(null);

  const toggleDemo = (demo) => {
    if (activeDemo === demo) {
      setActiveDemo(null);
    } else {
      setActiveDemo(demo);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-8">Loading Animation Demo</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Animation Types */}
        <div className="p-6 border rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Animation Types</h2>
          <div className="grid grid-cols-3 gap-4">
            <div className="flex flex-col items-center">
              <p className="text-sm text-gray-500 mb-2">Spin</p>
              <AnimatedLogo type="spin" size="lg" />
            </div>
            <div className="flex flex-col items-center">
              <p className="text-sm text-gray-500 mb-2">Pulse</p>
              <AnimatedLogo type="pulse" size="lg" />
            </div>
            <div className="flex flex-col items-center">
              <p className="text-sm text-gray-500 mb-2">Bounce</p>
              <AnimatedLogo type="bounce" size="lg" />
            </div>
          </div>
        </div>

        {/* Size Variants */}
        <div className="p-6 border rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Size Variants</h2>
          <div className="flex flex-col space-y-4">
            <div className="flex justify-between items-center">
              <p className="text-sm text-gray-500">Small</p>
              <AnimatedLogo size="sm" />
            </div>
            <div className="flex justify-between items-center">
              <p className="text-sm text-gray-500">Default</p>
              <AnimatedLogo size="default" />
            </div>
            <div className="flex justify-between items-center">
              <p className="text-sm text-gray-500">Large</p>
              <AnimatedLogo size="lg" />
            </div>
            <div className="flex justify-between items-center">
              <p className="text-sm text-gray-500">Extra Large</p>
              <AnimatedLogo size="xl" />
            </div>
          </div>
        </div>

        {/* LoadingSpinner Component */}
        <div className="p-6 border rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Loading Spinner</h2>
          <div className="space-y-6">
            <LoadingSpinner text="Loading data..." />
            <LoadingSpinner text="Please wait..." type="pulse" />
            <LoadingSpinner text="Connecting..." type="bounce" />
          </div>
        </div>
      </div>

      <div className="mt-12 space-y-4">
        <h2 className="text-xl font-semibold">Interactive Demos</h2>
        <div className="flex flex-wrap gap-4">
          <button
            onClick={() => toggleDemo("pageLoad")}
            className={`px-4 py-2 rounded-md transition-colors ${
              activeDemo === "pageLoad"
                ? "bg-yellow-400 text-black"
                : "bg-gray-800 text-white hover:bg-gray-700"
            }`}
          >
            {activeDemo === "pageLoad" ? "Stop Demo" : "Page Load Demo"}
          </button>
          <button
            onClick={() => toggleDemo("formSubmit")}
            className={`px-4 py-2 rounded-md transition-colors ${
              activeDemo === "formSubmit"
                ? "bg-yellow-400 text-black"
                : "bg-gray-800 text-white hover:bg-gray-700"
            }`}
          >
            {activeDemo === "formSubmit" ? "Stop Demo" : "Form Submit Demo"}
          </button>
          <button
            onClick={() => toggleDemo("dataFetch")}
            className={`px-4 py-2 rounded-md transition-colors ${
              activeDemo === "dataFetch"
                ? "bg-yellow-400 text-black"
                : "bg-gray-800 text-white hover:bg-gray-700"
            }`}
          >
            {activeDemo === "dataFetch" ? "Stop Demo" : "Data Fetch Demo"}
          </button>
        </div>

        {activeDemo && (
          <div className="mt-6 p-8 border rounded-lg bg-gray-50">
            {activeDemo === "pageLoad" && (
              <div className="flex flex-col items-center">
                <LoadingSpinner text="Loading page content..." size="xl" />
                <p className="mt-4 text-gray-600">
                  Use this loading spinner when the entire page is loading
                </p>
              </div>
            )}

            {activeDemo === "formSubmit" && (
              <div className="max-w-md mx-auto">
                <div className="mb-8 border p-6 rounded-md bg-white shadow-sm">
                  <h3 className="text-lg font-medium mb-4">Contact Form</h3>
                  <div className="space-y-4 opacity-50 pointer-events-none">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Name
                      </label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border rounded-md"
                        value="John Doe"
                        disabled
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email
                      </label>
                      <input
                        type="email"
                        className="w-full px-3 py-2 border rounded-md"
                        value="john@example.com"
                        disabled
                      />
                    </div>
                    <button
                      className="w-full bg-green-600 text-white py-2 rounded-md mt-2"
                      disabled
                    >
                      Submit
                    </button>
                  </div>
                </div>
                <div className="flex flex-col items-center">
                  <LoadingSpinner text="Submitting form..." type="pulse" />
                </div>
              </div>
            )}

            {activeDemo === "dataFetch" && (
              <div className="flex flex-col items-center">
                <div className="w-full max-w-md bg-white border rounded-md p-4 mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-medium">User Profile</h3>
                    <button className="text-sm text-blue-600">Refresh</button>
                  </div>
                  <div className="flex justify-center py-8">
                    <LoadingSpinner
                      text="Fetching user data..."
                      type="bounce"
                    />
                  </div>
                </div>
                <p className="text-gray-600 text-sm">
                  Use this loading spinner when fetching data within a component
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default LoadingDemo;
