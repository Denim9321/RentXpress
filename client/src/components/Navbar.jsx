import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  // ✅ Detect logged-in user from localStorage (if JWT stored)
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsed = JSON.parse(storedUser);
      setUserRole(parsed.role || "user");
    } else {
      setUserRole(null);
    }
  }, [location]); // refresh navbar role when route changes

  // ✅ Logout function
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUserRole(null);
    navigate("/login");
  };

  // ✅ Helper function to highlight active links
  const isActive = (path) =>
    location.pathname === path ? "text-yellow-300 font-semibold" : "hover:text-yellow-300";

  return (
    <nav className="bg-blue-700 text-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center p-4">
        {/* ✅ Logo */}
        <Link to="/" className="text-2xl font-bold tracking-wide">
          RentXpress
        </Link>

        {/* ✅ Desktop Links */}
        <div className="hidden md:flex space-x-6">
          <Link to="/" className={isActive("/")}>
            Home
          </Link>
          <Link to="/equipment" className={isActive("/equipment")}>
            Equipment
          </Link>
          <Link to="/vehicles" className={isActive("/vehicles")}>
            Vehicles
          </Link>
          <Link to="/rooms" className={isActive("/rooms")}>
            Rooms
          </Link>
          <Link to="/bookings" className={isActive("/bookings")}>
            Bookings
          </Link>

          {/* ✅ Owner Add Item */}
          <Link to="/itemmanager" className="hover:text-green-300 font-medium text-green-300">
            + Add Item
          </Link>

          {/* ✅ Show Admin Dashboard only if role = admin */}
          {userRole === "admin" && (
            <Link to="/admin" className="hover:text-red-300 font-medium text-red-300">
              Admin
            </Link>
          )}
        </div>

        {/* ✅ Auth Buttons / Logout */}
        <div className="hidden md:flex space-x-4">
          {userRole ? (
            <>
              <span className="text-sm opacity-80 self-center">
                👋 {userRole === "admin" ? "Admin" : "User"}
              </span>
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-4 py-1 rounded-lg font-medium hover:bg-red-600"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="bg-white text-blue-700 px-4 py-1 rounded-lg font-medium hover:bg-gray-200"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="bg-yellow-400 text-blue-800 px-4 py-1 rounded-lg font-medium hover:bg-yellow-300"
              >
                Register
              </Link>
            </>
          )}
        </div>

        {/* ✅ Mobile Menu Button */}
        <button
          className="md:hidden flex flex-col space-y-1 focus:outline-none"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span className="block w-6 h-0.5 bg-white"></span>
          <span className="block w-6 h-0.5 bg-white"></span>
          <span className="block w-6 h-0.5 bg-white"></span>
        </button>
      </div>

      {/* ✅ Mobile Dropdown Menu */}
      {menuOpen && (
        <div className="md:hidden bg-blue-600 text-white px-6 py-4 space-y-4">
          <Link to="/" onClick={() => setMenuOpen(false)} className={isActive("/")}>
            Home
          </Link>
          <Link to="/equipment" onClick={() => setMenuOpen(false)} className={isActive("/equipment")}>
            Equipment
          </Link>
          <Link to="/vehicles" onClick={() => setMenuOpen(false)} className={isActive("/vehicles")}>
            Vehicles
          </Link>
          <Link to="/rooms" onClick={() => setMenuOpen(false)} className={isActive("/rooms")}>
            Rooms
          </Link>
          <Link to="/bookings" onClick={() => setMenuOpen(false)} className={isActive("/bookings")}>
            Bookings
          </Link>
          <Link to="/itemmanager" onClick={() => setMenuOpen(false)} className="block hover:text-green-300">
            + Add Item
          </Link>

          {/* ✅ Admin Link (Visible only for admin) */}
          {userRole === "admin" && (
            <Link
              to="/admin"
              onClick={() => setMenuOpen(false)}
              className="block hover:text-red-300"
            >
              Admin Dashboard
            </Link>
          )}

          {/* ✅ Mobile Auth / Logout Buttons */}
          <div className="flex flex-col space-y-2 pt-2 border-t border-blue-500">
            {userRole ? (
              <button
                onClick={() => {
                  handleLogout();
                  setMenuOpen(false);
                }}
                className="bg-red-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-600"
              >
                Logout
              </button>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setMenuOpen(false)}
                  className="bg-white text-blue-700 px-4 py-2 rounded-lg font-medium text-center hover:bg-gray-200"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMenuOpen(false)}
                  className="bg-yellow-400 text-blue-800 px-4 py-2 rounded-lg font-medium text-center hover:bg-yellow-300"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
