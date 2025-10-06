import React, { useState, useEffect } from "react";
import { Navbar } from "../components/Navbar";
import { Link } from "react-router-dom";
import { supabase } from "../services/createClient";
import toast from "react-hot-toast";
import AnimatedLogo from "../components/AnimatedLogo";
import { FiSearch } from "react-icons/fi";
import { TbFilterSearch } from "react-icons/tb";

const Profiles = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState(null);

  // Fetch all users on component mount
  useEffect(() => {
    fetchUsers();
  }, []);

  // Filter users when search term changes
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredUsers(users);
      return;
    }

    const lowerSearchTerm = searchTerm.toLowerCase();
    const filtered = users.filter(
      (user) =>
        (user.first_name &&
          user.first_name.toLowerCase().includes(lowerSearchTerm)) ||
        (user.last_name &&
          user.last_name.toLowerCase().includes(lowerSearchTerm)) ||
        (user.username &&
          user.username.toLowerCase().includes(lowerSearchTerm)) ||
        (user.city && user.city.toLowerCase().includes(lowerSearchTerm))
    );
    setFilteredUsers(filtered);
  }, [searchTerm, users]);

  const fetchUsers = async () => {
    try {
      setLoading(true);

      const { data, error } = await supabase
        .from("profiles")
        .select(
          "id, first_name, last_name, username, city, avatar_url, skill_level"
        )
        .order("first_name");

      if (error) {
        throw error;
      }

      console.log("Fetched users:", data);
      setUsers(data || []);
      setFilteredUsers(data || []);
    } catch (error) {
      console.error("Error fetching users:", error.message);
      setError(error.message);
      toast.error("Failed to load users. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Function to handle the display of user profile pictures
  const UserAvatar = ({ user }) => {
    return (
      <div className="h-14 w-14 rounded-full overflow-hidden bg-gray-200 flex-shrink-0 border border-gray-100">
        {user.avatar_url ? (
          <img
            src={user.avatar_url}
            alt={`${user.first_name || "User"}'s avatar`}
            className="h-full w-full object-cover"
            onError={(e) => {
              // Fallback to default avatar if image fails to load
              e.target.src = "https://via.placeholder.com/56?text=User";
            }}
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-gray-400"
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
    );
  };

  return (
    <>
      <Navbar />
      <div className="pt-8 md:pt-20 min-h-screen bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                Tennis Players
              </h1>
              <p className="text-gray-600 mt-1">
                Find and connect with other tennis enthusiasts
              </p>
            </div>
          </div>

          {/* Search and Filter Section */}
          <div className="mb-8">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-grow">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiSearch className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search by name, username or city..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-white 
                             shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              <div className="flex-shrink-0 flex items-center space-x-2">
                <span className="text-gray-500 hidden md:inline">
                  {filteredUsers.length}{" "}
                  {filteredUsers.length === 1 ? "player" : "players"} found
                </span>
              </div>
            </div>
          </div>

          {/* Users List */}
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <AnimatedLogo type="pulse" size="large" />
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 p-4 rounded-lg text-center">
              <p className="text-red-600">Error loading users: {error}</p>
              <button
                onClick={fetchUsers}
                className="mt-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
              >
                Retry
              </button>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="bg-white shadow rounded-lg p-8 text-center">
              <TbFilterSearch className="mx-auto h-16 w-16 text-gray-400" />
              <h3 className="mt-2 text-lg font-medium text-gray-900">
                No users found
              </h3>
              <p className="mt-1 text-gray-500">
                Try adjusting your search or filters to find what you're looking
                for.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {filteredUsers.map((user) => (
                <Link
                  to={`/profile/${user.id}`}
                  key={user.id}
                  className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-4 flex items-center gap-4 border border-gray-100"
                >
                  <UserAvatar user={user} />
                  <div className="flex-grow min-w-0">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 truncate">
                          {user.first_name} {user.last_name}
                        </h3>
                        {user.username && (
                          <p className="text-sm text-gray-500">
                            {user.username}
                          </p>
                        )}
                      </div>
                      <div className="mt-1 md:mt-0">
                        {user.city && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            {user.city}
                          </span>
                        )}
                        {user.skill_level && (
                          <span className="inline-flex items-center ml-2 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            {user.skill_level}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Profiles;
