import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {
  const [items, setItems] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [stats, setStats] = useState({ users: 0, items: 0, bookings: 0 });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  // ✅ Redirect if not admin
  useEffect(() => {
    if (!token || role !== "admin") {
      alert("🚫 Access denied! Admins only.");
      navigate("/");
    }
  }, [token, role, navigate]);

  // ✅ Fetch admin data
  const fetchAdminData = async () => {
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const [itemsRes, bookingsRes, statsRes] = await Promise.all([
        axios.get("http://localhost:5000/api/admin/items", { headers }),
        axios.get("http://localhost:5000/api/admin/bookings", { headers }),
        axios.get("http://localhost:5000/api/admin/stats", { headers }),
      ]);

      setItems(itemsRes.data.items || []);
      setBookings(bookingsRes.data.bookings || []);
      setStats(statsRes.data.stats || {});
    } catch (err) {
      console.error("❌ Failed to fetch admin data:", err);
      alert("Failed to load admin dashboard. Please ensure you're logged in as admin.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token && role === "admin") fetchAdminData();
  }, [token, role]);

  // ✅ Delete item
  const handleDeleteItem = async (id) => {
    if (!window.confirm("🗑️ Are you sure you want to delete this item?")) return;
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const res = await axios.delete(`http://localhost:5000/api/admin/items/${id}`, { headers });

      if (res.data.success) {
        setItems((prev) => prev.filter((item) => item._id !== id));
        alert("✅ Item deleted successfully!");
      }
    } catch (err) {
      console.error("Delete item error:", err);
      alert("Server error while deleting item.");
    }
  };

  // ✅ Delete booking (Admin)
  const handleDeleteBooking = async (id) => {
    if (!window.confirm("🗑️ Delete this booking permanently?")) return;
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const res = await axios.delete(`http://localhost:5000/api/bookings/${id}`, { headers });

      if (res.data.success) {
        setBookings((prev) => prev.filter((b) => b._id !== id));
        alert("✅ Booking deleted successfully!");
      }
    } catch (err) {
      console.error("Delete booking error:", err);
      alert("Failed to delete booking.");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-blue-600 text-xl">
        ⏳ Loading Admin Dashboard...
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-center text-blue-700 mb-8">
        🧑‍💼 RentXpress Admin Dashboard
      </h1>

      {/* ✅ Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white shadow-md rounded-lg p-6 text-center border-l-4 border-blue-600">
          <h2 className="text-3xl font-bold text-blue-600">{stats.items}</h2>
          <p className="text-gray-500">Total Items</p>
        </div>
        <div className="bg-white shadow-md rounded-lg p-6 text-center border-l-4 border-green-600">
          <h2 className="text-3xl font-bold text-green-600">{stats.bookings}</h2>
          <p className="text-gray-500">Total Bookings</p>
        </div>
        <div className="bg-white shadow-md rounded-lg p-6 text-center border-l-4 border-yellow-500">
          <h2 className="text-3xl font-bold text-yellow-600">{stats.users}</h2>
          <p className="text-gray-500">Total Users</p>
        </div>
      </div>

      {/* ✅ Items Table */}
      <section className="bg-white shadow-md rounded-lg p-6 mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-blue-600">📦 All Listed Items</h2>
          <span className="text-sm text-gray-500">Manage all rentals in the system.</span>
        </div>

        {items.length === 0 ? (
          <p className="text-center text-gray-500">No items found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-blue-100 text-blue-700">
                  <th className="p-3 border">Item Name</th>
                  <th className="p-3 border">Category</th>
                  <th className="p-3 border">Price (₹)</th>
                  <th className="p-3 border">Owner</th>
                  <th className="p-3 border">Owner Contact</th> {/* ✅ New */}
                  <th className="p-3 border">Action</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item._id} className="hover:bg-gray-50">
                    <td className="p-3 border">{item.name}</td>
                    <td className="p-3 border capitalize">{item.category}</td>
                    <td className="p-3 border">₹{item.price}</td>
                    <td className="p-3 border">{item.owner?.name || "N/A"}</td>
                    <td className="p-3 border">{item.ownerContact || "N/A"}</td>
                    <td className="p-3 border text-center">
                      <button
                        onClick={() => handleDeleteItem(item._id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* ✅ Bookings Table */}
      <section className="bg-white shadow-md rounded-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-green-600">🧾 All User Bookings</h2>
          <span className="text-sm text-gray-500">Track all current bookings.</span>
        </div>

        {bookings.length === 0 ? (
          <p className="text-center text-gray-500">No bookings found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-green-100 text-green-700">
                  <th className="p-3 border">Item</th>
                  <th className="p-3 border">User</th>
                  <th className="p-3 border">From</th>
                  <th className="p-3 border">To</th>
                  <th className="p-3 border">Total Price (₹)</th>
                  <th className="p-3 border text-center">Action</th> {/* ✅ New */}
                </tr>
              </thead>
              <tbody>
                {bookings.map((b) => (
                  <tr key={b._id} className="hover:bg-gray-50">
                    <td className="p-3 border">{b.item?.name || "—"}</td>
                    <td className="p-3 border">{b.user?.name || "Guest"}</td>
                    <td className="p-3 border">{new Date(b.startDate).toLocaleDateString()}</td>
                    <td className="p-3 border">{new Date(b.endDate).toLocaleDateString()}</td>
                    <td className="p-3 border font-semibold text-green-700">₹{b.totalPrice}</td>
                    <td className="p-3 border text-center">
                      <button
                        onClick={() => handleDeleteBooking(b._id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
