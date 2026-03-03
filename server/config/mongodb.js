import mongoose from "mongoose";

let isConnected = false;

const connectDB = async () => {
  if (isConnected) return;
  
  try {
    await mongoose.connect(process.env.MONGO_URL);
    isConnected = true;
    console.log("✅ Database connected");
  } catch (error) {
    console.log("❌ Database connection failed", error.message);
  }
};

export default connectDB;