import React, { useEffect } from "react";
import useFriendRequestsStore from "../store/friendRequestsStore";
import { useAuthStore } from "../store/useAuthStore";
import { X, ArrowLeft, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function FriendRequests() {
  const {
    friendRequests,
    loading,
    error,
    fetchFriendRequests,
    acceptRequest,
    rejectRequest,
  } = useFriendRequestsStore();

  const { socket } = useAuthStore();
  const navigate = useNavigate();

  // Fetch on initial mount
  useEffect(() => {
    fetchFriendRequests();
  }, []);

  // Re-fetch when socket receives newFriendRequest event
  useEffect(() => {
    if (!socket) return;

    const handleNewRequest = () => {
      console.log("✅ Received 'newFriendRequest' via socket");
      const audio = new Audio("message.mp3");
      audio.play();
      fetchFriendRequests();
    };

    socket.on("newFriendRequest", handleNewRequest);

    // Debug: log any socket event
    socket.onAny((event, ...args) => {
      console.log("📡 Socket Event Received:", event, args);
    });

    return () => {
      socket.off("newFriendRequest", handleNewRequest);
      socket.offAny(); // Clean up on unmount
    };
  }, [socket]);

  if (loading) {
    return (
      <div className="p-4 text-zinc-400 flex items-center justify-center h-[100vh]">
        <Loader2 className="animate-spin opacity-50" />
      </div>
    );
  }

  if (error) {
    return <div className="p-4 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="p-6 space-y-4">
      {/* Back Button */}
      <button
        onClick={() => navigate("/")}
        className="flex items-center gap-2 text-zinc-300 hover:text-white transition mb-4"
      >
        <ArrowLeft size={20} />
        <span className="text-sm">Back to Chat</span>
      </button>

      <h2 className="text-xl font-semibold text-zinc-200">
        Incoming Friend Requests {friendRequests.length > 0 && `(${friendRequests.length})`}
      </h2>

      {friendRequests.length === 0 ? (
        <p className="text-zinc-400">No new friend requests.</p>
      ) : (
        <ul className="space-y-4">
          {friendRequests.map((user) => (
            <li
              key={user._id}
              className="flex items-center justify-between p-4 rounded-xl bg-base-200 hover:bg-base-300 transition"
            >
              <div className="flex items-center gap-3">
                <img
                  src={user.profilePic || "/default.png"}
                  alt={user.fullname}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <p className="font-medium text-zinc-100">{user.fullname}</p>
                  <p className="text-sm text-zinc-400">{user.email}</p>
                </div>
              </div>
              <div className="flex gap-2 items-center">
                <button
                  onClick={() => acceptRequest(user._id)}
                  className="btn btn-sm btn-primary text-white"
                >
                  Accept
                </button>
                <button
                  onClick={() => rejectRequest(user._id)}
                  className="p-2 rounded-full transition text-zinc-400 hover:text-red-400"
                  title="Reject"
                >
                  <X size={20} />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
