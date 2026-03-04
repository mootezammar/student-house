import { getAuth } from "@clerk/express";
import User from "../models/User.js";
import connectDB from "../config/mongodb.js";

export const protect = async (req, res, next) => {
  await connectDB();
  try {
    const { userId } = getAuth(req);
    if (!userId) return res.json({ success: false, message: "Unauthorized" });
    const user = await User.findOne({ clerkId: userId });
    if (!user) return res.json({ success: false, message: "User not found" });
    req.user = user;
    next();
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const isOwner = async (req, res, next) => {
  await connectDB();
  try {
    const { userId } = getAuth(req);
    if (!userId) return res.json({ success: false, message: "Unauthorized" });
    const user = await User.findOne({ clerkId: userId });
    if (!user) return res.json({ success: false, message: "User not found" });
    if (user.role !== "owner") return res.json({ success: false, message: "Access denied — Owner only" });
    req.user = user;
    next();
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};