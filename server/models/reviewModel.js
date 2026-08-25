import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    // ✅ Linked item
    item: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Item",
      required: [true, "Item reference is required"],
    },

    // ✅ Reviewer (User)
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User reference is required"],
    },

    // ✅ Rating
    rating: {
      type: Number,
      required: [true, "Rating is required"],
      min: [1, "Minimum rating is 1"],
      max: [5, "Maximum rating is 5"],
    },

    // ✅ Optional comment
    comment: {
      type: String,
      trim: true,
      default: "",
    },
  },
  { timestamps: true }
);

// ✅ Prevent duplicate reviews by same user on same item
reviewSchema.index({ item: 1, user: 1 }, { unique: true });

// ✅ Populate user details automatically
reviewSchema.pre(/^find/, function (next) {
  this.populate("user", "name email");
  next();
});

export default mongoose.model("Review", reviewSchema);
