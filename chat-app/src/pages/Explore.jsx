import React, { useEffect, useState } from "react";
import { useExploreStore } from "../store/useAuthStore";
import { ArrowLeft , Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Explore() {
  const {
    users,
    loading,
    error,
    sentRequests,
    fetchAllUsers,
    fetchSentRequests,
    sendFriendRequest,
  } = useExploreStore();

  const navigate = useNavigate();

  const [sentLoaded, setSentLoaded] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      await fetchAllUsers();
      await fetchSentRequests();
      setSentLoaded(true); // mark sentRequests loaded
    };
    fetchData();
  }, []);

  if (loading || !sentLoaded)
    return <div className="p-4 text-zinc-400 flex items-center justify-center h-[100vh]"> <Loader2 className="animate-spin opacity-50" /></div>;
  if (error)
    return <div className="p-4 text-red-500">Error: {error}</div>;

  return (
    <div className="p-4">
      {/* Back Button */}
      <button
        onClick={() => navigate("/")}
        className="flex items-center gap-2 text-zinc-300 hover:text-white transition mb-4"
      >
        <ArrowLeft size={20} />
        <span className="text-sm">Back to Chat</span>
      </button>

      <h2 className="text-xl font-bold mb-4">Explore</h2>
      <div className="space-y-4">
        {users.map((user) => (
          <div
            key={user._id}
            className="flex items-center gap-4 p-3 rounded-lg border border-base-300 bg-base-100 hover:bg-base-200 transition-colors"
          >
            <img
              src={user.profilePic || "/default.png"}
              alt={user.fullname}
              className="w-12 h-12 object-cover rounded-full"
            />
            <div className="flex-1 min-w-0">
              <div className="font-medium truncate">{user.fullname}</div>
              <div className="text-sm text-zinc-500 truncate">{user.email}</div>
            </div>
            <button
              onClick={() => sendFriendRequest(user._id)}
              disabled={sentRequests.has(user._id)}
              className={`btn btn-sm ${
                sentRequests.has(user._id)
                  ? "btn-disabled text-zinc-400"
                  : "btn-primary"
              }`}
            >
              {sentRequests.has(user._id) ? "Requested" : "Add Friend"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
