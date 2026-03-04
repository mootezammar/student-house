import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  property: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Property",
    required: true,
  },
  agency: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Agency",
    required: true,
  },
  checkInDate: { type: Date, required: true },
  checkOutDate: { type: Date, required: true },
  totalPrice: { type: Number, required: true },
  guests: { type: Number, default: 1 },
  status: {
    type: String,
    enum: ["pending", "confirmed", "cancelled"],
    default: "pending",
  },
  paymentMethod: {
    type: String,
    enum: ["Stripe", "Pay at Check-in"],
    default: "Pay at Check-in",
  },
  isPaid: { type: Boolean, default: false },
}, { timestamps: true });

const Booking = mongoose.model("Booking", bookingSchema);
export default Booking;