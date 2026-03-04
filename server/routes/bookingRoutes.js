import express from "express";
import { requireAuth } from "@clerk/express";
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
router.post("/",  createBooking);
router.get("/my", requireAuth(), getMyBookings);
router.patch("/cancel/:id", requireAuth(), cancelBooking);

// Owner
router.get("/agency", requireAuth(), getAgencyBookings);
router.patch("/pay/:id", requireAuth(), markAsPaid);

// Stripe session
router.post("/stripe", requireAuth(), createStripeSession);

export default router;