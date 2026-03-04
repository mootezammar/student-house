import express from "express";
import { isOwner } from "../middleware/authMiddleware.js";
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

router.get("/", getProperties);
router.get("/my", isOwner, getMyProperties);
router.get("/:id", getPropertyById);
router.post("/", isOwner, upload.array("images", 4), addProperty);
router.patch("/toggle/:id", isOwner, toggleAvailability);
router.delete("/:id", isOwner, deleteProperty);

export default router;