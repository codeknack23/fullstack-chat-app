import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const generateToken = (userId, res) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  res.cookie("jwt", token, {
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENVIRONMENT !== "development",
  });

  return token;
};

export async function updateLastSeen(userId) {
  try {
    // Update the lastSeen field with the current time
    await User.findByIdAndUpdate(userId, { lastSeen: new Date() });
    console.log("User last seen updated successfully");
  } catch (err) {
    console.error("Error updating last seen:", err);
  }
}
