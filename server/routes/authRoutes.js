import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

/* =========================================================
   ✅ Register new user (with Aadhaar & Contact)
========================================================= */
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, role, aadharNumber, contactNumber } = req.body;

    // Field validation
    if (!name || !email || !password || !aadharNumber || !contactNumber) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    // Aadhaar and contact validation
    if (!/^\d{12}$/.test(aadharNumber)) {
      return res
        .status(400)
        .json({ success: false, message: "Aadhaar number must be exactly 12 digits" });
    }

    if (!/^[6-9]\d{9}$/.test(contactNumber)) {
      return res
        .status(400)
        .json({ success: false, message: "Enter a valid 10-digit contact number" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, message: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || "user",
      aadharNumber,
      contactNumber,
    });

    res.status(201).json({
      success: true,
      message: "✅ User registered successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        aadharNumber: user.aadharNumber,
        contactNumber: user.contactNumber,
      },
    });
  } catch (error) {
    console.error("❌ Registration Error:", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

/* =========================================================
   ✅ Login user or admin
========================================================= */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(200).json({
      success: true,
      message: "✅ Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        aadharNumber: user.aadharNumber,
        contactNumber: user.contactNumber,
      },
    });
  } catch (error) {
    console.error("❌ Login Error:", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

/* =========================================================
   ✅ Get logged-in user profile
========================================================= */
router.get("/profile", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });

    res.status(200).json({ success: true, user });
  } catch (error) {
    console.error("❌ Profile Error:", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

/* =========================================================
   ⚙️ Seed Admin User (run once)
========================================================= */
router.post("/seed-admin", async (req, res) => {
  try {
    const adminExists = await User.findOne({ email: "admin@rentxpress.com" });

    if (adminExists) {
      return res
        .status(400)
        .json({ success: false, message: "Admin already exists" });
    }

    const hashedPassword = await bcrypt.hash("Admin@123", 10);

    const admin = await User.create({
      name: "Super Admin",
      email: "admin@rentxpress.com",
      password: hashedPassword,
      role: "admin",
      aadharNumber: "000000000000",
      contactNumber: "9999999999",
    });

    res.status(201).json({
      success: true,
      message: "✅ Admin created successfully",
      credentials: {
        email: admin.email,
        password: "Admin@123",
      },
    });
  } catch (error) {
    console.error("❌ Admin Seed Error:", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

export default router;
