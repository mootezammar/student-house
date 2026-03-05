import mongoose from "mongoose";

const binomeSchema = new mongoose.Schema({
  property: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Property",
    required: true,
  },
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  lookingFor: {
    type: Number,
    enum: [1, 2],
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  preferences: [{ type: String }],
  availableFrom: {
    type: Date,
    required: true,
  },
  university: { type: String, default: "" },
  field: { type: String, default: "" },
  year: { type: String, default: "" },
  contact: { type: String, default: "" },
  phone: { type: String, default: "" },
}, { timestamps: true });

const Binome = mongoose.model("Binome", binomeSchema);
export default Binome;