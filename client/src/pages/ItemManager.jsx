import React, { useState } from "react";
import axios from "axios";

export default function ItemManager() {
  const [item, setItem] = useState({
    name: "",
    category: "Equipment",
    price: "",
    location: "",
    description: "",
    ownerName: "",
    ownerContact: "",
  });
  const [image, setImage] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  const handleChange = (e) => {
    setItem({ ...item, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    if (
      !item.name ||
      !item.category ||
      !item.price ||
      !item.location ||
      !item.description ||
      !image
    ) {
      setMessage("❌ Please fill all fields and upload an image.");
      setLoading(false);
      return;
    }

    try {
      const formData = new FormData();
      Object.entries(item).forEach(([key, value]) =>
        formData.append(key, value)
      );
      formData.append("image", image);

      const res = await axios.post(
        "http://localhost:5000/api/items",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (res.data.success) {
        setMessage("✅ Item added successfully!");
        setItem({
          name: "",
          category: "Equipment",
          price: "",
          location: "",
          description: "",
          ownerName: "",
          ownerContact: "",
        });
        setImage(null);
      } else {
        setMessage("❌ Failed to add item. Try again.");
      }
    } catch (error) {
      console.error("❌ Add Item Error:", error);
      setMessage("❌ Failed to add item. Please check all fields and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center py-10">
      <h2 className="text-2xl font-bold text-blue-800 mb-4">
        🧾 RentXpress Item Manager
      </h2>

      {message && (
        <div
          className={`text-sm font-semibold mb-4 ${
            message.startsWith("✅") ? "text-green-600" : "text-red-600"
          }`}
        >
          {message}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded-xl p-8 w-full max-w-xl border border-gray-200"
      >
        <div className="mb-4">
          <label className="block font-semibold mb-1">Item Name *</label>
          <input
            type="text"
            name="name"
            value={item.name}
            onChange={handleChange}
            className="w-full border rounded-md px-3 py-2 focus:outline-blue-500"
            placeholder="e.g., Canon Camera"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block font-semibold mb-1">Category *</label>
            <select
              name="category"
              value={item.category}
              onChange={handleChange}
              className="w-full border rounded-md px-3 py-2 focus:outline-blue-500"
            >
              <option>Equipment</option>
              <option>Vehicle</option>
              <option>Room</option>
            </select>
          </div>
          <div>
            <label className="block font-semibold mb-1">
              Price (₹ / day) *
            </label>
            <input
              type="number"
              name="price"
              value={item.price}
              onChange={handleChange}
              className="w-full border rounded-md px-3 py-2 focus:outline-blue-500"
              placeholder="e.g., 1500"
            />
          </div>
        </div>

        <div className="mt-4">
          <label className="block font-semibold mb-1">Location *</label>
          <input
            type="text"
            name="location"
            value={item.location}
            onChange={handleChange}
            className="w-full border rounded-md px-3 py-2 focus:outline-blue-500"
            placeholder="e.g., Mumbai"
          />
        </div>

        <div className="mt-4">
          <label className="block font-semibold mb-1">Description *</label>
          <textarea
            name="description"
            value={item.description}
            onChange={handleChange}
            className="w-full border rounded-md px-3 py-2 focus:outline-blue-500"
            rows="3"
            placeholder="Enter item details"
          ></textarea>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-4">
          <div>
            <label className="block font-semibold mb-1">Owner Name</label>
            <input
              type="text"
              name="ownerName"
              value={item.ownerName}
              onChange={handleChange}
              className="w-full border rounded-md px-3 py-2 focus:outline-blue-500"
              placeholder="Owner full name"
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">Owner Contact</label>
            <input
              type="text"
              name="ownerContact"
              value={item.ownerContact}
              onChange={handleChange}
              className="w-full border rounded-md px-3 py-2 focus:outline-blue-500"
              placeholder="Contact number"
            />
          </div>
        </div>

        <div className="mt-4">
          <label className="block font-semibold mb-1">Upload Image *</label>
          <input
            type="file"
            onChange={handleImageChange}
            className="w-full border rounded-md px-3 py-2"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mt-6 w-full bg-blue-600 text-white font-semibold py-2 rounded-md hover:bg-blue-700 transition-all duration-200"
        >
          {loading ? "Uploading..." : "+ Add Item"}
        </button>
      </form>
    </div>
  );
}
