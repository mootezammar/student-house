import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  // Clerk ID — lien entre Clerk et MongoDB
  clerkId: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    sparse:true,
    default:"",
  },
  image: {
    type: String,
    default: "",
  },
  // Agency owner ou étudiant
  role: {
    type: String,
    enum: ["student", "owner"],
    default: "student",
  },
  // Si owner — lié à une agency
  agency: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Agency",
    default: null,
  },
  // Si étudiant — ses bookings
  bookings: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
    }
  ],
  // Si étudiant — son annonce binome
  binome: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Binome",
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
}, { timestamps: true });

const User = mongoose.model("User", userSchema);
export default User;