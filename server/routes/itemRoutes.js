import express from "express";
import multer from "multer";
import cloudinary from "cloudinary";
import { protect } from "../middleware/authMiddleware.js";
import Item from "../models/itemModel.js";
import dotenv from "dotenv";

dotenv.config();
const router = express.Router();

// ✅ Cloudinary config
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ✅ Multer setup for file upload
const storage = multer.memoryStorage();
const upload = multer({ storage });

// =======================================================
// ✅ Add New Item
// =======================================================
router.post("/", protect, upload.single("image"), async (req, res) => {
  try {
    const { name, category, price, location, description, ownerName, ownerContact } = req.body;

    if (!name || !category || !price || !location || !description || !req.file) {
      return res.status(400).json({
        success: false,
        message: "Please fill all required fields.",
      });
    }

    // Upload image to Cloudinary
    const result = await cloudinary.v2.uploader.upload_stream(
      { folder: "RentXpress_Items" },
      async (error, uploadResult) => {
        if (error) {
          console.error("❌ Cloudinary Upload Error:", error);
          return res.status(500).json({
            success: false,
            message: "Image upload failed.",
          });
        }

        // Save item to DB
        const newItem = await Item.create({
          name,
          category,
          price,
          location,
          description,
          owner: req.user._id,
          ownerName,
          ownerContact,
          imageUrl: uploadResult.secure_url,
        });

        res.status(201).json({
          success: true,
          message: "✅ Item added successfully",
          item: newItem,
        });
      }
    );

    result.end(req.file.buffer);
  } catch (error) {
    console.error("❌ Add Item Error:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error while adding item",
    });
  }
});

// =======================================================
// ✅ Get All Items (with optional category filtering)
// =======================================================
router.get("/", async (req, res) => {
  try {
    const { category } = req.query;
    const filter = category ? { category } : {};
    const items = await Item.find(filter).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      items,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error fetching items",
    });
  }
});

export default router;
