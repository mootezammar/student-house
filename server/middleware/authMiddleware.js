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

    const clerkId = payload.sub;

    // ── Chercher ou créer l'user automatiquement
    let user = await User.findOne({ clerkId });

    if (!user) {
      // Extraire les infos depuis le token Clerk
      const email =
        payload.email_address ||
        payload.email ||
        (payload.primary_email_address_id
          ? `${clerkId}@clerk.user`
          : `${clerkId}@clerk.user`);

      const firstName = payload.first_name || payload.given_name || "";
      const lastName = payload.last_name || payload.family_name || "";
      const image = payload.image_url || payload.profile_image_url || "";

      user = await User.create({
        clerkId,
        name: `${firstName} ${lastName}`.trim() || "Student",
        email,
        image,
        role: "student",
      });
    }

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

    const clerkId = payload.sub;

    // ── Chercher ou créer l'user automatiquement
    let user = await User.findOne({ clerkId });

    if (!user) {
      const email =
        payload.email_address ||
        payload.email ||
        (payload.primary_email_address_id
          ? `${clerkId}@clerk.user`
          : `${clerkId}@clerk.user`);

      const firstName = payload.first_name || payload.given_name || "";
      const lastName = payload.last_name || payload.family_name || "";
      const image = payload.image_url || payload.profile_image_url || "";

      user = await User.create({
        clerkId,
        name: `${firstName} ${lastName}`.trim() || "Student",
        email,
        image,
        role: "student",
      });
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