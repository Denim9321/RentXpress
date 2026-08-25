import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css"; // ✅ Tailwind/CSS import (keep if using Tailwind)

// ✅ Debug: Log Vite environment variable during build
console.log("✅ Build-time VITE_API_BASE_URL =", import.meta.env.VITE_API_BASE_URL);

// ✅ Error Logging (for runtime errors)
window.addEventListener("error", (e) => {
  console.error("❌ Window Error:", e.message);
});
window.addEventListener("unhandledrejection", (e) => {
  console.error("❌ Promise Rejection:", e.reason);
});

// ✅ Root Element Check
const root = document.getElementById("root");

if (!root) {
  console.error("❌ Root element not found in index.html!");
} else {
  console.log("✅ Root element found, rendering App...");
  ReactDOM.createRoot(root).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}
