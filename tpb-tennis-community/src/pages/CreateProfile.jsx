"use client";

import React, {
  useState,
  useContext,
  useRef,
  useCallback,
  useEffect,
} from "react";
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
import { authContext } from "../context/AuthContext";
import { supabase } from "../services/createClient";
import { useNavigate } from "react-router-dom";

const CreateProfile = ({ onImageUpload, className = "" }) => {
  //Getting user's id to put into profile table's id column
  const { user, loading } = useContext(authContext);
  const [userId, setUserId] = useState(null);
  const navigate = useNavigate();

  // Use useEffect to safely set userId when user data is available
  useEffect(() => {
    if (user && user.id) {
      console.log("User found, setting userId:", user.id);
      console.log("User profile complete status:", user.profile_complete);
      setUserId(user.id);

      // If profile is already complete, redirect to home
      if (user.profile_complete) {
        console.log("User already has a complete profile, redirecting to home");
        navigate("/");
      }
    } else if (!loading) {
      console.log("No user found after loading completed");
    }
  }, [user, loading, navigate]);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [profession, setProfession] = useState("");
  const [contactNo, setContactNo] = useState("");
  const [city, setCity] = useState("");
  const [skillLevel, setSkillLevel] = useState(0);

  // Form validation states
  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    contactNo: "",
  });
  const [isFormValid, setIsFormValid] = useState(false);

  // for upload image
  const [imgSrc, setImgSrc] = useState("");
  const [crop, setCrop] = useState();
  const [completedCrop, setCompletedCrop] = useState(null);
  const [croppedImage, setCroppedImage] = useState(null);
  const imgRef = useRef(null);
  const previewCanvasRef = useRef(null);

  /* Start of functions for image upload */

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

  // Function to generate the cropped image and return a Promise with the URL
  const generateCroppedImage = () => {
    return new Promise((resolve, reject) => {
      if (!completedCrop || !imgRef.current || !previewCanvasRef.current) {
        reject("Missing required elements for cropping");
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
            reject("Canvas is empty");
            return;
          }

          const croppedImageUrl = URL.createObjectURL(blob);
          setCroppedImage(croppedImageUrl);

          // Log the cropped image URL to see its value
          console.log("Cropped image URL:", croppedImageUrl);

          // Call the callback function if provided
          if (onImageUpload) {
            onImageUpload(croppedImageUrl);
          }

          resolve(croppedImageUrl);
        },
        "image/jpeg",
        0.95
      );
    });
  };

  // Function to handle the save button
  const handleSaveClick = async () => {
    try {
      // Generate the cropped image and wait for it to complete
      const newCroppedImage = await generateCroppedImage();

      // Log the newly created cropped image URL
      console.log("Final croppedImage value:", newCroppedImage);

      // Hide the cropping canvas after applying the crop
      setImgSrc("");
    } catch (error) {
      console.error("Error during image cropping:", error);
    }
  };

  /* End of functions for image upload */

  /* ---------------- */

  /*
  Start of the functions for form validation
  */

  // Validate form fields
  const validateField = (name, value) => {
    let error = "";

    switch (name) {
      case "firstName":
        if (!value.trim()) {
          error = "First name is required";
        }
        break;
      case "lastName":
        if (!value.trim()) {
          error = "Last name is required";
        }
        break;
      case "contactNo":
        if (!value.trim()) {
          error = "Contact number is required";
        } else if (!/^[0-9]{3}-[0-9]{3}-[0-9]{4}$|^[0-9]{10}$/.test(value)) {
          error =
            "Please enter a valid contact number (10 digits or format 071-234-5678)";
        }
        break;
      default:
        break;
    }

    return error;
  };

  // Update validation whenever form fields change
  const validateForm = () => {
    const firstNameError = validateField("firstName", firstName);
    const lastNameError = validateField("lastName", lastName);
    const contactNoError = validateField("contactNo", contactNo);

    setErrors({
      firstName: firstNameError,
      lastName: lastNameError,
      contactNo: contactNoError,
    });

    // Form is valid if there are no errors
    return !firstNameError && !lastNameError && !contactNoError;
  };

  // Handle input field changes with validation
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Update the state based on input name
    switch (name) {
      case "firstName":
        setFirstName(value);
        break;
      case "lastName":
        setLastName(value);
        break;
      case "contactNo":
        setContactNo(value);
        break;
      case "profession":
        setProfession(value);
        break;
      case "city":
        setCity(value);
        break;
      default:
        break;
    }

    // Validate the changed field
    const fieldError = validateField(name, value);
    setErrors((prev) => ({
      ...prev,
      [name]: fieldError,
    }));
  };

  // Check form validity whenever relevant fields change
  React.useEffect(() => {
    const isValid = validateForm();
    setIsFormValid(isValid);
  }, [firstName, lastName, contactNo]);

  /*
  End of the functions for form validation
  */

  /* ---------------- */

  /*
  Start of the functions for converting blob to jpeg file, uploading to the bucket
  */

  //convert croppedImage's value(Blob URL) to a file
  const convertBlopUrlToFile = async (blobUrl, fileName = "profile.jpg") => {
    //Fetch blob data from the URL
    const response = await fetch(blobUrl);
    const blob = await response.blob();

    //Create a File object from the blob
    const file = new File([blob], fileName, { type: blob.type });
    return file;
  };

  //Function to upload profile picture to the subabase storage
  const uploadProfilePic = async (userId, file) => {
    const { data, error } = await supabase.storage
      .from("avatar")
      .upload(`${userId}.jpg`, file, { cacheControl: "3600", upsert: true });

    if (error) {
      console.log("Profile picture upload error: ", error);
      return null;
    }

    return data.path;
  };

  /*
  End of the functions for converting blob to jpeg file, uploading to the bucket
  */

  /* ---------------- */

  const handleSubmission = async (e) => {
    e.preventDefault();

    // Check if userId is available
    if (!userId) {
      console.error("User ID not available. Please log in again.");
      alert("Authentication error. Please log in again.");
      return;
    }

    // Validate all fields before submission
    const isValid = validateForm();
    if (!isValid) {
      return; // Stop submission if form is not valid
    }

    // Initialize avatarPath variable outside the if block
    let avatarPath = null;

    //convert the croppedImage(Blob URL) to JPEG file called avatarFile
    if (croppedImage) {
      const avatarFile = await convertBlopUrlToFile(croppedImage);
      avatarPath = await uploadProfilePic(userId, avatarFile);
    }

    //update the row where id equals to userId
    console.log("Updating profile for user:", userId);
    console.log("Setting isProfileComplete to true");

    const { data, error } = await supabase
      .from("profiles")
      .update({
        avatar_path: avatarPath, // avatarPath will be null if no image was uploaded
        first_name: firstName,
        last_name: lastName,
        profession: profession || null,
        contact_no: contactNo,
        city: city || null,
        skill_level: skillLevel,
        isProfileComplete: true, // This is critical - set to true when profile is complete
      })
      .eq("id", userId)
      .select();

    if (error) {
      console.error("Profile update error:", error.message);
      alert("Failed to create your profile. Try again!");
      return;
    }

    setTimeout(function () {
      setFirstName("");
    setLastName("");
    setProfession("");
    setContactNo("");
    setCity("");
    setCroppedImage(null);
    }, 2000);

    console.log("Profile updated successfully:", data);
    
    alert("Profile created successfully!");

    // Force a refresh of the auth state to pick up the profile_complete change
    // const { data: sessionData } = await supabase.auth.getSession();
    // if (sessionData?.session) {
    //   console.log("Refreshing auth session to update profile_complete state");
    //   const { data: refreshData } = await supabase.auth.refreshSession();
    //   console.log("Session refreshed:", !!refreshData);
    // }

    // Navigate to home page after profile creation
    navigate("/");
  };
  // Handle authentication and loading states
  // if (loading) {
  //   return (
  //     <>
  //       <Navbar />
  //       <div className="flex items-center justify-center min-h-screen">
  //         <div className="p-8 m-4 bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded-lg shadow-sm">
  //           <h2 className="text-xl font-semibold mb-2">Loading your profile...</h2>
  //           <p>Please wait while we set up your profile creation page</p>
  //         </div>
  //       </div>
  //     </>
  //   );
  // }

  // if (!user) {
  //   // If user is not authenticated after loading completes
  //   return (
  //     <>
  //       <Navbar />
  //       <div className="flex items-center justify-center min-h-screen">
  //         <div className="p-8 bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded-lg shadow-sm">
  //           <h2 className="text-xl font-semibold mb-2 text-red-600">Authentication Error</h2>
  //           <p>Please <a href="/login" className="text-green-600 underline">log in</a> to create your profile.</p>
  //         </div>
  //       </div>
  //     </>
  //   );
  // }

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
              <form className="space-y-4" onSubmit={handleSubmission}>
                {}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    First Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={firstName}
                    onChange={handleInputChange}
                    onBlur={() => validateField("firstName", firstName)}
                    placeholder="Ex: Jhone"
                    className={`signin-input w-full px-3 py-2 bg-white dark:bg-black border ${
                      errors.firstName
                        ? "border-red-500"
                        : "border-gray-200 dark:border-gray-800"
                    } rounded-md text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:outline-none focus:ring-2 ${
                      errors.firstName
                        ? "focus:ring-red-500"
                        : "focus:ring-gray-900 dark:focus:ring-gray-100"
                    } focus:border-transparent transition-all duration-200`}
                  />
                  {errors.firstName && (
                    <p className="text-xs text-red-500 mt-1">
                      {errors.firstName}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    Last Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={lastName}
                    onChange={handleInputChange}
                    onBlur={() => validateField("lastName", lastName)}
                    placeholder="Ex: Doe"
                    className={`signin-input w-full px-3 py-2 bg-white dark:bg-black border ${
                      errors.lastName
                        ? "border-red-500"
                        : "border-gray-200 dark:border-gray-800"
                    } rounded-md text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:outline-none focus:ring-2 ${
                      errors.lastName
                        ? "focus:ring-red-500"
                        : "focus:ring-gray-900 dark:focus:ring-gray-100"
                    } focus:border-transparent transition-all duration-200`}
                  />
                  {errors.lastName && (
                    <p className="text-xs text-red-500 mt-1">
                      {errors.lastName}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    Profession
                  </label>
                  <input
                    type="text"
                    name="profession"
                    value={profession}
                    onChange={handleInputChange}
                    placeholder="Ex: Freelancer"
                    className="signin-input w-full px-3 py-2 bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded-md text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-gray-100 focus:border-transparent transition-all duration-200"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    Contact Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="contactNo"
                    value={contactNo}
                    onChange={handleInputChange}
                    onBlur={() => validateField("contactNo", contactNo)}
                    placeholder="Ex: 071-XXX-XXXX"
                    className={`signin-input w-full px-3 py-2 bg-white dark:bg-black border ${
                      errors.contactNo
                        ? "border-red-500"
                        : "border-gray-200 dark:border-gray-800"
                    } rounded-md text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:outline-none focus:ring-2 ${
                      errors.contactNo
                        ? "focus:ring-red-500"
                        : "focus:ring-gray-900 dark:focus:ring-gray-100"
                    } focus:border-transparent transition-all duration-200`}
                  />
                  {errors.contactNo && (
                    <p className="text-xs text-red-500 mt-1">
                      {errors.contactNo}
                    </p>
                  )}
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
                    <SelectContent
                      value={skillLevel}
                      onChange={(e) => setSkillLevel(Number(e.target.value))}
                    >
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
                  disabled={!isFormValid}
                  onClick={handleSubmission}
                  className=" mt-4.5 signin-button w-full bg-green-600 dark:bg-gray-100 text-white dark:text-gray-900 py-2 px-4 rounded-md text-sm font-medium hover:bg-green-700 dark:hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-gray-100 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-black transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Create Profile
                </button>

                {(!firstName || !lastName || !contactNo) && (
                  <p className="text-xs text-center text-amber-500 mt-2">
                    * Required fields must be filled
                  </p>
                )}
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
