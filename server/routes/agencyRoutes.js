import express from "express";
import { requireAuth } from "@clerk/express";
import {
  registerAgency,
  getMyAgency,
  updateAgency,
  getAgencyById,
} from "../controllers/agencyController.js";

const agencyRouter = express.Router();

// Public
agencyRouter.get("/:id", getAgencyById);

// Protected
agencyRouter.post("/register", requireAuth(), registerAgency);
agencyRouter.get("/my/agency", requireAuth(), getMyAgency);
agencyRouter.put("/my/agency", requireAuth(), updateAgency);

export default agencyRouter;