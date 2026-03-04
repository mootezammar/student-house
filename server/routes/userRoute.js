import express from "express";
import { requireAuth } from "@clerk/express";
import {
  getUser,
  updateUserRole,
  toggleSaveProperty,
  addRecentCity,
} from "../controllers/userController.js";

const userRouter = express.Router();

userRouter.get("/", requireAuth(), getUser);
userRouter.put("/role", requireAuth(), updateUserRole);
userRouter.post("/save-property", requireAuth(), toggleSaveProperty);
userRouter.post("/recent-city", requireAuth(), addRecentCity);

export default userRouter;