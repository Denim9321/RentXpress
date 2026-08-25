import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import { connectDB } from "./config/db.js";
import User from "./models/userModel.js";

dotenv.config();

const seedAdmin = async () => {
  try {
    await connectDB();

    const existing = await User.findOne({ email: "admin@rentxpress.com" });
    if (existing) {
      console.log("⚠️ Admin already exists. Updating password...");
      existing.password = await bcrypt.hash("admin123", 10);
      existing.role = "admin";
      await existing.save();
      console.log("✅ Admin password reset successfully.");
    } else {
      const hashedPassword = await bcrypt.hash("admin123", 10);
      await User.create({
        name: "Waman Admin",
        email: "admin@rentxpress.com",
        password: hashedPassword,
        role: "admin",
      });
      console.log("✅ Admin created successfully!");
    }

    mongoose.connection.close();
  } catch (err) {
    console.error("❌ Error seeding admin:", err);
    process.exit(1);
  }
};

seedAdmin();
