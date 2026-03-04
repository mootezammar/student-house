import express from "express";
import { requireAuth } from "@clerk/express";
import { upload } from "../config/cloudinary.js";
import {
  getProperties,
  getPropertyById,
  addProperty,
  getMyProperties,
  toggleAvailability,
  deleteProperty,
} from "../controllers/propertyController.js";

const router = express.Router();

// Public
router.get("/", getProperties);
router.get("/my", requireAuth(), getMyProperties);
router.get("/:id", getPropertyById);

// Protected — owner only
router.post("/", requireAuth(), upload.array("images", 4), addProperty);
router.patch("/toggle/:id", requireAuth(), toggleAvailability);
router.delete("/:id", requireAuth(), deleteProperty);

export default router;