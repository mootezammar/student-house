import express from "express";
import cors from "cors";
import "dotenv/config";
import { clerkMiddleware } from "@clerk/express";
import connectDB from "./config/mongodb.js";
import clerkWebhooks from "./controllers/clerkWebHooks.js";
import userRoutes from "./routes/userRoute.js";
import agencyRoutes from "./routes/agencyRoutes.js";
import propertyRoutes from "./routes/propertyRoutes.js"
await connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(clerkMiddleware());

// ⚠️ Webhook AVANT express.json()
app.post(
  "/api/clerk",
  express.raw({ type: "application/json" }),
  clerkWebhooks,
);

// APRÈS webhook
app.use(express.json());

//definir api routes
app.use("/api/user", userRoutes);
app.use("/api/agency", agencyRoutes);
app.use("/api/properties", propertyRoutes)

// Route check
app.get("/", (req, res) => {
  res.json({ success: true, message: "API works successfully" });
});

const port = process.env.PORT || 4000;

app.listen(port, () =>
  console.log(`server is running at http://localhost:${port}`),
);
