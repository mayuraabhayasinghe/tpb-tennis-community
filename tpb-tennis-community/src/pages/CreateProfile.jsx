"use client";

import React, { useState, useRef, useCallback } from "react";
import ReactCrop, { centerCrop, makeAspectCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { Navbar } from "../components/Navbar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const CreateProfile = ({ onImageUpload, className = "" }) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [profession, setProfession] = useState("");
  const [contactNo, setContactNo] = useState("");
  const [city, setCity] = useState("");
  // for upload image
  const [imgSrc, setImgSrc] = useState("");
  const [crop, setCrop] = useState();
  const [completedCrop, setCompletedCrop] = useState(null);
  const [croppedImage, setCroppedImage] = useState(null);
  const imgRef = useRef(null);
  const previewCanvasRef = useRef(null);

  //functions for image upload
  // Function to handle file selection
  const onSelectFile = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader();
      reader.addEventListener("load", () => {
        setImgSrc(reader.result.toString() || "");
        setCrop(undefined); // Reset crop when loading a new image
      });
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  // Function to create initial centered crop - maintains fixed aspect ratio
  const onImageLoad = useCallback((e) => {
    const { width, height } = e.currentTarget;

    // Always use a 1:1 aspect ratio for profile pictures
    const crop = centerCrop(
      makeAspectCrop(
        {
          unit: "%",
          width: width >= 768 ? 60 : 85, // Responsive width - smaller on desktop, larger on mobile
        },
        1, // Square aspect ratio (1:1)
        width,
        height
      ),
      width,
      height
    );
    setCrop(crop);
  }, []);

  // Function to generate the cropped image
  const generateCroppedImage = () => {
    if (!completedCrop || !imgRef.current || !previewCanvasRef.current) {
      return;
    }

    const image = imgRef.current;
    const canvas = previewCanvasRef.current;
    const crop = completedCrop;

    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    const ctx = canvas.getContext("2d");

    const pixelRatio = window.devicePixelRatio;

    canvas.width = crop.width * pixelRatio;
    canvas.height = crop.height * pixelRatio;

    ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    ctx.imageSmoothingQuality = "high";

    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width,
      crop.height
    );

    // Convert canvas to blob then to URL
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          console.error("Canvas is empty");
          return;
        }

        const croppedImageUrl = URL.createObjectURL(blob);
        setCroppedImage(croppedImageUrl);

        // Call the callback function if provided
        if (onImageUpload) {
          onImageUpload(croppedImageUrl);
        }
      },
      "image/jpeg",
      0.95
    );
  };

  // Function to handle the save button
  const handleSaveClick = () => {
    generateCroppedImage();
    // Hide the cropping canvas after applying the crop
    setImgSrc("");
  };
  //

  return (
    <>
      <Navbar />
      <div className="mt-14 md:mt-24 flex items-center justify-center p-4">
        <div className="w-full max-w-4xl mx-auto">
          {}
          <div className="signin-card bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded-lg shadow-md px-3 md:px-6 py-8">
            {/* header of the profile form */}
            <div className="text-center mb-3.5 md:mb-8">
              <h1 className="text-xl md:text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-6">
                Create your profile
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Enter your details to get started. <br />{" "}
                <span className="text-[12px] text-gray-400">
                  You can edit your profile later.
                </span>
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* left part of profile form - Upload profile picture */}
              <div className="flex-col justify-start pt-6 h-full w-full ">
                <div
                  className={`flex flex-col items-center justify-center  my-auto ${className}`}
                >
                  <div className="flex flex-col items-center  w-full">
                    <div className="flex flex-col items-center justify-center">
                      <div className="relative flex flex-col items-center justify-center">
                        {/* Hidden file input that will be triggered by the avatar click */}
                        <input
                          type="file"
                          id="profile-upload"
                          accept="image/*"
                          onChange={onSelectFile}
                          className="hidden"
                        />

                        {/* Avatar with person icon and edit overlay */}
                        <label
                          htmlFor="profile-upload"
                          className="cursor-pointer block mx-auto"
                        >
                          <div className="w-28 h-28 sm:w-32 sm:h-32 md:w-40 md:h-40 rounded-full bg-gray-200 flex items-center justify-center relative overflow-hidden shadow-md mx-auto">
                            {/* Person icon when no image is selected */}
                            {!croppedImage && (
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-12 w-12 sm:h-14 sm:w-14 md:h-16 md:w-16 text-gray-400"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={1.5}
                                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                />
                              </svg>
                            )}

                            {/* Display cropped image if available */}
                            {croppedImage && (
                              <div
                                className="absolute inset-0 bg-center bg-cover"
                                style={{
                                  backgroundImage: `url(${croppedImage})`,
                                }}
                              />
                            )}

                            {/* Edit overlay */}
                            <div className="absolute inset-0 bg-black bg-opacity-20 opacity-0 hover:opacity-60 flex items-center justify-center transition-opacity duration-200">
                              <div className="bg-white rounded-full p-2">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-6 w-6 text-gray-700"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                                  />
                                </svg>
                              </div>
                            </div>
                          </div>
                        </label>

                        <p className="mt-4 text-center text-sm text-gray-500 mx-auto">
                          Click to {croppedImage ? "change" : "upload"} profile
                          picture
                        </p>
                      </div>
                    </div>

                    {imgSrc && (
                      <div className="mt-4 bg-white rounded-lg shadow-sm p-4 w-full max-w-md mx-auto">
                        <h3 className="text-md font-medium mb-1">
                          Crop Your Picture
                        </h3>
                        <p className="text-xs text-gray-500 mb-2">
                          Drag to reposition. Resize using the corners.
                        </p>
                        <div className="border rounded-lg p-1.5 sm:p-2 bg-gray-50 max-h-[300px] overflow-auto">
                          <ReactCrop
                            crop={crop}
                            onChange={(_, percentCrop) => setCrop(percentCrop)}
                            onComplete={(c) => setCompletedCrop(c)}
                            aspect={1} // Fixed 1:1 aspect ratio
                            circularCrop
                          >
                            <img
                              ref={imgRef}
                              alt="Upload"
                              src={imgSrc}
                              onLoad={onImageLoad}
                              className="max-w-full mx-auto"
                              style={{ maxHeight: "250px" }}
                            />
                          </ReactCrop>
                        </div>
                        <div className="mt-4 flex justify-center">
                          <button
                            type="button"
                            className="px-3 py-1.5 sm:px-4 sm:py-2 text-sm bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            onClick={handleSaveClick}
                          >
                            Apply Crop
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Hidden canvas used for cropping */}
                  <div className="hidden">
                    <canvas ref={previewCanvasRef} />
                  </div>
                </div>
              </div>

              {/* right part of profile form */}
              <form className="space-y-4">
                {}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    First Name
                  </label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="Ex: Jhone"
                    className="signin-input w-full px-3 py-2 bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded-md text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-gray-100 focus:border-transparent transition-all duration-200"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    Last Name
                  </label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Ex: Doe"
                    className="signin-input w-full px-3 py-2 bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded-md text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-gray-100 focus:border-transparent transition-all duration-200"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    Profession
                  </label>
                  <input
                    type="text"
                    value={profession}
                    onChange={(e) => setProfession(e.target.value)}
                    placeholder="Ex: Freelancer"
                    className="signin-input w-full px-3 py-2 bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded-md text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-gray-100 focus:border-transparent transition-all duration-200"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    Contact Number
                  </label>
                  <input
                    type="text"
                    value={contactNo}
                    onChange={(e) => setContactNo(e.target.value)}
                    placeholder="Ex: 071-XXX-XXXX"
                    className="signin-input w-full px-3 py-2 bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded-md text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-gray-100 focus:border-transparent transition-all duration-200"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    Where Are You From?
                  </label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Ex: Colombo"
                    className="signin-input w-full px-3 py-2 bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded-md text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-gray-100 focus:border-transparent transition-all duration-200"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    Select Your Skill Level?
                  </label>
                  <Select>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="0" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">0</SelectItem>
                      <SelectItem value="1">1</SelectItem>
                      <SelectItem value="2">2</SelectItem>
                      <SelectItem value="3">3</SelectItem>
                      <SelectItem value="4">4</SelectItem>
                      <SelectItem value="5">5</SelectItem>
                      <SelectItem value="6">6</SelectItem>
                      <SelectItem value="7">7</SelectItem>
                      <SelectItem value="8">8</SelectItem>
                      <SelectItem value="9">9</SelectItem>
                      <SelectItem value="10">10</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {}
                <button
                  type="submit"
                  className=" mt-4.5 signin-button w-full bg-green-600 dark:bg-gray-100 text-white dark:text-gray-900 py-2 px-4 rounded-md text-sm font-medium hover:bg-green-700 dark:hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-gray-100 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-black transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Create Profile
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default CreateProfile;
const styles = `
  .signin-input:focus {
    box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.1);
  }

  .dark .signin-input:focus {
    box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.1);
  }

  .signin-button:hover {
    transform: translateY(-1px);
  }

  .signin-checkbox:checked + label .checkbox-icon {
    background-color: currentColor;
  }

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .signin-card {
    animation: fadeIn 0.3s ease-out;
  }
`;
if (typeof document !== "undefined") {
  const styleSheet = document.createElement("style");
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);
}
