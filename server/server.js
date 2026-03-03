import express from "express"
import cors from "cors"
import "dotenv/config"
import { clerkMiddleware } from '@clerk/express'
import connectDB from "./config/mongodb.js"
import clerkWebhooks from "./controllers/clerkWebHooks.js"

await connectDB() // connection to data base

const app=express() //initialize express app
app.use(cors()) // enables corss origin to shared with frontend


//Middleware setup
app.use(express.json()) // enable json requeste for body
app.use(clerkMiddleware())

// api to listen to clerk webhooks
app.use("/api/clerk", express.raw({ type: "application/json" }), clerkWebhooks)

// Route check
app.get('/', (req, res) => {
  res.json({ success: true, message: "API works successfully" })
})

const port=process.env.PORT || 4000  // definir server port 

//start server
app.listen(port , ()=>console.log(`server is running at http://localhost:${port}`))