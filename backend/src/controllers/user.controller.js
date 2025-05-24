import User from "../models/user.model.js";

// Get users for Explore page (not friends and not self)
export const getUsersForExplore = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;
    const user = await User.findById(loggedInUserId).select("friends");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Exclude logged-in user and their friends
    const users = await User.find({
      _id: { $nin: [loggedInUserId, ...user.friends] },
    }).select("-password");

    res.status(200).json(users);
  } catch (error) {
    console.error("Error in getUsersForExplore:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Send friend request
export const sendFriendRequest = async (req, res) => {
  try {
    const senderId = req.user._id;
    const { receiverId } = req.params;

    if (senderId.toString() === receiverId) {
      return res
        .status(400)
        .json({ message: "Cannot send request to yourself" });
    }

    const receiver = await User.findById(receiverId);
    const sender = await User.findById(senderId);

    if (!receiver || !sender) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if already friends
    if (sender.friends.includes(receiverId)) {
      return res.status(400).json({ message: "You are already friends" });
    }

    // Check if request already sent
    if (receiver.friendRequests.includes(senderId)) {
      return res.status(400).json({ message: "Friend request already sent" });
    }

    // Add senderId to receiver's friendRequests
    receiver.friendRequests.push(senderId);
    await receiver.save();

    res.status(200).json({ message: "Friend request sent" });
  } catch (error) {
    console.error("Error in sendFriendRequest:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get users to whom logged-in user has sent friend requests
export const getSentFriendRequests = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;

    // Find all users where friendRequests array contains loggedInUserId
    const users = await User.find({ friendRequests: loggedInUserId }).select(
      "_id fullname email profilePic"
    );
    console.log(users);
    res.status(200).json(users);
  } catch (error) {
    console.error("Error in getSentFriendRequests:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};
