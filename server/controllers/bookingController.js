import Booking from "../models/bookingModel.js";
import Item from "../models/itemModel.js";
import jwt from "jsonwebtoken";

/**
 * ✅ Create Booking
 */
export const createBooking = async (req, res) => {
  try {
    const { itemId, startDate, endDate, totalPrice } = req.body;

    if (!req.headers.authorization)
      return res.status(401).json({ success: false, message: "No token provided" });

    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    if (!itemId || !startDate || !endDate || !totalPrice)
      return res.status(400).json({ success: false, message: "Missing booking details" });

    const itemExists = await Item.findById(itemId);
    if (!itemExists)
      return res.status(404).json({ success: false, message: "Item not found" });

    const booking = await Booking.create({
      user: userId,
      item: itemId,
      startDate,
      endDate,
      totalPrice,
      status: "confirmed",
    });

    res.status(201).json({
      success: true,
      message: "✅ Booking created successfully",
      booking,
    });
  } catch (error) {
    console.error("❌ Booking Error:", error.message);
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};

/**
 * ✅ Get Bookings of Logged-In User
 */
export const getUserBookings = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token)
      return res.status(401).json({ success: false, message: "No token provided" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    const bookings = await Booking.find({ user: userId })
      .populate("item", "name category location price imageUrl")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, bookings });
  } catch (error) {
    console.error("❌ Fetch Bookings Error:", error.message);
    res.status(500).json({ success: false, message: "Error fetching bookings" });
  }
};

/**
 * ✅ Cancel Booking
 */
export const cancelBooking = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token)
      return res.status(401).json({ success: false, message: "No token provided" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const booking = await Booking.findById(req.params.id);

    if (!booking)
      return res.status(404).json({ success: false, message: "Booking not found" });

    if (booking.user.toString() !== decoded.id)
      return res.status(403).json({ success: false, message: "Unauthorized user" });

    booking.status = "cancelled";
    await booking.save();

    res.status(200).json({ success: true, message: "❌ Booking cancelled", booking });
  } catch (error) {
    console.error("❌ Cancel Booking Error:", error.message);
    res.status(500).json({ success: false, message: "Error cancelling booking" });
  }
};

/**
 * ✅ Admin: Get All Bookings
 */
export const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("user", "name email")
      .populate("item", "name category location price")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, bookings });
  } catch (error) {
    console.error("❌ Admin Fetch Bookings Error:", error.message);
    res.status(500).json({ success: false, message: "Error fetching all bookings" });
  }
};
