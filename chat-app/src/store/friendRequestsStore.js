import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";

const useFriendRequestsStore = create((set, get) => ({
  friendRequests: [],
  loading: false,
  error: null,

  fetchFriendRequests: async () => {
    set({ loading: true, error: null });
    try {
      const res = await axiosInstance.get("/users/friend-requests");
      set({ friendRequests: res.data });
    } catch (err) {
      set({ error: err.response?.data?.message || err.message });
    } finally {
      set({ loading: false });
    }
  },

  acceptRequest: async (userId) => {
    try {
      await axiosInstance.post(`/users/accept-friend-request/${userId}`);
      toast.success("Friend request accepted");
      get().fetchFriendRequests();
    } catch (err) {
      toast.error(err.response?.data?.message || "Error accepting request");
    }
  },

  rejectRequest: async (userId) => {
    try {
      await axiosInstance.post(`/users/reject-friend-request/${userId}`);
      toast.success("Friend request rejected");
      get().fetchFriendRequests();
    } catch (err) {
      toast.error(err.response?.data?.message || "Error rejecting request");
    }
  },
}));

export default useFriendRequestsStore;
