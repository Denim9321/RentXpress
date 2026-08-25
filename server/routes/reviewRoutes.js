// server/routes/reviewRoutes.js
import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import Review from "../models/reviewModel.js";

const router = express.Router();

/* =========================================================
   ✅ POST: Add a new review (Authenticated users only)
   URL: /api/reviews
   Body: { itemId, rating, comment }
========================================================= */
router.post("/", protect, async (req, res) => {
  try {
    const userId = req.user._id;
    const { itemId, rating, comment } = req.body;

    console.log("🟢 Add Review Request:", { userId, itemId, rating, comment });

    if (!itemId || !rating) {
      return res
        .status(400)
        .json({ success: false, message: "Item ID and rating are required." });
    }

    const numericRating = Number(rating);
    if (isNaN(numericRating) || numericRating < 1 || numericRating > 5) {
      return res
        .status(400)
        .json({ success: false, message: "Rating must be between 1 and 5." });
    }

    const newReview = new Review({
      item: itemId,
      user: userId,
      rating: numericRating,
      comment: comment || "",
    });

    await newReview.save();

    console.log("✅ Review added successfully:", newReview._id);

    res.status(201).json({
      success: true,
      message: "Review added successfully!",
      review: newReview,
    });
  } catch (error) {
    console.error("❌ Add Review Error:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error while adding review.",
    });
  }
});

/* =========================================================
   ✅ GET: Get all reviews for a specific item
   URL: /api/reviews/:itemId
========================================================= */
router.get("/:itemId", async (req, res) => {
  try {
    const { itemId } = req.params;

    const reviews = await Review.find({ item: itemId })
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, reviews });
  } catch (error) {
    console.error("❌ Fetch Reviews Error:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to fetch reviews.",
    });
  }
});

export default router;
