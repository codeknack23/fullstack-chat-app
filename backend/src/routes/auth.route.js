import express from "express";

import {
  login,
  signup,
  logout,
  updateProfile,
  checkAuth,
  searchUser,
} from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);

router.put("/update-profile", protectRoute, updateProfile);

router.get("/check", protectRoute, checkAuth);
router.get("/search", protectRoute, searchUser);

export default router;
