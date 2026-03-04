import express from "express";
import { protect, isOwner } from "../middleware/authMiddleware.js";
import {
  registerAgency,
  getMyAgency,
  updateAgency,
  getAgencyById,
} from "../controllers/agencyController.js";

const agencyRouter = express.Router();

// ✅ Routes spécifiques AVANT /:id
agencyRouter.post("/register", protect, registerAgency);
agencyRouter.get("/my", protect, getMyAgency);
agencyRouter.put("/update", isOwner, updateAgency);

// ✅ Route dynamique EN DERNIER
agencyRouter.get("/:id", getAgencyById);

export default agencyRouter;