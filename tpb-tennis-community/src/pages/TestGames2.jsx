import React, { useState, useEffect } from "react";
import { Navbar } from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import { supabase } from "../services/createClient.js";
import { LuFilter } from "react-icons/lu";
import { BsCalendar2Date } from "react-icons/bs";
import { MdOutlineAccessTime } from "react-icons/md";
import { CiLocationOn } from "react-icons/ci";
import { FaTrophy } from "react-icons/fa";
import { GoPeople } from "react-icons/go";
import { IoIosSearch } from "react-icons/io";
import { FaPlus } from "react-icons/fa6";
import { UserAuth } from "../context/AuthContext.jsx";
import AnimatedLogo from "../components/AnimatedLogo.jsx";
import toast from "react-hot-toast";

export default function TestGames2() {
  const { session } = UserAuth();
  const userId = session?.user?.id;

  const navigate = useNavigate();
  const now = new Date();

  const [games, setGames] = useState([]);
  const [search, setSearch] = useState("");
  const [userRequests, setUserRequests] = useState([]); // store requested games
  const [loading, setLoading] = useState(false);
  const [requestLoading, setRequestLoading] = useState(false);

  const filteredGames = games.filter((game) => {
    const query = search.toLowerCase();
    const hostFullName = game.profiles
      ? `${game.profiles.first_name ?? ""} ${
          game.profiles.last_name ?? ""
        }`.trim()
      : "";

    const gameEndDateTime = new Date(`${game.game_date}T${game.game_end_time}`);
    return (
      gameEndDateTime > now &&
      (game.court_name.toLowerCase().includes(query) ||
        hostFullName.toLowerCase().includes(query))
    );
  });

  // Send join request
  const handleSendRequest = async (gameId, hostId) => {
    setRequestLoading(true);

    try {
      if (hostId === userId) {
        toast.error("You cannot join a game you are hosting.");
        return;
      }

      const { data, error } = await supabase
        .from("game_requests")
        .insert({
          game_id: gameId,
          requester_id: userId,
          status: "pending",
        })
        .select()
        .single();

      if (error) {
        console.log(error.message);
        toast.error("Request failed. Try again.");
      } else {
        toast.success("Request sent.");
        // update local state immediately
        setUserRequests((prev) => [...prev, { id: data.id, game_id: gameId }]);
      }
    } catch (error) {
      console.error("Unexpected error occurred: ", error);
      toast.error("Request failed. Try again.");
    } finally {
      setRequestLoading(false);
    }
  };

  // Cancel join request
  const handleCancelRequest = async (gameId) => {
    setRequestLoading(true);
    try {
      const { data, error } = await supabase
        .from("game_requests")
        .delete()
        .eq("game_id", gameId)
        .eq("requester_id", userId)
        .select()
        .single();

      if (error) {
        console.log(error.message);
        toast.error("Cancel failed. Try again.");
      } else {
        toast.success("Request canceled.");
        // update local state immediately
        setUserRequests((prev) => prev.filter((req) => req.game_id !== gameId));
      }
    } catch (error) {
      console.error("Unexpected error occurred: ", error);
      toast.error("Cancel failed. Try again.");
    } finally {
      setRequestLoading(false);
    }
  };

  //Delete expired games
  async function deleteExpiredGames() {
    const { data: allGames, error } = await supabase
      .from("games")
      .select("id, game_date, game_end_time");

    if (error) {
      console.error("Error fetching games:", error);
      return;
    }

    const now = new Date();

    // Find IDs of expired games
    const expiredIds = allGames
      .filter(
        (game) => new Date(`${game.game_date}T${game.game_end_time}`) < now
      )
      .map((game) => game.id);

    // Delete expired games if any found
    if (expiredIds.length > 0) {
      const { error: deleteError } = await supabase
        .from("games")
        .delete()
        .in("id", expiredIds);

      if (deleteError) {
        console.error("Error deleting expired games:", deleteError);
      } else {
        console.log("Deleted expired games:", expiredIds);
        fetchGamesAndRequests(); // Refresh the list
      }
    }
  }

  // ✅ Fetch games and requests
  const fetchGamesAndRequests = async () => {
    setLoading(true);
    try {
      // Step 1: Fetch all games
      const { data: gamesData, error: gamesError } = await supabase.from(
        "games"
      ).select(`
            id,
            reference_number,
            host_user_id,
            court_name,
            game_date,
            game_start_time,
            game_end_time,
            total_vacancies,
            available_vacancies,
            required_skill_level,
            status,
            profiles:host_user_id (
              first_name,
              last_name
            )
          `);

      if (gamesError) throw gamesError;
      setGames(gamesData);

      // Step 2: Fetch requests made by current user
      if (userId) {
        const { data: requestsData, error: requestsError } = await supabase
          .from("game_requests")
          .select("id, game_id")
          .eq("requester_id", userId);

        if (requestsError) throw requestsError;
        setUserRequests(requestsData);
      }
    } catch (error) {
      console.error("Error fetching data: ", error);
      toast.error("Failed to fetch games");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGamesAndRequests();
    deleteExpiredGames();
  }, [userId]);

  // ✅ Realtime listener for requests
  useEffect(() => {
    if (!userId) return;

    const channel = supabase
      .channel("game_requests_changes")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "game_requests" },
        (payload) => {
          if (payload.new.requester_id === userId) {
            setUserRequests((prev) => [
              ...prev,
              { id: payload.new.id, game_id: payload.new.game_id },
            ]);
          }
        }
      )
      .on(
        "postgres_changes",
        { event: "DELETE", schema: "public", table: "game_requests" },
        (payload) => {
          if (payload.old.requester_id === userId) {
            setUserRequests((prev) =>
              prev.filter((req) => req.id !== payload.old.id)
            );
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId]);

  // ✅ Helper: Check if current user has already requested a game
  const hasRequested = (gameId) => {
    return userRequests.some((req) => req.game_id === gameId);
  };

  return (
    <>
      <Navbar />
      <div className="flex flex-col mt-10 md:mt-20">
        <div className="flex justify-center bg-[#F9FAFB]">
          <div className="min-h-screen w-full md:w-[1500px] flex flex-col gap-6 p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between relative">
              <h1 className="font-bold text-2xl">Find Tennis Games</h1>
              <p className="text-gray-500">
                Discover games in your area and join the fun!
              </p>
              <button
                onClick={() => navigate("/hostGame")}
                className="mt-4 md:mt-0 w-full md:w-[130px] h-[40px] bg-[#16A34A] rounded-3xl text-sm font-semibold text-white cursor-pointer flex items-center justify-center gap-1"
              >
                <FaPlus /> Host a Game
              </button>
            </div>

            <div className="shadow-sm bg-white rounded-xl p-1 flex flex-row gap-2 relative">
              <IoIosSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 ml-0.5" />
              <input
                className="pl-8 w-full bg-[#F9FAFB] border rounded-lg border-gray-300 p-2"
                value={search}
                type="text"
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by court name or host"
              />
              <button className="border rounded-lg border-gray-400 flex flex-row items-center justify-center w-[80px] h-[40px] p-2">
                <LuFilter /> Filter
              </button>
            </div>

            <div>
              {loading ? (
                <div className="w-full h-full flex justify-center items-center">
                  <AnimatedLogo type="pulse" size="default" />
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredGames.map((game) => {
                    let borderColor = "";
                    let statusLabel = "";

                    if (game.status === "open") {
                      borderColor = "border-[#93E9B3]";
                    } else if (game.status === "filled") {
                      borderColor = "border-yellow-400";
                      statusLabel = "FILLED";
                    } else if (game.status === "expired") {
                      borderColor = "border-gray-400";
                      statusLabel = "EXPIRED";
                    }

                    const alreadyRequested = hasRequested(game.id);

                    return (
                      <div
                        key={game.id}
                        className={`relative border-2 rounded-lg ${borderColor} shadow-md p-4 flex flex-col justify-between`}
                      >
                        {statusLabel && (
                          <span
                            className={`absolute top-0 left-0 w-full text-center py-1 font-bold text-white rounded-t-lg
                              ${
                                game.status === "filled"
                                  ? "bg-yellow-400"
                                  : "bg-gray-400"
                              }`}
                          >
                            {statusLabel}
                          </span>
                        )}
                        <div
                          className={`mt-${
                            statusLabel ? "8" : "1"
                          } flex flex-col gap-2`}
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                            <h2 className="font-semibold text-lg">
                              {game.court_name}
                            </h2>
                            <p className="bg-white border border-green-500 text-gray-800 px-3 py-1 rounded-lg font-semibold sm:text-base text-center">
                              Ref# TPB {game.reference_number}
                            </p>
                          </div>
                          <p className="text-gray-500 text-sm gap-2 flex flex-row items-center">
                            <BsCalendar2Date />{" "}
                            {new Date(game.game_date).toLocaleDateString(
                              "en-US",
                              {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              }
                            )}
                          </p>
                          <p className="text-gray-500 text-sm gap-2 flex flex-row items-center">
                            <MdOutlineAccessTime />
                            {new Date(
                              `${game.game_date}T${game.game_start_time}`
                            ).toLocaleTimeString("en-US", {
                              hour: "numeric",
                              minute: "2-digit",
                              hour12: true,
                            })}
                            {" - "}
                            {new Date(
                              `${game.game_date}T${game.game_end_time}`
                            ).toLocaleTimeString("en-US", {
                              hour: "numeric",
                              minute: "2-digit",
                              hour12: true,
                            })}
                          </p>
                          <p className="text-gray-500 text-sm gap-2 flex flex-row items-center">
                            <CiLocationOn /> Hosted by{" "}
                            {game.profiles
                              ? `${game.profiles.first_name ?? ""} ${
                                  game.profiles.last_name ?? ""
                                }`.trim() || "Unknown"
                              : "UnKnown"}
                          </p>

                          <div className="flex justify-between mt-3 items-center">
                            <div>
                              <p className="text-sm font-medium text-gray-400">
                                Skill Level
                              </p>
                              <div className="flex gap-1">
                                {[1, 2, 3, 4, 5].map((level) => (
                                  <span
                                    key={level}
                                    className={`w-5 h-5 rounded-full ${
                                      level <= game.required_skill_level
                                        ? "bg-yellow-400"
                                        : "bg-gray-300"
                                    }`}
                                  ></span>
                                ))}
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-medium text-gray-400">
                                Host Rating
                              </p>
                              <div className="flex items-center gap-1 justify-end">
                                <FaTrophy className="text-yellow-500 w-6 h-6" />
                                <span className="font-semibold">3.45</span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center justify-between mt-2">
                            <p className="mt-2 text-md text-green-600 font-semibold flex items-center gap-1">
                              <GoPeople /> {game.available_vacancies} spots left
                            </p>

                            {alreadyRequested ? (
                              <button
                                onClick={() => handleCancelRequest(game.id)}
                                disabled={requestLoading}
                                className="w-[130px] h-[35px] border border-red-300 bg-red-100 hover:bg-red-200 text-sm rounded-xl font-semibold text-black cursor-pointer"
                              >
                                Cancel Request
                              </button>
                            ) : (
                              <button
                                onClick={() =>
                                  handleSendRequest(game.id, game.host_user_id)
                                }
                                disabled={requestLoading}
                                className="w-[130px] h-[35px] bg-green-600 hover:bg-green-700 text-sm rounded-xl font-semibold text-white cursor-pointer"
                              >
                                Request to Join
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
