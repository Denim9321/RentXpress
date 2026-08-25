import React, { useEffect, useState } from "react";
import axios from "axios";

export default function Bookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  // ✅ Axios instance with auth token
  const api = axios.create({
    baseURL: "http://localhost:5000/api",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  // ✅ Handle expired or invalid session
  const handleAuthError = (error) => {
    const msg = error?.response?.data?.message || "";
    if (
      error?.response?.status === 401 ||
      error?.response?.status === 403 ||
      msg.toLowerCase().includes("expired") ||
      msg.toLowerCase().includes("unauthorized")
    ) {
      alert("Session expired. Please log in again.");
      localStorage.clear();
      window.location.href = "/login";
      return true;
    }
    return false;
  };

  // ✅ Fetch all user bookings
  const fetchBookings = async () => {
    try {
      setLoading(true);
      const res = await api.get("/bookings");
      if (res.data.success) {
        setBookings(res.data.bookings);
      } else {
        alert("Failed to fetch bookings.");
      }
    } catch (error) {
      if (!handleAuthError(error)) {
        console.error("❌ Booking Fetch Error:", error);
        alert("Failed to fetch bookings. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  // ✅ Cancel booking (using PUT /cancel/:id)
  const cancelBooking = async (id) => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) return;

    try {
      const res = await api.put(`/bookings/cancel/${id}`);
      if (res.data.success) {
        alert("❌ Booking cancelled successfully!");
        setBookings((prev) =>
          prev.map((b) =>
            b._id === id ? { ...b, status: "cancelled" } : b
          )
        );
      } else {
        alert(res.data.message || "Failed to cancel booking.");
      }
    } catch (error) {
      console.error("❌ Cancel Booking Error:", error);
      if (!handleAuthError(error)) {
        alert("Error cancelling booking. Please try again later.");
      }
    }
  };

  useEffect(() => {
    if (token) fetchBookings();
  }, []);

  // ✅ UI
  return (
    <div style={{ padding: "30px", textAlign: "center" }}>
      <h1 style={{ color: "#1E40AF", fontWeight: "bold", marginBottom: "15px" }}>
        📅 Your Bookings
      </h1>

      {loading ? (
        <p style={{ color: "#1E40AF" }}>Loading your bookings...</p>
      ) : bookings.length === 0 ? (
        <p style={{ color: "gray" }}>⚠️ No bookings found.</p>
      ) : (
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: "20px",
          }}
        >
          {bookings.map((b) => (
            <div
              key={b._id}
              style={{
                border: "1px solid #ddd",
                borderRadius: "12px",
                padding: "16px",
                width: "300px",
                background: "#fff",
                boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
              }}
            >
              {b.item?.imageUrl && (
                <img
                  src={b.item.imageUrl}
                  alt={b.item.name}
                  style={{
                    width: "100%",
                    height: "180px",
                    borderRadius: "10px",
                    objectFit: "cover",
                    marginBottom: "10px",
                  }}
                />
              )}

              <h3 style={{ color: "#1E40AF" }}>{b.item?.name}</h3>
              <p>📍 {b.item?.location}</p>
              <p>💸 ₹{b.totalPrice}</p>
              <p>
                🗓 <b>{new Date(b.startDate).toLocaleDateString()}</b> →{" "}
                <b>{new Date(b.endDate).toLocaleDateString()}</b>
              </p>

              <p
                style={{
                  color:
                    b.status === "confirmed"
                      ? "green"
                      : b.status === "cancelled"
                      ? "red"
                      : "orange",
                  fontWeight: "bold",
                  textTransform: "capitalize",
                }}
              >
                {b.status}
              </p>

              {b.status === "confirmed" && (
                <button
                  onClick={() => cancelBooking(b._id)}
                  style={{
                    width: "100%",
                    background: "#ef4444",
                    color: "white",
                    padding: "8px",
                    border: "none",
                    borderRadius: "8px",
                    cursor: "pointer",
                    marginTop: "8px",
                  }}
                >
                  Cancel
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
