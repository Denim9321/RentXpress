import Item from "../models/itemModel.js";
import cloudinary from "../config/cloudinary.js";

// POST /api/items
export const createItem = async (req, res) => {
  try {
    // Only authenticated users (protect middleware) reach here
    const ownerId = req.user?._id;
    if (!ownerId) return res.status(401).json({ success: false, message: "Not authenticated" });

    const { name, category, price, location, description, ownerName, ownerContact } = req.body;

    // Basic validation
    if (!name || !category || !price || !location || !description) {
      return res.status(400).json({ success: false, message: "Missing fields" });
    }

    let imageUrl = "";
    if (req.file && req.file.buffer) {
      // Upload buffer to Cloudinary
      const uploadResult = await cloudinary.uploader.upload_stream_async
        ? await uploadBuffer(req.file.buffer)
        : await uploadBuffer(req.file.buffer);

      imageUrl = uploadResult.secure_url || uploadResult.url || "";
    }

    const newItem = new Item({
      name,
      category,
      price,
      location,
      description,
      owner: ownerId,
      ownerName: ownerName || req.user.name,
      ownerContact: ownerContact || "",
      imageUrl,
    });

    await newItem.save();

    return res.status(201).json({ success: true, message: "Item added", item: newItem });
  } catch (err) {
    console.error("Add Item Error:", err?.message || err);
    return res.status(500).json({ success: false, message: "Failed to add item", error: err.message });
  }
};

// helpers
function uploadBuffer(buffer) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "rentxpress_items" },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    stream.end(buffer);
  });
}
