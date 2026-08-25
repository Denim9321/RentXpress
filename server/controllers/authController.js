import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

/**
 * 🔹 Helper – Generate JWT Token
 */
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

/**
 * ✅ Register New User
 */
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    // Create and save user (password will auto-hash from model middleware)
    const user = new User({ name, email, password, role: "user" });
    await user.save();

    res.status(201).json({ message: "✅ User registered successfully" });
  } catch (err) {
    console.error("❌ Registration Error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

/**
 * ✅ Login User / Admin
 */
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    // Generate JWT token with role info
    const token = generateToken(user._id, user.role);

    res.status(200).json({
      message: "✅ Login successful",
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("❌ Login Error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

/**
 * ✅ Get Logged-in User Profile
 */
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ success: true, user });
  } catch (err) {
    console.error("❌ Profile Error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

/**
 * ⚙️ Optional: Seed an Admin Account (run once)
 */
export const seedAdmin = async (req, res) => {
  try {
    const adminExists = await User.findOne({ role: "admin" });
    if (adminExists)
      return res.status(400).json({ message: "Admin already exists" });

    const admin = new User({
      name: "Super Admin",
      email: "admin@rentxpress.com",
      password: "Admin@123",
      role: "admin",
    });

    await admin.save();
    res.status(201).json({
      message: "✅ Admin created successfully",
      admin: { email: admin.email, password: "Admin@123" },
    });
  } catch (err) {
    console.error("❌ Admin Seed Error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
