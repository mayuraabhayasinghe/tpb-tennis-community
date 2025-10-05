import React, { useState, useEffect, useRef, useCallback } from "react";
import { Navbar } from "../components/Navbar";
import { UserAuth } from "../context/AuthContext";
import { useParams } from "react-router-dom";
import { Button } from "../components/ui/button";
import { MdOutlineAlarmAdd } from "react-icons/md";
import Modal from "../components/ui/modal";
import ReactCrop, { centerCrop, makeAspectCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { supabase } from "../services/createClient";
import toast from "react-hot-toast";

// Sample user data - replace with actual user data from your backend
const defaultUserData = {
  id: "user123",
  first_name: "Michael",
  last_name: "Johnson",
  username: "@tennischamp",
  avatar_url:
    "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
  bio: "Tennis enthusiast looking to improve my game and meet new playing partners.",
  city: "Melbourne",
  profession: "Software Engineer",
  skill_level: "Intermediate",
  rating: 1450,
  joinDate: "March 2023",
  gamesHosted: 12,
};

const Profile = () => {
  const { session } = UserAuth();
  const id = session?.user?.id;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editData, setEditData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [imageUploading, setImageUploading] = useState(false);
  // For a real application, this would come from your API or context
  const [userData, setUserData] = useState({});

  // For profile image crop functionality
  const [imgSrc, setImgSrc] = useState("");
  const [crop, setCrop] = useState();
  const [completedCrop, setCompletedCrop] = useState(null);
  const [croppedImage, setCroppedImage] = useState(null);
  const imgRef = useRef(null);
  const previewCanvasRef = useRef(null);

  const fetchUserAndGameCount = async function () {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select()
        .eq("id", id);

      if (error) throw error;

      console.log("Data fetched: ", data);

      // If data is an array, take the first element
      if (data && Array.isArray(data) && data.length > 0) {
        setUserData(data[0]);

        // Initialize edit data with current values
        setEditData({
          first_name: data[0].first_name,
          last_name: data[0].last_name,
          username: data[0].username,
          bio: data[0].bio,
          city: data[0].city,
          profession: data[0].profession,
          skill_level: data[0].skill_level,
          avatar_url: data[0].avatar_url,
        });
      } else {
        throw new Error("User profile not found");
      }
    } catch (error) {
      console.log("Failed to load the profile:", error.message);
      setError(error.message);
      toast.error("Failed to load profile. Try Again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserAndGameCount();
  }, [id]);

  // Initialize cropped image when userData changes
  useEffect(() => {
    if (userData && userData.avatar_url) {
      setCroppedImage(userData.avatar_url);
    }
  }, [userData]);

  // Function to handle file selection
  const onSelectFile = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];

      // Store the original file type in a data attribute to remember it
      const reader = new FileReader();
      reader.addEventListener("load", () => {
        const result = reader.result.toString() || "";
        // Store the file type as a custom data attribute in the image element
        setImgSrc(result);

        // Log the file type for debugging
        console.log("Selected image type:", file.type);

        // Reset crop when loading a new image
        setCrop(undefined);
      });
      reader.readAsDataURL(file);
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

          // Do NOT set blob URL in editData - this will be handled during submission
          // when we get the proper Supabase URL

          resolve(croppedImageUrl);
        },
        "image/jpeg",
        0.95
      );
    });
  };

  //convert croppedImage's value(Blob URL) to a file
  const convertBlopUrlToFile = async (blobUrl, fileName = "profile.jpg") => {
    try {
      //Fetch blob data from the URL
      const response = await fetch(blobUrl);
      const blob = await response.blob();

      // Determine file extension based on MIME type
      let extension = "jpg"; // Default
      if (blob.type) {
        const mimeType = blob.type.split("/");
        if (mimeType.length > 1) {
          extension = mimeType[1] === "jpeg" ? "jpg" : mimeType[1];
        }
      }

      //Create a File object from the blob with proper extension
      const fileNameWithExt = `profile.${extension}`;
      const file = new File([blob], fileNameWithExt, { type: blob.type });

      console.log("File created:", file.name, file.type, file.size);
      return { file, extension };
    } catch (error) {
      console.error("Error converting blob URL to file:", error);
      throw error;
    }
  };

  // Function to handle the save button
  const handleSaveClick = async () => {
    // Generate the cropped image and wait for it to complete
    await generateCroppedImage();

    // Hide the cropping canvas after applying the crop
    setImgSrc("");
  };

  // Handle profile update
  const handleUpdateProfile = async () => {
    setLoading(true);
    try {
      const updates = {};
      const skipFields = ["avatar_url"]; // Fields to skip in the initial comparison

      // First, collect all non-image updates
      Object.keys(editData).forEach((key) => {
        // Skip blob URLs and only process regular fields
        if (!skipFields.includes(key) && editData[key] !== userData[key]) {
          updates[key] = editData[key];
        }
      });

      // Handling profile picture uploading
      if (croppedImage && croppedImage !== userData.avatar_url) {
        try {
          setImageUploading(true);

          // Convert the cropped image to a file
          const { file, extension } = await convertBlopUrlToFile(croppedImage);

          const filename = `profile_pictures/${id}.${extension}`;

          // Upload file to the avatar bucket
          const { data: storageData, error: storageError } =
            await supabase.storage.from("avatar").upload(filename, file, {
              contentType: file.type, // This ensures the server knows the correct type
              upsert: true, // overwrite if exists
            });

          if (storageError) {
            console.error("Storage upload error:", storageError);
            throw storageError;
          }

          console.log("Upload successful:", storageData);

          // Get public URL of saved file with cache busting
          const baseUrl = supabase.storage.from("avatar").getPublicUrl(filename)
            .data.publicUrl;

          // Add a timestamp query parameter to prevent browser caching
          const publicUrl = `${baseUrl}?t=${new Date().getTime()}`;

          console.log("Public URL generated with cache busting:", publicUrl);

          // Add the Supabase URL to updates (not the blob URL)
          updates.avatar_url = publicUrl;
        } catch (error) {
          console.error("Error during image upload:", error);
          toast.error("Failed to upload profile image: " + error.message);
          // Continue with other updates even if image upload fails
        } finally {
          setImageUploading(false);
        }
      }

      // If nothing changed
      if (Object.keys(updates).length === 0) {
        console.log("No changes detected.");
        setIsModalOpen(false);
        return;
      }

      console.log("Sending updates to Supabase:", updates);

      // Send updates to the Supabase
      const { data, error } = await supabase
        .from("profiles")
        .update(updates)
        .eq("id", id) // Using id from useParams
        .select();

      if (error) {
        console.error("Supabase update error:", error);
        throw error;
      }

      // Update the local state with edited data
      setUserData((prev) => ({
        ...prev,
        ...updates,
      }));

      // Close the modal
      setIsModalOpen(false);

      // Show success notification
      console.log("Profile updated successfully", data);
      toast.success("Profile updated successfully.");
    } catch (error) {
      console.error("Error updating profile:", error.message);
      setError(error.message);
      toast.error("Error updating profile.");
    } finally {
      setLoading(false);
    }
  };

  // Simple section component to display user information
  const InfoSection = ({ value, className }) => {
    return (
      <div className={`${className}`}>
        <p className="font-sans text-gray-900">{value || ""}</p>
      </div>
    );
  };

  return (
    <>
      <Navbar />
      <div className="pt-8 md:pt-20 min-h-screen bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 py-6">
          {/* Profile Card */}
          <div className="bg-white rounded-lg shadow-lg ">
            {/* Loading indicator */}
            {loading && (
              <div className="text-center py-4">
                <div
                  className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
                  role="status"
                >
                  <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
                    Loading...
                  </span>
                </div>
              </div>
            )}

            {/* Profile Content */}
            <div className="px-5 md:px-8 py-6">
              <div className="w-full flex flex-col md:flex-row md:justify-between items-center">
                {/* Profile picture, full, user name, host status */}
                <div className="pt-6 flex flex-col md:flex-row justify-start items-center gap-5">
                  {/* Profile Picture */}
                  <div className="rounded-full ring-4 ring-white bg-white overflow-hidden h-24 w-24">
                    {userData && userData.avatar_url ? (
                      <img
                        src={userData.avatar_url}
                        alt={userData.first_name || "Profile"}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center bg-gray-200">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-12 w-12 text-gray-400"
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
                      </div>
                    )}
                  </div>

                  {/* User Name */}
                  <div className="mt-2 mb-4">
                    <div className="flex flex-col items-center md:items-start">
                      <div className="flex items-center justify-center gap-2">
                        <h1 className="text-2xl font-bold text-gray-900">
                          {userData && (
                            <>
                              {userData.first_name} {userData.last_name}
                            </>
                          )}
                        </h1>
                        {userData && userData.gamesHosted > 0 && (
                          <span className="hidden md:inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="12"
                              height="12"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="mr-1"
                            >
                              <path d="M12 18a6 6 0 1 0 0-12 6 6 0 0 0 0 12Z"></path>
                              <path d="m9 9 6 6"></path>
                              <path d="m15 9-6 6"></path>
                            </svg>
                            Active Host
                          </span>
                        )}
                      </div>
                      <p className="text-gray-500">{userData?.username}</p>
                    </div>
                  </div>
                </div>

                {/* rating and in mobile rating with active status */}
                <div className="flex mt-2 mb-3 items-center gap-8">
                  {userData?.gamesHosted > 0 && (
                    <span className="inline-flex md:hidden items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="12"
                        height="12"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="mr-1"
                      >
                        <path d="M12 18a6 6 0 1 0 0-12 6 6 0 0 0 0 12Z"></path>
                        <path d="m9 9 6 6"></path>
                        <path d="m15 9-6 6"></path>
                      </svg>
                      Active Host
                    </span>
                  )}
                  {/* Rating Badge - Non-editable */}
                  <div className="text-sm font-medium text-yellow-500 flex items-center ">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="mr-1"
                    >
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                    </svg>
                    <span>Rating: {userData?.rating || "N/A"}</span>
                  </div>
                </div>
              </div>

              {/* Bio */}
              <InfoSection
                className={"mt-5 mb-4 text-md md:text-lg"}
                value={userData?.bio}
              />

              {/* Divider */}
              <hr className="my-4 border-gray-200" />

              {/* Profile Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* From */}
                {userData?.city && (
                  <div className="flex gap-3 text-sm md:text-[16px]">
                    <span>From:</span>
                    <b>
                      <InfoSection className={""} value={userData.city} />
                    </b>
                  </div>
                )}

                {/* Profession */}
                {userData?.profession && (
                  <div className="flex gap-3 text-sm md:text-[16px]">
                    <span>Work as a:</span>
                    <b>
                      <InfoSection className={""} value={userData.profession} />
                    </b>
                  </div>
                )}

                {/* Skill Level */}
                {userData?.skill_level && (
                  <div className="flex gap-3 text-sm md:text-[16px]">
                    Skill Level:
                    <b>
                      <InfoSection
                        className={""}
                        value={userData.skill_level}
                      />
                    </b>
                  </div>
                )}

                {/* Joined Date */}
                {userData?.joinDate && (
                  <div className="flex gap-3 text-sm md:text-[16px]">
                    Member Since:
                    <b>
                      <InfoSection className={""} value={userData.joinDate} />
                    </b>
                  </div>
                )}

                {/* Total Games Hosted */}
                <div className="flex gap-3 items-start text-sm md:text-[16px]">
                  <p className="font-sans text-black">Total Games Hosted:</p>

                  <span className="font-bold">
                    {userData?.gamesHosted || 0}
                  </span>
                </div>
              </div>

              <div className="w-full flex justify-center"></div>
            </div>

            {/* Edit Profile Button */}
            <div className="flex justify-end pr-5 md:pr-8 mt-5 pb-10">
              <Button
                onClick={() => {
                  if (userData) {
                    // Reset edit data to current user data before opening modal
                    setEditData({
                      first_name: userData.first_name || "",
                      last_name: userData.last_name || "",
                      username: userData.username || "",
                      bio: userData.bio || "",
                      city: userData.city || "",
                      profession: userData.profession || "",
                      skill_level: userData.skill_level || "",
                      avatar_url: userData.avatar_url || "",
                    });
                    setIsModalOpen(true);
                  } else {
                    toast.error("Profile data not loaded yet");
                  }
                }}
              >
                Edit Profile
              </Button>
            </div>
          </div>
        </div>
      </div>
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Edit your profile"
        size="lg"
        animation="slide"
      >
        <div className="space-y-4">
          {/* Profile Image */}
          <div className="flex flex-col items-center justify-center w-full">
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
                  <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-gray-200 flex items-center justify-center relative overflow-hidden shadow-md mx-auto">
                    {/* Person icon when no image is selected */}
                    {!croppedImage && !editData.profileImage && (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-12 w-12 sm:h-14 sm:w-14 text-gray-400"
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
                    {(croppedImage || editData.profileImage) && (
                      <div
                        className="absolute inset-0 bg-center bg-cover"
                        style={{
                          backgroundImage: `url(${
                            croppedImage || editData.profileImage
                          })`,
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
                  Click to{" "}
                  {croppedImage || editData.avatar_url ? "change" : "upload"}{" "}
                  profile picture
                </p>
              </div>
            </div>

            {imgSrc && (
              <div className="mt-4 bg-white rounded-lg shadow-sm p-4 w-full max-w-md mx-auto">
                <h3 className="text-md font-medium mb-1">Crop Your Picture</h3>
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
                    Apply Crop and Save
                  </button>
                </div>
              </div>
            )}

            {/* Hidden canvas used for cropping */}
            <div className="hidden">
              <canvas ref={previewCanvasRef} />
            </div>
          </div>

          {/* First Name */}
          <div>
            <label className="text-sm font-medium text-gray-700">
              First Name
            </label>
            <input
              type="text"
              value={editData.first_name || ""}
              onChange={(e) =>
                setEditData({ ...editData, first_name: e.target.value })
              }
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your full name"
            />
          </div>

          {/* Last Name */}
          <div>
            <label className="text-sm font-medium text-gray-700">
              Last Name
            </label>
            <input
              type="text"
              value={editData.last_name || ""}
              onChange={(e) =>
                setEditData({ ...editData, last_name: e.target.value })
              }
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your full name"
            />
          </div>

          {/* Username */}
          <div>
            <label className="text-sm font-medium text-gray-700">
              Username
            </label>
            <input
              type="text"
              value={editData.username || ""}
              onChange={(e) =>
                setEditData({ ...editData, username: e.target.value })
              }
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your username"
            />
          </div>

          {/* Bio */}
          <div>
            <label className="text-sm font-medium text-gray-700">Bio</label>
            <textarea
              value={editData.bio || ""}
              onChange={(e) =>
                setEditData({ ...editData, bio: e.target.value })
              }
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Tell us about yourself"
              rows="3"
            />
          </div>

          {/* City */}
          <div>
            <label className="text-sm font-medium text-gray-700">City</label>
            <input
              type="text"
              value={editData.city || ""}
              onChange={(e) =>
                setEditData({ ...editData, city: e.target.value })
              }
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Where are you from?"
            />
          </div>

          {/* Profession */}
          <div>
            <label className="text-sm font-medium text-gray-700">
              Profession
            </label>
            <input
              type="text"
              value={editData.profession || ""}
              onChange={(e) =>
                setEditData({ ...editData, profession: e.target.value })
              }
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="What's your profession?"
            />
          </div>

          {/* Skill Level */}
          <div>
            <label className="text-sm font-medium text-gray-700">
              Skill Level
            </label>
            <select
              value={editData.skill_level || ""}
              onChange={(e) =>
                setEditData({ ...editData, skill_level: e.target.value })
              }
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select your skill level</option>
              <option value="Beginner">Beginner</option>
              <option value="Basic">Basic</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
              <option value="Professional">Professional</option>
            </select>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 mt-6">
            <Button
              onClick={() => setIsModalOpen(false)}
              variant="outline"
              className="border-gray-300"
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpdateProfile}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              Save Changes
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default Profile;
