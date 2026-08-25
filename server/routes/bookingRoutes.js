import express from "express";
import { protect, adminOnly } from "../middleware/authMiddleware.js";
import Booking from "../models/bookingModel.js";

const router = express.Router();

/* ========================================================
   ✅ Create a new booking
======================================================== */
router.post("/", protect, async (req, res) => {
  try {
    const { itemId, startDate, endDate, totalPrice } = req.body;

    if (!itemId || !startDate || !endDate || !totalPrice) {
      return res.status(400).json({
        success: false,
        message: "Missing booking details.",
      });
    }

    const booking = await Booking.create({
      user: req.user._id,
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
    console.error("❌ Booking Creation Error:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error creating booking",
      error: error.message,
    });
  }
});

/* ========================================================
   ✅ Get all bookings for logged-in user
======================================================== */
router.get("/", protect, async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate("item", "name category location price imageUrl")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      bookings,
    });
  } catch (error) {
    console.error("❌ Fetch Bookings Error:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error fetching bookings",
      error: error.message,
    });
  }
});

/* ========================================================
   ✅ Cancel a booking (for users)
======================================================== */
router.put("/cancel/:id", protect, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    const bookingUserId = booking.user?._id
      ? booking.user._id.toString()
      : booking.user.toString();
    const currentUserId = req.user._id.toString();

    if (bookingUserId !== currentUserId) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized to cancel this booking",
      });
    }

    booking.status = "cancelled";
    await booking.save();

    res.status(200).json({
      success: true,
      message: "❌ Booking cancelled successfully",
      booking,
    });
  } catch (error) {
    console.error("❌ Cancel Booking Error:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error cancelling booking",
      error: error.message,
    });
  }
});

/* ========================================================
   ✅ Delete a booking (Admin only)
======================================================== */
router.delete("/:id", protect, adminOnly, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res
        .status(404)
        .json({ success: false, message: "Booking not found" });
    }

    await booking.deleteOne();
    res.status(200).json({
      success: true,
      message: "✅ Booking deleted successfully",
    });
  } catch (error) {
    console.error("❌ Delete Booking Error:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error deleting booking",
      error: error.message,
    });
  }
});

export default router;
