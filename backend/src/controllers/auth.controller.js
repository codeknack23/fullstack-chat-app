import { generateToken, updateLastSeen } from "../lib/utils.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import cloudinary from "../lib/cloudinary.js";

export const signup = async (req, res) => {
  const { fullname, email, password } = req.body;
  try {
    if (!fullname || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 character's" });
    }

    const user = await User.findOne({ email });

    if (user) {
      return res.status(400).json({ message: "Email already exist's" });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      fullname: fullname,
      email: email,
      password: hashedPassword,
    });

    if (newUser) {
      //generate jwt token
      generateToken(newUser._id, res);
      await newUser.save();
      res.status(201).json({
        _id: newUser._id,
        fullname: newUser.fullname,
        email: newUser.email,
        profilePic: newUser.profilePic,
      });
    } else {
      res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
    console.log("signup controller: " + error);
    res.status(500).json({ message: "Internal server error" });
  }
};
export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Incorrect credentials" });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Incorrect credentials" });
    }
    generateToken(user._id, res);
    updateLastSeen(user._id);

    res.status(200).json({
      _id: user._id,
      fullname: user.fullname,
      email: user.email,
      profilePic: user.profilePic,
    });
  } catch (error) {
    console.log("login controller : " + error);
    res.status(500).json({ message: "Internal server error" });
  }
};
export const logout = (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({ message: "Logged out" });
    updateLastSeen(user._id);
  } catch (error) {
    console.log("auth controller : " + error);
    res.status(500).json({ message: "Internal server error" });
  }
};
export const updateProfile = async (req, res) => {
  try {
    const { profilePic } = req.body;
    const userId = req.user._id;

    if (!profilePic) {
      return res.status(400).json({ message: "Upload the profile pic" });
    }

    const profileResponse = await cloudinary.uploader.upload(profilePic);
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        profilePic: profileResponse.secure_url,
      },
      { new: true }
    );

    res.status(200).json(updatedUser);
    updateLastSeen(user._id);
  } catch (error) {
    console.log("update profile controller : " + error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const checkAuth = (req, res) => {
  try {
    res.status(200).json(req.user);
    updateLastSeen(user._id);
  } catch (error) {
    console.log("checkAuth controller : " + error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const searchUser = async (req, res) => {
  const { name } = req.query;
  const loggedInUserId = req.user._id;
  try {
    const users = await User.find({
      fullname: { $regex: name, $options: "i" },
      _id: { $ne: loggedInUserId },
    })
      .limit(50)
      .select("-password"); // Limit results for performance
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Error fetching users" });
  }
};
