import React, { useState } from "react";
import axios from "axios";

export default function BookSection({ itemId, itemName, price }) {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const token = localStorage.getItem("token");

  const handleBooking = async () => {
    if (!token) {
      alert("Please log in to book this item.");
      window.location.href = "/login";
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

    const days = Math.max(1, (end - start) / (1000 * 60 * 60 * 24));
    const totalPrice = days * price;

    try {
      const res = await axios.post(
        "http://localhost:5000/api/bookings",
        { itemId, startDate, endDate, totalPrice },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.data.success) {
        alert("✅ Booking successful! Check 'My Bookings' for details.");
        setStartDate("");
        setEndDate("");
      } else {
        alert("Booking failed. Please try again.");
      }
    } catch (error) {
      console.error("❌ Booking Error:", error.response?.data || error.message);

      if (error.response?.status === 401 || error.response?.status === 403) {
        alert("Session expired. Please log in again.");
        localStorage.clear();
        window.location.href = "/login";
      } else {
        alert("Failed to book item. Try again later.");
      }
    }
  };

  return (
    <div style={{ marginTop: "10px", padding: "10px" }}>
      <h4 style={{ color: "#1E40AF" }}>Book {itemName}</h4>
      <div>
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          style={{ marginRight: "10px" }}
        />
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          style={{ marginRight: "10px" }}
        />
        <button
          onClick={handleBooking}
          style={{
            background: "#22C55E",
            color: "#fff",
            border: "none",
            padding: "6px 12px",
            borderRadius: "6px",
            cursor: "pointer",
          }}
        >
          Book Now
        </button>
      </div>
    </div>
  );
}
