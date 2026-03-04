import User from "../models/User.js";
import connectDB from "../config/mongodb.js";

export const getUser = async (req, res) => {
  await connectDB();
  try {
    res.json({ success: true, user: req.user });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const updateUserRole = async (req, res) => {
  await connectDB();
  try {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { role: "owner" },
      { new: true }
    );
    res.json({ success: true, user });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const toggleSaveProperty = async (req, res) => {
  await connectDB();
  try {
    const { propertyId } = req.body;
    const user = req.user;
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

export const addRecentCity = async (req, res) => {
  await connectDB();
  try {
    const { city } = req.body;
    const user = req.user;
    user.recentSearchedCities = user.recentSearchedCities.filter((c) => c !== city);
    user.recentSearchedCities.unshift(city);
    user.recentSearchedCities = user.recentSearchedCities.slice(0, 5);
    await user.save();
    res.json({ success: true, recentSearchedCities: user.recentSearchedCities });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};