import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  getUser,
  updateUserRole,
  toggleSaveProperty,
  addRecentCity,
} from "../controllers/userController.js";

const router = express.Router();

router.get("/", protect, getUser);
router.put("/role", protect, updateUserRole);
router.post("/save-property", protect, toggleSaveProperty);
router.post("/recent-city", protect, addRecentCity);

export default router;