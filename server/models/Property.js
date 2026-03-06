import mongoose from "mongoose";

const propertySchema = new mongoose.Schema(
  {
    agency: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Agency",
      required: true,
    },
    title: { type: String, required: true },
    description: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    country: { type: String, default: "Tunisia" },
    coordinates: {
      lat: { type: Number },
      lng: { type: Number },
    },
    propertyType: {
      type: String,
      enum: ["s+0", "s+1", "s+2", "s+3", "s+4", "s+5+"],
      required: true,
    },
    price: {
      rent: { type: Number, required: true },
    },
    facilities: {
      bedrooms: { type: Number, default: 0 },
      bathrooms: { type: Number, default: 0 },
      garages: { type: Number, default: 0 },
    },
    area: { type: Number },
    amenities: [{ type: String }],
    nearbyEducation: [
      {
        name: { type: String },
        type: { type: String },
        distance: { type: String },
        lat: { type: Number },
        lng: { type: Number },
      },
    ],
    images: [{ type: String }],
    isAvailable: { type: Boolean, default: true },
    isBinome: { type: Boolean, default: false },
    status: {
      type: String,
      enum: ["available", "unavailable"],
      default: "available",
    },
  },
  { timestamps: true },
);

const Property = mongoose.model("Property", propertySchema);
export default Property;
