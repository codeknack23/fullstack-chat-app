import express from "express";
import User from "../models/user.model.js";
import { protectRoute } from "../middleware/auth.middleware.js";
import { getSentFriendRequests } from "../controllers/user.controller.js";

import { getReceiverSocketId, io } from "../lib/socket.js";

const router = express.Router();

// Get incoming friend requests for logged-in user
router.get("/friend-requests", protectRoute, async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate("friendRequests", "fullname profilePic email")
      .exec();

    res.json(user.friendRequests);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Get all users except self and friends (Explore page)
router.get("/all-users", protectRoute, async (req, res) => {
  try {
    const loggedInUserId = req.user.id;

    // Get current user's friends list
    const currentUser = await User.findById(loggedInUserId).select("friends");

    // Find all users except self and friends
    const users = await User.find({
      _id: { $nin: [loggedInUserId, ...currentUser.friends] },
    }).select("-password");

    res.json(users);
  } catch (err) {
    console.error("Error fetching all users: ", err);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/sent-requests", protectRoute, getSentFriendRequests);

// Send a friend request to another user
router.post("/friend-request/:id", protectRoute, async (req, res) => {
  try {
    const senderId = req.user.id;
    const receiverId = req.params.id;

    if (senderId === receiverId)
      return res
        .status(400)
        .json({ message: "Cannot send request to yourself" });

    const receiver = await User.findById(receiverId);
    if (!receiver) return res.status(404).json({ message: "User not found" });

    // Check if already friends
    if (receiver.friends.includes(senderId))
      return res.status(400).json({ message: "Already friends" });

    // Check if request already sent
    if (receiver.friendRequests.includes(senderId))
      return res.status(400).json({ message: "Friend request already sent" });

    // Add sender to receiver's friendRequests
    receiver.friendRequests.push(senderId);
    await receiver.save();

    // Emit event to the receiver if they are online
    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      console.log("event emitted");
      io.to(receiverSocketId).emit("newFriendRequest", {
        fromUserId: senderId,
        message: "You have a new friend request!",
      });
    }

    res.json({ message: "Friend request sent" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Accept a friend request
router.post("/accept-friend-request/:id", protectRoute, async (req, res) => {
  try {
    const currentUserId = req.user.id;
    const requesterId = req.params.id;

    const currentUser = await User.findById(currentUserId);
    const requester = await User.findById(requesterId);

    if (!currentUser || !requester) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if requester sent a friend request
    if (!currentUser.friendRequests.includes(requesterId)) {
      return res
        .status(400)
        .json({ message: "No friend request from this user" });
    }

    // Add each other as friends
    currentUser.friends.push(requesterId);
    requester.friends.push(currentUserId);

    // Remove requesterId from currentUser's friendRequests
    currentUser.friendRequests = currentUser.friendRequests.filter(
      (id) => id.toString() !== requesterId
    );

    await currentUser.save();
    await requester.save();

    res.json({ message: "Friend request accepted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Reject a friend request
router.post("/reject-friend-request/:id", protectRoute, async (req, res) => {
  try {
    const currentUserId = req.user.id;
    const requesterId = req.params.id;

    const currentUser = await User.findById(currentUserId);
    if (!currentUser)
      return res.status(404).json({ message: "User not found" });

    currentUser.friendRequests = currentUser.friendRequests.filter(
      (id) => id.toString() !== requesterId
    );

    await currentUser.save();

    res.json({ message: "Friend request rejected" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
