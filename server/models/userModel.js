import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: "user" }, // "user" or "admin"

    // ✅ New fields added
    aadharNumber: {
      type: String,
      required: [true, "Aadhaar number is required"],
      match: [/^\d{12}$/, "Aadhaar number must be 12 digits"],
    },
    contactNumber: {
      type: String,
      required: [true, "Contact number is required"],
      match: [/^[6-9]\d{9}$/, "Enter a valid 10-digit contact number"],
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
