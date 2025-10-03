import React from "react";
import { Navbar } from "../components/Navbar";
import { UserAuth } from "../context/AuthContext";
import { useParams } from "react-router-dom";

// Sample user data - replace with actual user data from your backend
const defaultUserData = {
  id: "user123",
  fullName: "Michael Johnson",
  username: "@tennischamp",
  profileImage:
    "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
  bio: "Tennis enthusiast looking to improve my game and meet new playing partners.",
  city: "Melbourne",
  profession: "Software Engineer",
  skillLevel: "Intermediate",
  rating: 1450,
  joinDate: "March 2023",
  gamesHosted: 12,
};

const Profile = () => {
  const { id } = useParams();
 

  // For a real application, this would come from your API or context
  const userData = defaultUserData;

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
        <div className="max-w-5xl mx-auto px-4 py-6">
          {/* Profile Card */}
          <div className="bg-white rounded-lg shadow-lg ">
            {/* Profile Content */}
            <div className="px-5 md:px-8 py-6">
              <div className="w-full flex flex-col md:flex-row md:justify-between items-center">
                {/* Profile picture, full, user name, host status */}
                <div className="pt-6 flex flex-col md:flex-row justify-start items-center gap-5">
                  {/* Profile Picture */}
                  <div className="rounded-full ring-4 ring-white bg-white overflow-hidden h-24 w-24">
                    <img
                      src={userData.profileImage}
                      alt={userData.fullName}
                      className="h-full w-full object-cover"
                    />
                  </div>

                  {/* User Name */}
                  <div className="mt-2 mb-4">
                    <div className="flex flex-col items-center md:items-start">
                      <div className="flex items-center justify-center gap-2">
                        <h1 className="text-2xl font-bold text-gray-900">
                          {userData.fullName}
                        </h1>
                        {userData.gamesHosted > 0 && (
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
                  {userData.gamesHosted > 0 && (
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
                    <span>Rating: {userData.rating}</span>
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
                <div className="flex gap-3 text-sm md:text-[16px]">
                  From:
                  <b>
                    <InfoSection className={""} value={userData.city} />{" "}
                  </b>
                </div>

                {/* Profession */}
                <div className="flex gap-3 text-sm md:text-[16px]">
                  Work as a:
                  <b>
                    <InfoSection className={""} value={userData.profession} />
                  </b>
                </div>

                {/* Skill Level */}
                <div className="flex gap-3 text-sm md:text-[16px]">
                  Skill Level:
                  <b>
                    <InfoSection className={""} value={userData.skillLevel} />
                  </b>
                </div>

                {/* Joined Date */}
                <div className="flex gap-3 text-sm md:text-[16px]">
                  Member Since:
                  <b>
                    <InfoSection className={""} value={userData.joinDate} />
                  </b>
                </div>

                {/* Total Games Hosted */}
                <div className="flex gap-3 items-start text-sm md:text-[16px]">
                  <p className="font-sans text-black">Total Games Hosted:</p>

                  <span className="font-bold">{userData.gamesHosted}</span>
                </div>
              </div>

              <div className="w-full flex justify-center"></div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
