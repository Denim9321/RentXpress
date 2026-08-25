import React, { useEffect, useState } from "react";
import axios from "axios";

export default function BookingsDashboard() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/bookings");
        setBookings(res.data);
      } catch (err) {
        console.error("❌ Error fetching bookings:", err);
        setError("Failed to fetch bookings from server.");
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  if (loading)
    return (
      <div className="text-center p-10 text-gray-500 text-lg">
        ⏳ Loading bookings...
      </div>
    );

  if (error)
    return (
      <div className="text-center p-10 text-red-500 text-lg">
        ⚠️ {error}
      </div>
    );

  if (bookings.length === 0)
    return (
      <div className="text-center p-10 text-gray-500 text-lg">
        No bookings found.
      </div>
    );

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-blue-700 text-center mb-6">
        📋 All Bookings
      </h1>

      <table className="min-w-full border border-gray-300 shadow-lg bg-white">
        <thead className="bg-blue-600 text-white">
          <tr>
            <th className="p-3 text-left">Item Name</th>
            <th className="p-3 text-left">User Email</th>
            <th className="p-3 text-left">Start Date</th>
            <th className="p-3 text-left">End Date</th>
            <th className="p-3 text-left">Total Price</th>
            <th className="p-3 text-left">Status</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((booking) => (
            <tr key={booking._id} className="border-b hover:bg-gray-50">
              <td className="p-3">{booking.item?.name || "Unknown"}</td>
              <td className="p-3">{booking.user?.email || "Guest"}</td>
              <td className="p-3">
                {new Date(booking.startDate).toLocaleDateString()}
              </td>
              <td className="p-3">
                {new Date(booking.endDate).toLocaleDateString()}
              </td>
              <td className="p-3 text-green-600 font-semibold">
                ₹{booking.totalPrice}
              </td>
              <td className="p-3 text-blue-700 font-medium">
                {booking.status || "Confirmed"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
