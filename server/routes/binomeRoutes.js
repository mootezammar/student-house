import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  createBinome,
  getBinomes,
  getMyBinome,
  updateBinome,
  deleteBinome,
  getBinomeById,
} from "../controllers/binomeController.js";

const router = express.Router();

// Public
router.get("/", getBinomes);

// Protected
router.post("/", protect, createBinome);
router.get("/my", protect, getMyBinome);
router.get("/:id", getBinomeById);
router.put("/my", protect, updateBinome);
router.delete("/my", protect, deleteBinome);

export default router;