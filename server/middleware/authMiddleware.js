import { requireAuth } from "@clerk/express";
import User from "../models/User.js";
import connectDB from "../config/mongodb.js";

// Middleware — vérifie si l'user est connecté
export const protect = requireAuth();

// Middleware — vérifie si l'user est owner
export const isOwner = async (req, res, next) => {
  await connectDB();
  try {
    const { userId } = req.auth;
    const user = await User.findOne({ clerkId: userId });

    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    if (user.role !== "owner") {
      return res.json({ success: false, message: "Access denied — Owner only" });
    }

    req.user = user;
    next();
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Middleware — attache l'user à req
export const attachUser = async (req, res, next) => {
  await connectDB();
  try {
    const { userId } = req.auth;
    const user = await User.findOne({ clerkId: userId });

    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
