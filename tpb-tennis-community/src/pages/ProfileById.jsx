import React, { useState, useEffect } from "react";
import { Navbar } from "../components/Navbar";
import { useParams } from "react-router-dom";
import { supabase } from "../services/createClient";
import toast from "react-hot-toast";
import AnimatedLogo from "../components/AnimatedLogo";

const ProfileById = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userData, setUserData] = useState({});

  const fetchUserAndGameCount = async () => {
    setLoading(true);
    try {
      // Fetch user profile data
      const { data, error } = await supabase
        .from("profiles")
        .select()
        .eq("id", id)
        .single();

      if (error) throw error;

      // Fetch game hosting count
      const { count: gameCount, error: gameCountError } = await supabase
        .from("games")
        .select("*", { count: "exact", head: true })
        .eq("host_user_id", id);

      if (gameCountError) throw gameCountError;

      // Combine data
      setUserData({
        ...data,
        game_count: gameCount,
      });

      console.log("Profile data loaded:", data);
    } catch (error) {
      console.error("Failed to load the profile:", error.message);
      setError(error.message);
      toast.error("Failed to load profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchUserAndGameCount();
    }
  }, [id]);

  // Simple section component to display user information
  const InfoSection = ({ value, className }) => {
    return (
      <div className={`${className}`}>
        <p className="font-sans text-black">{value || ""}</p>
      </div>
    );
  };

  return (
    <>
      <Navbar />
      <div className="pt-8 md:pt-20 min-h-screen bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 py-10">
          {/* Profile Card */}
          <div className="bg-white rounded-lg shadow-lg pt-5 pb-15">
            {/* Loading indicator */}
            {loading ? (
              <div className="flex justify-center items-center py-16">
                <AnimatedLogo type="pulse" size="default" />
              </div>
            ) : error ? (
              <div className="text-center py-16">
                <div className="bg-red-50 rounded-lg p-6 max-w-md mx-auto">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-12 w-12 text-red-500 mx-auto mb-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                  <h3 className="text-lg font-medium text-red-800 mb-2">
                    Error Loading Profile
                  </h3>
                  <p className="text-red-700">{error}</p>
                  <button
                    onClick={fetchUserAndGameCount}
                    className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                  >
                    Try Again
                  </button>
                </div>
              </div>
            ) : (
              <>
                {/* Profile Content */}
                <div className="px-5 md:px-8 py-6">
                  <div className="w-full flex flex-col md:flex-row md:justify-between items-center">
                    {/* Profile picture, full name, user name, host status */}
                    <div className="pt-6 flex flex-col md:flex-row justify-start items-center gap-5">
                      {/* Profile Picture */}
                      <div className="rounded-full ring-4 ring-white bg-white overflow-hidden h-24 w-24">
                        {userData.avatar_url ? (
                          <img
                            src={userData.avatar_url}
                            alt={userData.first_name || "Profile"}
                            className="h-full w-full object-cover"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src =
                                "https://via.placeholder.com/96?text=User";
                            }}
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
                              {userData.first_name} {userData.last_name}
                            </h1>
                            {userData.game_count > 0 && (
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
                          <p className="text-gray-500">{userData.username}</p>
                        </div>
                      </div>
                    </div>

                    {/* rating and in mobile rating with active status */}
                    <div className="flex mt-2 mb-3 items-center gap-8">
                      {userData.game_count > 0 && (
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
                      <div className="text-sm font-medium text-yellow-500 flex items-center">
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
                        <span>Rating: {userData.rating || "N/A"}</span>
                      </div>
                    </div>
                  </div>

                  {/* Bio */}
                  <InfoSection
                    className={"mt-5 mb-4 text-md md:text-lg"}
                    value={userData.bio}
                  />

                  {/* Divider */}
                  <hr className="my-4 border-gray-200" />

                  {/* Profile Details Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* From */}
                    {userData.city && (
                      <div className="flex gap-3 text-sm md:text-[16px]">
                        <span>From:</span>
                        <InfoSection
                          className={"font-semibold"}
                          value={userData.city}
                        />
                      </div>
                    )}

                    {/* Profession */}
                    {userData.profession && (
                      <div className="flex gap-3 text-sm md:text-[16px]">
                        <span>Work as a:</span>
                        <InfoSection
                          className={"font-semibold"}
                          value={userData.profession}
                        />
                      </div>
                    )}

                    {/* Skill Level */}
                    {userData.skill_level && (
                      <div className="flex gap-3 text-sm md:text-[16px]">
                        <span>Skill Level:</span>
                        <InfoSection
                          className={"font-semibold"}
                          value={userData.skill_level}
                        />
                      </div>
                    )}

                    {/* Joined Date */}
                    {userData.joinDate && (
                      <div className="flex gap-3 text-sm md:text-[16px]">
                        <span>Member Since:</span>
                        <InfoSection
                          className={"font-semibold"}
                          value={userData.joinDate}
                        />
                      </div>
                    )}

                    {/* Total Games Hosted */}
                    <div className="flex gap-3 items-start text-sm md:text-[16px]">
                      <p className="font-sans text-black">
                        Total Games Hosted:
                      </p>
                      <span className="font-semibold">
                        {userData.game_count || 0}
                      </span>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfileById;
