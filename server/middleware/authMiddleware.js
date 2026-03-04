import { verifyToken } from "@clerk/express";
import User from "../models/User.js";
import connectDB from "../config/mongodb.js";

export const protect = async (req, res, next) => {
  await connectDB();
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.json({ success: false, message: "Unauthorized" });
    }

    const token = authHeader.split(" ")[1];

    const payload = await verifyToken(token, {
      secretKey: process.env.CLERK_SECRET_KEY,
    });

    if (!payload) return res.json({ success: false, message: "Unauthorized" });

    const userId = payload.sub;
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
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.json({ success: false, message: "Unauthorized" });
    }

    const token = authHeader.split(" ")[1];

    const payload = await verifyToken(token, {
      secretKey: process.env.CLERK_SECRET_KEY,
    });

    if (!payload) return res.json({ success: false, message: "Unauthorized" });

    const userId = payload.sub;
    const user = await User.findOne({ clerkId: userId });
    if (!user) return res.json({ success: false, message: "User not found" });

    if (user.role !== "owner") {
      return res.json({ success: false, message: "Access denied — Owner only" });
    }

    req.user = user;
    next();
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};