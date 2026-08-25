import express from "express";
import { protect, adminOnly } from "../middleware/authMiddleware.js";
import User from "../models/userModel.js";
import Item from "../models/itemModel.js";
import Booking from "../models/bookingModel.js";

const router = express.Router();

/* =========================================================
   ✅ Verify Admin Access
========================================================= */
router.get("/check", protect, adminOnly, (req, res) => {
  res.status(200).json({
    success: true,
    message: "✅ Admin verified successfully!",
    admin: req.user.name,
    role: req.user.role,
  });
});

/* =========================================================
   ✅ Fetch All Users
========================================================= */
router.get("/users", protect, adminOnly, async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.status(200).json({ success: true, users });
  } catch (err) {
    console.error("❌ Users Fetch Error:", err.message);
    res.status(500).json({
      success: false,
      message: "Failed to fetch users",
      error: err.message,
    });
  }
});

/* =========================================================
   ✅ Fetch All Items
========================================================= */
router.get("/items", protect, adminOnly, async (req, res) => {
  try {
    const items = await Item.find({}).populate("owner", "name email");
    res.status(200).json({ success: true, items });
  } catch (err) {
    console.error("❌ Items Fetch Error:", err.message);
    res.status(500).json({
      success: false,
      message: "Failed to fetch items",
      error: err.message,
    });
  }
});

/* =========================================================
   ✅ Fetch All Bookings
========================================================= */
router.get("/bookings", protect, adminOnly, async (req, res) => {
  try {
    const bookings = await Booking.find({})
      .populate("user", "name email")
      .populate({
        path: "item",
        populate: { path: "owner", select: "name email" },
      });
    res.status(200).json({ success: true, bookings });
  } catch (err) {
    console.error("❌ Bookings Fetch Error:", err.message);
    res.status(500).json({
      success: false,
      message: "Failed to fetch bookings",
      error: err.message,
    });
  }
});

/* =========================================================
   ✅ Delete User
========================================================= */
router.delete("/users/:id", protect, adminOnly, async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });

    res
      .status(200)
      .json({ success: true, message: "🗑️ User deleted successfully" });
  } catch (err) {
    console.error("❌ User Delete Error:", err.message);
    res.status(500).json({
      success: false,
      message: "Failed to delete user",
      error: err.message,
    });
  }
});

/* =========================================================
   ✅ Delete Item
========================================================= */
router.delete("/items/:id", protect, adminOnly, async (req, res) => {
  try {
    const item = await Item.findByIdAndDelete(req.params.id);
    if (!item)
      return res
        .status(404)
        .json({ success: false, message: "Item not found" });

    res
      .status(200)
      .json({ success: true, message: "🗑️ Item deleted successfully" });
  } catch (err) {
    console.error("❌ Item Delete Error:", err.message);
    res.status(500).json({
      success: false,
      message: "Failed to delete item",
      error: err.message,
    });
  }
});

/* =========================================================
   ✅ Delete Booking
========================================================= */
router.delete("/bookings/:id", protect, adminOnly, async (req, res) => {
  try {
    const booking = await Booking.findByIdAndDelete(req.params.id);
    if (!booking)
      return res
        .status(404)
        .json({ success: false, message: "Booking not found" });

    res
      .status(200)
      .json({ success: true, message: "🗑️ Booking deleted successfully" });
  } catch (err) {
    console.error("❌ Booking Delete Error:", err.message);
    res.status(500).json({
      success: false,
      message: "Failed to delete booking",
      error: err.message,
    });
  }
});

/* =========================================================
   ✅ Dashboard Stats
========================================================= */
router.get("/stats", protect, adminOnly, async (req, res) => {
  try {
    const [users, items, bookings] = await Promise.all([
      User.countDocuments(),
      Item.countDocuments(),
      Booking.countDocuments(),
    ]);

    res.status(200).json({
      success: true,
      stats: {
        users,
        items,
        bookings,
      },
    });
  } catch (err) {
    console.error("❌ Stats Error:", err.message);
    res.status(500).json({
      success: false,
      message: "Failed to load dashboard stats",
      error: err.message,
    });
  }
});

export default router;
