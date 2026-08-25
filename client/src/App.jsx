import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// ✅ Components
import Navbar from "./components/Navbar";

// ✅ Pages
import Home from "./pages/Home";
import Equipment from "./pages/Equipment";
import Vehicles from "./pages/Vehicles";
import Rooms from "./pages/Rooms";
import ItemManager from "./pages/ItemManager";     // Owner Add Item Page
import Bookings from "./pages/Bookings";           // User Booking Dashboard
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminDashboard from "./pages/AdminDashboard"; // Admin Panel
import Reviews from "./pages/Reviews";               // ⭐ Reviews Page
import BookNow from "./pages/BookNow";               // 🆕 Book Now Page

function App() {
  return (
    <Router>
      {/* ✅ Navbar visible on all pages */}
      <Navbar />

      {/* ✅ App Layout */}
      <div className="bg-gray-50 min-h-screen">
        <Routes>
          {/* 🏠 Home Page */}
          <Route path="/" element={<Home />} />

          {/* 🧰 Category Pages */}
          <Route path="/equipment" element={<Equipment />} />
          <Route path="/vehicles" element={<Vehicles />} />
          <Route path="/rooms" element={<Rooms />} />

          {/* 🆕 Full Booking Page */}
          <Route path="/booknow/:itemId" element={<BookNow />} />

          {/* 📅 User Bookings */}
          <Route path="/bookings" element={<Bookings />} />

          {/* 💼 Owner Item Manager */}
          <Route path="/itemmanager" element={<ItemManager />} />

          {/* 🧑‍💼 Admin Panel */}
          <Route path="/admin" element={<AdminDashboard />} />

          {/* ⭐ Reviews Page */}
          <Route path="/reviews/:id" element={<Reviews />} />

          {/* 🔐 Auth Pages */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* 🚧 404 Page */}
          <Route
            path="*"
            element={
              <div className="flex items-center justify-center h-screen text-gray-600 text-xl">
                404 - Page Not Found 🚧
              </div>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
