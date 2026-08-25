import React from "react";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div
      style={{
        fontFamily: "Poppins, sans-serif",
        backgroundColor: "#f9fafb",
        minHeight: "100vh",
        padding: "40px 20px",
      }}
    >
      {/* Hero Section */}
      <section
        style={{
          textAlign: "center",
          marginBottom: "50px",
          color: "#1E3A8A",
        }}
      >
        <h1 style={{ fontSize: "3rem", fontWeight: "bold" }}>
          🚀 Welcome to RentXpress
        </h1>
        <p style={{ color: "#374151", fontSize: "1.2rem", marginTop: "10px" }}>
          Your one-stop platform to rent <b>Equipment</b>, <b>Vehicles</b>, and <b>Rooms</b> easily and securely.
        </p>
      </section>

      {/* Category Cards */}
      <section
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "25px",
          justifyContent: "center",
          alignItems: "center",
          padding: "0 20px",
        }}
      >
        {/* Equipment Card */}
        <div
          style={{
            backgroundColor: "white",
            borderRadius: "12px",
            boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
            textAlign: "center",
            padding: "25px",
            transition: "0.3s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.03)")}
          onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1.0)")}
        >
          <img
            src="https://cdn-icons-png.flaticon.com/512/2830/2830318.png"
            alt="Equipment"
            style={{ width: "100px", marginBottom: "15px" }}
          />
          <h3 style={{ fontSize: "1.5rem", color: "#1E3A8A" }}>Equipment</h3>
          <p style={{ color: "#4B5563" }}>
            Rent professional tools and gear for all your projects.
          </p>
          <Link
            to="/equipment"
            style={{
              display: "inline-block",
              marginTop: "10px",
              backgroundColor: "#2563EB",
              color: "white",
              padding: "10px 20px",
              borderRadius: "8px",
              textDecoration: "none",
            }}
          >
            Explore Equipment
          </Link>
        </div>

        {/* Vehicles Card */}
        <div
          style={{
            backgroundColor: "white",
            borderRadius: "12px",
            boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
            textAlign: "center",
            padding: "25px",
            transition: "0.3s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.03)")}
          onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1.0)")}
        >
          <img
            src="https://cdn-icons-png.flaticon.com/512/3202/3202926.png"
            alt="Vehicles"
            style={{ width: "100px", marginBottom: "15px" }}
          />
          <h3 style={{ fontSize: "1.5rem", color: "#1E3A8A" }}>Vehicles</h3>
          <p style={{ color: "#4B5563" }}>
            Choose from cars, bikes, and more for your journey.
          </p>
          <Link
            to="/vehicles"
            style={{
              display: "inline-block",
              marginTop: "10px",
              backgroundColor: "#2563EB",
              color: "white",
              padding: "10px 20px",
              borderRadius: "8px",
              textDecoration: "none",
            }}
          >
            View Vehicles
          </Link>
        </div>

        {/* Rooms Card */}
        <div
          style={{
            backgroundColor: "white",
            borderRadius: "12px",
            boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
            textAlign: "center",
            padding: "25px",
            transition: "0.3s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.03)")}
          onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1.0)")}
        >
          <img
            src="https://cdn-icons-png.flaticon.com/512/1688/1688988.png"
            alt="Rooms"
            style={{ width: "100px", marginBottom: "15px" }}
          />
          <h3 style={{ fontSize: "1.5rem", color: "#1E3A8A" }}>Rooms & Hotels</h3>
          <p style={{ color: "#4B5563" }}>
            Find affordable rooms and hotels for your stay.
          </p>
          <Link
            to="/rooms"
            style={{
              display: "inline-block",
              marginTop: "10px",
              backgroundColor: "#2563EB",
              color: "white",
              padding: "10px 20px",
              borderRadius: "8px",
              textDecoration: "none",
            }}
          >
            Browse Rooms
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer
        style={{
          marginTop: "60px",
          textAlign: "center",
          color: "#6B7280",
          borderTop: "1px solid #E5E7EB",
          paddingTop: "15px",
        }}
      >
        © {new Date().getFullYear()} RentXpress | Designed by Waman Patil 💻
      </footer>
    </div>
  );
}
