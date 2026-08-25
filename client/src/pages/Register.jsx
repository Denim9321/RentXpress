import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    aadharNumber: "",
    contactNumber: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (
      !form.name ||
      !form.email ||
      !form.password ||
      !form.aadharNumber ||
      !form.contactNumber
    ) {
      alert("Please fill all fields!");
      return;
    }

    if (!/^\d{12}$/.test(form.aadharNumber)) {
      alert("Aadhaar number must be exactly 12 digits.");
      return;
    }

    if (!/^[6-9]\d{9}$/.test(form.contactNumber)) {
      alert("Enter a valid 10-digit contact number.");
      return;
    }

    try {
      await axios.post("http://localhost:5000/api/auth/register", form);
      alert("✅ Registration successful! Please log in.");
      navigate("/login");
    } catch (err) {
      alert(err.response?.data?.message || "Registration failed ❌");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleRegister}
        className="bg-white shadow-lg rounded-lg p-8 w-96"
      >
        <h2 className="text-2xl font-bold text-center mb-6 text-blue-600">
          Create Your Account
        </h2>

        <input
          type="text"
          name="name"
          placeholder="Full Name"
          className="border p-2 w-full mb-4 rounded"
          onChange={handleChange}
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Email Address"
          className="border p-2 w-full mb-4 rounded"
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          className="border p-2 w-full mb-4 rounded"
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="aadharNumber"
          placeholder="Aadhaar Number (12 digits)"
          maxLength="12"
          className="border p-2 w-full mb-4 rounded"
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="contactNumber"
          placeholder="Contact Number (10 digits)"
          maxLength="10"
          className="border p-2 w-full mb-4 rounded"
          onChange={handleChange}
          required
        />

        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-600 text-white py-2 w-full rounded"
        >
          Register
        </button>

        <p className="mt-4 text-center text-sm">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600 hover:underline">
            Login here
          </Link>
        </p>
      </form>
    </div>
  );
}
