import express from "express"
import cors from "cors"
import "dotenv/config"
import { clerkMiddleware } from '@clerk/express'
import connectDB from "./config/mongodb.js"
import clerkWebhooks from "./controllers/clerkWebHooks.js"

await connectDB()

const app = express()
app.use(cors())
app.use(clerkMiddleware())

// ✅ AVANT express.json()
app.post("/api/clerk", express.raw({ type: "application/json" }), clerkWebhooks)

// ✅ APRÈS le webhook
app.use(express.json())

app.get('/', (req, res) => {
  res.json({ success: true, message: "API works successfully" })
})

const port = process.env.PORT || 4000

app.listen(port, () => console.log(`server is running at http://localhost:${port}`))