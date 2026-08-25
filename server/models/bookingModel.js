import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    // ✅ User who made the booking
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User reference is required"],
    },

    // ✅ Rented item (equipment, vehicle, or room)
    item: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Item",
      required: [true, "Item reference is required"],
    },

    // ✅ Booking period
    startDate: {
      type: Date,
      required: [true, "Start date is required"],
    },
    endDate: {
      type: Date,
      required: [true, "End date is required"],
    },

    // ✅ Total booking cost
    totalPrice: {
      type: Number,
      required: [true, "Total price is required"],
      min: [0, "Total price cannot be negative"],
    },

    // ✅ Booking status
    status: {
      type: String,
      enum: ["confirmed", "pending", "cancelled", "completed"],
      default: "confirmed",
    },
  },
  {
    timestamps: true,
  }
);

// ✅ Optimize queries
bookingSchema.index({ user: 1 });
bookingSchema.index({ item: 1 });
bookingSchema.index({ status: 1 });

// ✅ Auto-populate for all booking queries
bookingSchema.pre(/^find/, function (next) {
  this.populate("user", "name email")
      .populate("item", "name category location price imageUrl");
  next();
});

const Booking = mongoose.model("Booking", bookingSchema);
export default Booking;
