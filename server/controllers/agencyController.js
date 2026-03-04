import Agency from "../models/Agency.js";
import User from "../models/User.js";
import connectDB from "../config/mongodb.js";

export const registerAgency = async (req, res) => {
  await connectDB();
  try {
    const user = req.user;
    if (user.agency) return res.json({ success: false, message: "You already have an agency" });
    const { name, contact, email, address, city } = req.body;
    const agency = await Agency.create({ name, contact, email, address, city, owner: user._id });
    await User.findByIdAndUpdate(user._id, { role: "owner", agency: agency._id });
    res.json({ success: true, agency });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const getMyAgency = async (req, res) => {
  await connectDB();
  try {
    const user = req.user;
    const agency = await Agency.findById(user.agency).populate("owner", "name email image");
    if (!agency) return res.json({ success: false, message: "Agency not found" });
    res.json({ success: true, agency });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const updateAgency = async (req, res) => {
  await connectDB();
  try {
    const user = req.user;
    const { name, contact, email, address, city } = req.body;
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

export const getAgencyById = async (req, res) => {
  await connectDB();
  try {
    const agency = await Agency.findById(req.params.id)
      .populate("owner", "name email image")
      .populate("properties");
    if (!agency) return res.json({ success: false, message: "Agency not found" });
    res.json({ success: true, agency });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};