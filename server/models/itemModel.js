import mongoose from "mongoose";

const itemSchema = new mongoose.Schema(
  {
    // ✅ Basic item info
    name: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true, enum: ["Equipment", "Vehicle", "Room"] },
    price: { type: Number, required: true, min: [0, "Price cannot be negative"] },
    location: { type: String, required: true },

    // ✅ Image handling (either URL or uploaded)
    imageUrl: { type: String },
    image: { type: String }, // fallback for old uploads

    // ✅ Owner info
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false, // optional for older records
    },
    ownerName: { type: String },
    ownerContact: { type: String },
  },
  { timestamps: true }
);

// ✅ Virtual for unified image field
itemSchema.virtual("displayImage").get(function () {
  return this.imageUrl || this.image || "/default.jpg";
});

export default mongoose.model("Item", itemSchema);
