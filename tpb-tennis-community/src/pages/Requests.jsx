import React, { useState, useEffect } from "react";
import { Navbar } from "../components/Navbar";
import { UserAuth } from "../context/AuthContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@radix-ui/react-tabs";
import { supabase } from "../services/createClient";
import AnimatedLogo from "../components/AnimatedLogo";
import { BsCalendar2Date } from "react-icons/bs";
import { MdOutlineAccessTime } from "react-icons/md";
import { CiLocationOn } from "react-icons/ci";
import { GoPeople } from "react-icons/go";
import toast from "react-hot-toast";

export const Requests = () => {
  const { session, profile } = UserAuth();
  const userId = session?.user?.id;

  const [sentRequests, setSentRequests] = useState([]);
  const [receivedRequests, setReceivedRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("sent");

  useEffect(() => {
    fetchRequests();
  }, [userId]);

  const fetchRequests = async () => {
    if (!userId) return;

    setLoading(true);
    try {
      // Fetch sent requests
      const { data: sentData, error: sentError } = await supabase
        .from("game_requests")
        .select(
          `
          id,
          game_id,
          requester_id,
          status,
          created_at,
          games:game_requests_game_id_fkey (
            id,
            reference_number,
            court_name,
            game_date,
            game_start_time,
            game_end_time,
            total_vacancies,
            available_vacancies,
            required_skill_level,
            status,
            host_user_id,
            profiles:host_user_id (
              first_name,
              last_name
            )
          )
        `
        )
        .eq("requester_id", userId);

      if (sentError) {
        console.error("Error fetching sent requests:", sentError);
      } else {
        setSentRequests(sentData || []);
      }

      // Fetch received requests (as a host)
      // First get the games hosted by the user
      const { data: hostedGames, error: hostedGamesError } = await supabase
        .from("games")
        .select("id")
        .eq("host_user_id", userId);

      if (hostedGamesError) {
        console.error("Error fetching hosted games:", hostedGamesError);
        setReceivedRequests([]);
      } else if (hostedGames && hostedGames.length > 0) {
        // If user has hosted games, fetch requests for those games
        const gameIds = hostedGames.map((game) => game.id);

        const { data: receivedData, error: receivedError } = await supabase
          .from("game_requests")
          .select(
            `
            id,
            game_id,
            requester_id,
            status,
            created_at,
            games:game_requests_game_id_fkey (
              id,
              reference_number,
              court_name,
              game_date,
              game_start_time,
              game_end_time,
              host_user_id
            ),
            profiles:requester_id (
              first_name,
              last_name
            )
          `
          )
          .in("game_id", gameIds);

        if (receivedError) {
          console.error("Error fetching received requests:", receivedError);
        } else {
          setReceivedRequests(receivedData || []);
          console.log(receivedData);
        }
      } else {
        // If user has no hosted games, set received requests to empty array
        setReceivedRequests([]);
      }
    } catch (error) {
      console.error("Unexpected error occurred:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateRequest = async (requestId, status) => {
    try {
      const { error } = await supabase
        .from("game_requests")
        .update({ status })
        .eq("id", requestId);

      if (error) {
        console.error("Error updating request:", error);
        toast.error("Failed to update request status.");
      } else {
        toast.success(`Request ${status} successfully.`);
        // Refresh requests after update
        fetchRequests();
      }
    } catch (error) {
      console.error("Unexpected error:", error);
      toast.error("An unexpected error occurred.");
    }
  };

  return (
    <>
      <Navbar />
      <div className="flex flex-col mt-20">
        <div className="flex justify-center bg-[#F9FAFB]">
          <div className="min-h-screen w-full md:w-[1500px] flex flex-col gap-6 p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <h1 className="font-bold text-2xl">Game Requests</h1>
              <p className="text-gray-500">
                Manage your sent and received game requests.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-4">
              <Tabs
                value={activeTab}
                onValueChange={setActiveTab}
                className="w-full"
              >
                <TabsList className="flex mb-6 bg-gray-100 p-1 rounded-lg">
                  <TabsTrigger
                    value="sent"
                    className={`flex-1 py-2 px-4 text-center rounded-md ${
                      activeTab === "sent" ? "bg-white shadow-sm" : ""
                    }`}
                  >
                    Requests Sent
                  </TabsTrigger>
                  <TabsTrigger
                    value="received"
                    className={`flex-1 py-2 px-4 text-center rounded-md ${
                      activeTab === "received" ? "bg-white shadow-sm" : ""
                    }`}
                  >
                    Requests Received
                  </TabsTrigger>
                </TabsList>

                {loading ? (
                  <div className="flex justify-center items-center py-20">
                    <AnimatedLogo type="pulse" size="default" />
                  </div>
                ) : (
                  <>
                    <TabsContent value="sent" className="mt-2">
                      {sentRequests.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                          {sentRequests.map((request) => (
                            <div
                              key={request.id}
                              className="border border-gray-200 rounded-lg shadow-sm p-4"
                            >
                              <div className="flex justify-between items-start mb-4">
                                <h3 className="font-semibold text-lg">
                                  {request.games?.court_name || "Unknown court"}
                                </h3>
                                <span
                                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                                    request.status === "approved"
                                      ? "bg-green-100 text-green-800"
                                      : request.status === "rejected"
                                      ? "bg-red-100 text-red-800"
                                      : "bg-yellow-100 text-yellow-800"
                                  }`}
                                >
                                  {request.status.charAt(0).toUpperCase() +
                                    request.status.slice(1)}
                                </span>
                              </div>

                              <p className="text-gray-500 text-md flex items-center gap-2">
                                <BsCalendar2Date />
                                {request.games?.game_date
                                  ? new Date(
                                      request.games.game_date
                                    ).toLocaleDateString("en-US", {
                                      month: "short",
                                      day: "numeric",
                                      year: "numeric",
                                    })
                                  : "Date unavailable"}
                              </p>

                              <p className="text-gray-500 text-md flex items-center gap-2 mt-1">
                                <MdOutlineAccessTime />
                                {request.games?.game_start_time
                                  ? new Date(
                                      `${request.games.game_date}T${request.games.game_start_time}`
                                    ).toLocaleTimeString("en-US", {
                                      hour: "numeric",
                                      minute: "2-digit",
                                      hour12: true,
                                    })
                                  : "Time unavailable"}
                                {request.games?.game_end_time
                                  ? ` - ${new Date(
                                      `${request.games.game_date}T${request.games.game_end_time}`
                                    ).toLocaleTimeString("en-US", {
                                      hour: "numeric",
                                      minute: "2-digit",
                                      hour12: true,
                                    })}`
                                  : ""}
                              </p>

                              <p className="text-gray-500 text-md flex items-center gap-2 mt-1">
                                <CiLocationOn /> Hosted by{" "}
                                {request.games?.profiles?.first_name ||
                                  "Unknown"}{" "}
                                {request.games?.profiles?.last_name || ""}
                              </p>

                              <p className="text-sm text-gray-500 mt-4">
                                Requested on{" "}
                                {new Date(
                                  request.created_at
                                ).toLocaleDateString()}
                              </p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-10 text-gray-500">
                          You haven't sent any game requests yet.
                        </div>
                      )}
                    </TabsContent>

                    <TabsContent value="received" className="mt-2">
                      {receivedRequests.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                          {receivedRequests.map((request) => (
                            <div
                              key={request.id}
                              className="border border-gray-200 rounded-lg shadow-sm p-4"
                            >
                              <div className="flex justify-between items-start mb-4">
                                <h3 className="font-semibold text-lg">
                                  {request.games?.court_name || "Unknown court"}
                                </h3>
                                <span
                                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                                    request.status === "approved"
                                      ? "bg-green-100 text-green-800"
                                      : request.status === "rejected"
                                      ? "bg-red-100 text-red-800"
                                      : "bg-yellow-100 text-yellow-800"
                                  }`}
                                >
                                  {request.status.charAt(0).toUpperCase() +
                                    request.status.slice(1)}
                                </span>
                              </div>

                              <p className="text-gray-500 text-md flex items-center gap-2">
                                <BsCalendar2Date />
                                {request.games?.game_date
                                  ? new Date(
                                      request.games.game_date
                                    ).toLocaleDateString("en-US", {
                                      month: "short",
                                      day: "numeric",
                                      year: "numeric",
                                    })
                                  : "Date unavailable"}
                              </p>

                              <p className="text-gray-500 text-md flex items-center gap-2 mt-1">
                                <GoPeople /> From:{" "}
                                {request.profiles?.first_name || "Unknown"}{" "}
                                {request.profiles?.last_name || ""}
                              </p>

                              <p className="text-sm text-gray-500 mt-4">
                                Requested on{" "}
                                {new Date(
                                  request.created_at
                                ).toLocaleDateString()}
                              </p>

                              {request.status === "pending" && (
                                <div className="flex gap-2 mt-4">
                                  <button
                                    onClick={() =>
                                      handleUpdateRequest(
                                        request.id,
                                        "approved"
                                      )
                                    }
                                    className="bg-[#16A34A] text-white px-4 py-2 rounded-md text-sm font-medium flex-1"
                                  >
                                    Approve
                                  </button>
                                  <button
                                    onClick={() =>
                                      handleUpdateRequest(
                                        request.id,
                                        "rejected"
                                      )
                                    }
                                    className="bg-red-500 text-white px-4 py-2 rounded-md text-sm font-medium flex-1"
                                  >
                                    Reject
                                  </button>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-10 text-gray-500">
                          You haven't received any game requests yet.
                        </div>
                      )}
                    </TabsContent>
                  </>
                )}
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
