import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

export default function BookNow() {
  const { itemId } = useParams();
  const navigate = useNavigate();

  const [item, setItem] = useState(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [totalPrice, setTotalPrice] = useState(0);

  const token = localStorage.getItem("token");

  // ✅ Fetch item details for booking preview
  const fetchItem = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/items/${itemId}`);
      if (res.data.success) {
        setItem(res.data.item);
      }
    } catch (error) {
      console.error("❌ Error fetching item details:", error);
      alert("Failed to load item details. Please try again later.");
      navigate("/");
    }
  };

  // ✅ Calculate total price dynamically
  useEffect(() => {
    if (startDate && endDate && item?.price) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const days = Math.max(1, (end - start) / (1000 * 60 * 60 * 24));
      if (days > 0) setTotalPrice(days * item.price);
    }
  }, [startDate, endDate, item]);

  // ✅ Handle booking
  const handleBooking = async () => {
    if (!token) {
      alert("Please log in to book this item.");
      navigate("/login");
      return;
    }

    if (!startDate || !endDate) {
      alert("Please select both start and end dates.");
      return;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (end <= start) {
      alert("End date must be after start date.");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(
        "http://localhost:5000/api/bookings",
        {
          itemId,
          startDate,
          endDate,
          totalPrice,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.data.success) {
        alert("✅ Booking successful!");
        navigate("/bookings");
      } else {
        alert(res.data.message || "Booking failed.");
      }
    } catch (error) {
      console.error("❌ Booking Error:", error);
      if (error.response?.status === 401 || error.response?.status === 403) {
        alert("Session expired. Please log in again.");
        localStorage.clear();
        navigate("/login");
      } else {
        alert("Booking failed. Try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItem();
  }, []);

  if (!item)
    return (
      <div className="flex justify-center items-center h-screen text-gray-600 text-lg">
        Loading item details...
      </div>
    );

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-6">
      <div className="bg-white shadow-lg rounded-xl p-6 w-full max-w-md">
        <img
          src={item.imageUrl}
          alt={item.name}
          className="rounded-lg w-full h-56 object-cover mb-4"
        />
        <h2 className="text-2xl font-bold text-blue-700 mb-2">{item.name}</h2>
        <p className="text-gray-600 mb-1">📍 {item.location}</p>
        <p className="text-gray-800 font-semibold mb-4">
          💰 ₹{item.price} / day
        </p>

        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-1">
            Start Date:
          </label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="border rounded-md px-3 py-2 w-full"
          />

          <label className="block text-gray-700 font-medium mt-3 mb-1">
            End Date:
          </label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="border rounded-md px-3 py-2 w-full"
          />
        </div>

        {totalPrice > 0 && (
          <p className="text-green-600 font-semibold text-center mb-3">
            Total Price: ₹{totalPrice}
          </p>
        )}

        <button
          onClick={handleBooking}
          disabled={loading}
          className={`w-full py-2 rounded-md text-white font-semibold ${
            loading ? "bg-gray-400" : "bg-green-600 hover:bg-green-700"
          }`}
        >
          {loading ? "Booking..." : "Confirm Booking"}
        </button>
      </div>
    </div>
  );
}
