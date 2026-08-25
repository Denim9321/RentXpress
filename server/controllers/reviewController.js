import Review from "../models/reviewModel.js";

/**
 * ✅ Add Review
 */
export const addReview = async (req, res) => {
  try {
    const { itemId, rating, comment } = req.body;

    if (!itemId || !rating)
      return res.status(400).json({ success: false, message: "Missing fields" });

    const review = await Review.create({
      item: itemId,
      user: req.user._id,
      rating,
      comment,
    });

    res.status(201).json({ success: true, message: "✅ Review added", review });
  } catch (error) {
    console.error("❌ Add Review Error:", error.message);
    res.status(500).json({ success: false, message: "Error adding review" });
  }
};

/**
 * ✅ Get Reviews by Item
 */
export const getReviewsByItem = async (req, res) => {
  try {
    const reviews = await Review.find({ item: req.params.itemId })
      .populate("user", "name")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, reviews });
  } catch (error) {
    console.error("❌ Get Reviews Error:", error.message);
    res.status(500).json({ success: false, message: "Error fetching reviews" });
  }
};
