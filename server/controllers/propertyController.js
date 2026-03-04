import Property from "../models/Property.js";
import Agency from "../models/Agency.js";
import User from "../models/User.js";
import connectDB from "../config/mongodb.js";
import { v2 as cloudinary } from "cloudinary";

// ── Get all properties — public
export const getProperties = async (req, res) => {
  await connectDB();
  try {
    const { city, propertyType, minPrice, maxPrice } = req.query;

    const filter = { isAvailable: true };
    if (city && city !== "All") filter.city = city;
    if (propertyType && propertyType !== "All") filter.propertyType = propertyType;
    if (minPrice || maxPrice) {
      filter["price.rent"] = {};
      if (minPrice) filter["price.rent"].$gte = Number(minPrice);
      if (maxPrice) filter["price.rent"].$lte = Number(maxPrice);
    }

    const properties = await Property.find(filter)
      .populate("agency", "name email contact city")
      .sort({ createdAt: -1 });

    res.json({ success: true, properties });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// ── Get single property — public
export const getPropertyById = async (req, res) => {
  await connectDB();
  try {
    const property = await Property.findById(req.params.id)
      .populate("agency");
    if (!property) return res.json({ success: false, message: "Property not found" });
    res.json({ success: true, property });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// ── Add property — owner only
export const addProperty = async (req, res) => {
  await connectDB();
  try {
    const { userId } = req.auth;
    const user = await User.findOne({ clerkId: userId });
    if (!user) return res.json({ success: false, message: "User not found" });

    const agency = await Agency.findById(user.agency);
    if (!agency) return res.json({ success: false, message: "Agency not found" });

    const {
      title, description, address, city, country,
      propertyType, rent, bedrooms, bathrooms,
      garages, area, amenities, nearbyEducation, coordinates,
    } = req.body;

    // Upload images to cloudinary
    const imageUrls = [];
if (req.files && req.files.length > 0) {
  for (const file of req.files) {
    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        { folder: "student-house/properties" },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      ).end(file.buffer);
    });
    imageUrls.push(result.secure_url);
  }
}

    const property = await Property.create({
      agency: agency._id,
      title,
      description,
      address,
      city,
      country: country || "Tunisia",
      propertyType,
      price: { rent: Number(rent) },
      facilities: {
        bedrooms: Number(bedrooms) || 0,
        bathrooms: Number(bathrooms) || 0,
        garages: Number(garages) || 0,
      },
      area: Number(area),
      amenities: amenities ? JSON.parse(amenities) : [],
      nearbyEducation: nearbyEducation ? JSON.parse(nearbyEducation) : [],
      coordinates: coordinates ? JSON.parse(coordinates) : {},
      images: imageUrls,
    });

    // Add property to agency
    await Agency.findByIdAndUpdate(agency._id, {
      $push: { properties: property._id },
    });

    res.json({ success: true, property });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// ── Get my properties — owner only
export const getMyProperties = async (req, res) => {
  await connectDB();
  try {
    const { userId } = req.auth;
    const user = await User.findOne({ clerkId: userId });
    if (!user) return res.json({ success: false, message: "User not found" });

    const properties = await Property.find({ agency: user.agency })
      .sort({ createdAt: -1 });

    res.json({ success: true, properties });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// ── Toggle availability — owner only
export const toggleAvailability = async (req, res) => {
  await connectDB();
  try {
    const { id } = req.params;
    const property = await Property.findById(id);
    if (!property) return res.json({ success: false, message: "Property not found" });

    property.isAvailable = !property.isAvailable;
    property.status = property.isAvailable ? "available" : "unavailable";
    await property.save();

    res.json({ success: true, property });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// ── Delete property — owner only
export const deleteProperty = async (req, res) => {
  await connectDB();
  try {
    const { id } = req.params;
    const { userId } = req.auth;
    const user = await User.findOne({ clerkId: userId });

    const property = await Property.findById(id);
    if (!property) return res.json({ success: false, message: "Property not found" });

    // Delete images from cloudinary
    for (const imageUrl of property.images) {
      const publicId = imageUrl.split("/").slice(-2).join("/").split(".")[0];
      await cloudinary.uploader.destroy(publicId);
    }

    await Property.findByIdAndDelete(id);

    // Remove from agency
    await Agency.findByIdAndUpdate(user.agency, {
      $pull: { properties: id },
    });

    res.json({ success: true, message: "Property deleted" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};