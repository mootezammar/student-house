import Agency from "../models/Agency.js";
import User from "../models/User.js";
import connectDB from "../config/mongodb.js";

// Register agency
export const registerAgency = async (req, res) => {
  await connectDB();
  try {
    const { userId } = req.auth;
    const { name, contact, email, address, city } = req.body;

    // Check if user already has an agency
    const user = await User.findOne({ clerkId: userId });
    if (!user) return res.json({ success: false, message: "User not found" });

    if (user.agency) {
      return res.json({ success: false, message: "You already have an agency" });
    }

    // Create agency
    const agency = await Agency.create({
      name,
      contact,
      email,
      address,
      city,
      owner: user._id,
    });

    // Update user role to owner and link agency
    await User.findByIdAndUpdate(user._id, {
      role: "owner",
      agency: agency._id,
    });

    res.json({ success: true, agency });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Get my agency
export const getMyAgency = async (req, res) => {
  await connectDB();
  try {
    const { userId } = req.auth;
    const user = await User.findOne({ clerkId: userId });
    if (!user) return res.json({ success: false, message: "User not found" });

    const agency = await Agency.findById(user.agency).populate("owner", "name email image");
    if (!agency) return res.json({ success: false, message: "Agency not found" });

    res.json({ success: true, agency });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Update agency
export const updateAgency = async (req, res) => {
  await connectDB();
  try {
    const { userId } = req.auth;
    const { name, contact, email, address, city } = req.body;

    const user = await User.findOne({ clerkId: userId });
    if (!user) return res.json({ success: false, message: "User not found" });

    const agency = await Agency.findByIdAndUpdate(
      user.agency,
      { name, contact, email, address, city },
      { new: true }
    );

    res.json({ success: true, agency });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Get agency by id — public
export const getAgencyById = async (req, res) => {
  await connectDB();
  try {
    const { id } = req.params;
    const agency = await Agency.findById(id)
      .populate("owner", "name email image")
      .populate("properties");

    if (!agency) return res.json({ success: false, message: "Agency not found" });

    res.json({ success: true, agency });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};