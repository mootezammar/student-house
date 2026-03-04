import User from "../models/User.js";
import connectDB from "../config/mongodb.js";

// Get current user
export const getUser = async (req, res) => {
  await connectDB();
  try {
    const { userId } = req.auth;
    const user = await User.findOne({ clerkId: userId });
    if (!user) return res.json({ success: false, message: "User not found" });
    res.json({ success: true, user });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Update user role to owner
export const updateUserRole = async (req, res) => {
  await connectDB();
  try {
    const { userId } = req.auth;
    const user = await User.findOneAndUpdate(
      { clerkId: userId },
      { role: "owner" },
      { new: true }
    );
    res.json({ success: true, user });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Save / unsave property
export const toggleSaveProperty = async (req, res) => {
  await connectDB();
  try {
    const { userId } = req.auth;
    const { propertyId } = req.body;
    const user = await User.findOne({ clerkId: userId });
    if (!user) return res.json({ success: false, message: "User not found" });

    const isSaved = user.savedProperties.includes(propertyId);
    if (isSaved) {
      user.savedProperties = user.savedProperties.filter(
        (id) => id.toString() !== propertyId
      );
    } else {
      user.savedProperties.push(propertyId);
    }
    await user.save();
    res.json({ success: true, savedProperties: user.savedProperties });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Add recent searched city
export const addRecentCity = async (req, res) => {
  await connectDB();
  try {
    const { userId } = req.auth;
    const { city } = req.body;
    const user = await User.findOne({ clerkId: userId });
    if (!user) return res.json({ success: false, message: "User not found" });

    // Remove if already exists
    user.recentSearchedCities = user.recentSearchedCities.filter(
      (c) => c !== city
    );
    // Add to beginning
    user.recentSearchedCities.unshift(city);
    // Keep only last 5
    user.recentSearchedCities = user.recentSearchedCities.slice(0, 5);

    await user.save();
    res.json({ success: true, recentSearchedCities: user.recentSearchedCities });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};