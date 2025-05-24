import User from "../models/user.model.js";
import Message from "../models/message.model.js";
import cloudinary from "../lib/cloudinary.js";
import { getReceiverSocketId ,io} from "../lib/socket.js";


export const getUsersForSidebar = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;

    // Find user and populate friends only
    const user = await User.findById(loggedInUserId)
      .populate("friends", "fullname profilePic email") // select fields to send
      .exec();

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Return only friends (mutual friends)
    res.status(200).json(user.friends);
  } catch (error) {
    console.log("error in getUsersForSidebar controller : " + error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};


// export const getUsersForSidebar = async (req, res) => {
//   try {
//     const loggedInUserId = req.user._id;
//     const filteredUsers = await User.find({
//       _id: { $ne: loggedInUserId },
//     }).select("-password");

//     res.status(200).json(filteredUsers);
//   } catch (error) {
//     console.log("error in getUsersForSidebar controller : " + error.message);
//     res.status(500).json({ message: "Internal server error" });
//   }
// };

export const getMessages = async (req, res) => {
  try {
    const { id: userToChatId } = req.params;

    const myId = req.user._id;

    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: userToChatId },
        { senderId: userToChatId, receiverId: myId },
      ],
    });

    res.status(200).json(messages);
  } catch (error) {
    console.log("error in getMessage controller : " + error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { text, image } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id;

    let imageUrl;

    if (image) {
      //upload base64 to cloudinary
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url;
    }

    const newMessage = new Message({
      senderId,
      receiverId,
      text,
      image: imageUrl,
    });
    await newMessage.save();

    const receiverSocketId = getReceiverSocketId(receiverId);
    if(receiverSocketId){
      io.to(receiverSocketId).emit("newMessage", newMessage)
    }
    res.status(201).json(newMessage);
  } catch (error) {
    console.log("error in sendMessage controller : " + error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};
