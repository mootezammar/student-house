import Binome from "../models/Binome.js";
import User from "../models/User.js";
import connectDB from "../config/mongodb.js";

// ── Create binome
export const createBinome = async (req, res) => {
  await connectDB();
  try {
    const user = req.user;

    if (user.binome) {
      return res.json({
        success: false,
        message: "You already have a binome post",
      });
    }

    const {
      propertyId,
      lookingFor,
      description,
      preferences,
      availableFrom,
      university,
      field,
      year,
      contact,
      phone,
    } = req.body;

    const binome = await Binome.create({
      property: propertyId,
      student: user._id,
      lookingFor,
      description,
      preferences: preferences || [],
      availableFrom,
      university: university || "",
      field: field || "",
      year: year || "",
      contact: contact || user.email,
      phone: phone || "",
    });

    await User.findByIdAndUpdate(user._id, { binome: binome._id });

    res.json({ success: true, binome });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// ── Get all binomes — public
export const getBinomes = async (req, res) => {
  await connectDB();
  try {
    const { city } = req.query;

    const binomes = await Binome.find()
      .populate({
        path: "property",
        select: "title address city propertyType price images",
        match: city && city !== "All" ? { city } : {},
      })
      .populate("student", "name image")
      .sort({ createdAt: -1 });

    // Filter out binomes where property is null
    const filtered = binomes.filter((b) => b.property !== null);

    res.json({ success: true, binomes: filtered });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// ── Get my binome
export const getMyBinome = async (req, res) => {
  await connectDB();
  try {
    const user = req.user;
    const binome = await Binome.findById(user.binome)
      .populate("property", "title address city propertyType price images")
      .populate("student", "name image");

    if (!binome)
      return res.json({ success: false, message: "No binome post found" });

    res.json({ success: true, binome });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// ── Update binome
export const updateBinome = async (req, res) => {
  await connectDB();
  try {
    const user = req.user;

    const {
      lookingFor,
      description,
      preferences,
      availableFrom,
      university,
      field,
      year,
      contact,
      phone,
    } = req.body;

    const binome = await Binome.findByIdAndUpdate(
      user.binome,
      {
        lookingFor,
        description,
        preferences,
        availableFrom,
        university,
        field,
        year,
        contact,
        phone,
      },
      { new: true },
    );

    if (!binome)
      return res.json({ success: false, message: "Binome not found" });

    res.json({ success: true, binome });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// ── Delete binome
export const deleteBinome = async (req, res) => {
  await connectDB();
  try {
    const user = req.user;

    await Binome.findByIdAndDelete(user.binome);
    await User.findByIdAndUpdate(user._id, { binome: null });

    res.json({ success: true, message: "Binome post deleted" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const getBinomeById = async (req, res) => {
  await connectDB();
  try {
    const binome = await Binome.findById(req.params.id)
      .populate(
        "property",
        "title address city propertyType price images facilities amenities area",
      )
      .populate("student", "name image");

    if (!binome)
      return res.json({ success: false, message: "Binome not found" });

    res.json({ success: true, binome });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
