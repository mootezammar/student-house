import express from "express";
import { protect, isOwner } from "../middleware/authMiddleware.js";
import {
  createBooking,
  getMyBookings,
  getAgencyBookings,
  cancelBooking,
  markAsPaid,
  createStripeSession,
} from "../controllers/bookingController.js";

const router = express.Router();

// Student
router.post("/", protect, createBooking);
router.get("/my", protect, getMyBookings);
router.patch("/cancel/:id", protect, cancelBooking);
router.post("/stripe", protect, createStripeSession);

// Owner
router.get("/agency", isOwner, getAgencyBookings);
router.patch("/pay/:id", isOwner, markAsPaid);

export default router;