import Booking from "../models/Booking.js";
import Property from "../models/Property.js";
import User from "../models/User.js";
import connectDB from "../config/mongodb.js";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// ── Create Stripe payment session
export const createStripeSession = async (req, res) => {
  await connectDB();
  try {
    const { bookingId } = req.body;
    const booking = await Booking.findById(bookingId)
      .populate("property", "title images price");

    if (!booking) return res.json({ success: false, message: "Booking not found" });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: booking.property.title,
              images: [booking.property.images[0]],
            },
            unit_amount: booking.totalPrice * 100, // cents
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.FRONTEND_URL}/my-bookings?success=true`,
      cancel_url: `${process.env.FRONTEND_URL}/my-bookings?cancelled=true`,
      metadata: {
        bookingId: bookingId,
      },
    });

    res.json({ success: true, url: session.url });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// ── Stripe Webhook — mark booking as paid
export const stripeWebhook = async (req, res) => {
  await connectDB();
  const sig = req.headers["stripe-signature"];

  try {
    const event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      const bookingId = session.metadata.bookingId;

      await Booking.findByIdAndUpdate(bookingId, {
        isPaid: true,
        status: "confirmed",
      });
    }

    res.json({ success: true });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// ── Create booking — student
export const createBooking = async (req, res) => {
  await connectDB();
  try {
    const { userId } = req.auth;
    const user = await User.findOne({ clerkId: userId });
    if (!user) return res.json({ success: false, message: "User not found" });

    const { propertyId, checkInDate, checkOutDate, guests, paymentMethod } = req.body;

    const property = await Property.findById(propertyId);
    if (!property) return res.json({ success: false, message: "Property not found" });
    if (!property.isAvailable) return res.json({ success: false, message: "Property not available" });

    const booking = await Booking.create({
      user: user._id,
      property: propertyId,
      agency: property.agency,
      checkInDate,
      checkOutDate,
      totalPrice: property.price.rent,
      guests: guests || 1,
      paymentMethod: paymentMethod || "Pay at Check-in",
    });

    // Add booking to user
    await User.findByIdAndUpdate(user._id, {
      $push: { bookings: booking._id },
    });

    res.json({ success: true, booking });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// ── Get my bookings — student
export const getMyBookings = async (req, res) => {
  await connectDB();
  try {
    const { userId } = req.auth;
    const user = await User.findOne({ clerkId: userId });
    if (!user) return res.json({ success: false, message: "User not found" });

    const bookings = await Booking.find({ user: user._id })
      .populate("property", "title address city images price propertyType")
      .populate("agency", "name email contact")
      .sort({ createdAt: -1 });

    res.json({ success: true, bookings });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// ── Get agency bookings — owner
export const getAgencyBookings = async (req, res) => {
  await connectDB();
  try {
    const { userId } = req.auth;
    const user = await User.findOne({ clerkId: userId });
    if (!user) return res.json({ success: false, message: "User not found" });

    const bookings = await Booking.find({ agency: user.agency })
      .populate("property", "title address city images price")
      .populate("user", "name email image")
      .sort({ createdAt: -1 });

    const totalRevenue = bookings
      .filter((b) => b.isPaid)
      .reduce((acc, b) => acc + b.totalPrice, 0);

    res.json({ success: true, bookings, totalRevenue });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// ── Cancel booking — student
export const cancelBooking = async (req, res) => {
  await connectDB();
  try {
    const { id } = req.params;
    const { userId } = req.auth;
    const user = await User.findOne({ clerkId: userId });

    const booking = await Booking.findById(id);
    if (!booking) return res.json({ success: false, message: "Booking not found" });

    if (booking.user.toString() !== user._id.toString()) {
      return res.json({ success: false, message: "Not authorized" });
    }

    booking.status = "cancelled";
    await booking.save();

    res.json({ success: true, booking });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// ── Mark as paid — owner
export const markAsPaid = async (req, res) => {
  await connectDB();
  try {
    const { id } = req.params;
    const booking = await Booking.findByIdAndUpdate(
      id,
      { isPaid: true, status: "confirmed" },
      { new: true }
    );
    if (!booking) return res.json({ success: false, message: "Booking not found" });
    res.json({ success: true, booking });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};