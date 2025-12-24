import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/api";

export default function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    dept: "",
    year: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      return setError("Name is required.");
    }

    if (!formData.dept.trim()) {
      return setError("Department is required.");
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
      return setError("Please enter a valid email address.");
    }

    if (formData.password.length < 8) {
      return setError("Password must be at least 8 characters long.");
    }

    setError("");
    setLoading(true);

    try {
      await api.post("/auth/register", {
        name: formData.name,
        dept: formData.dept,
        year: formData.year,
        email: formData.email,
        password: formData.password,
      });

      alert("Registration successful! Please login.");
      navigate("/");
    } catch (err) {
      setError(
        err.response?.data?.error ||
          err.response?.data?.message ||
          "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        
        {/* HERO SECTION */}
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-wide">
            Campus Issue Portal
          </h1>
          <p className="mt-3 text-slate-300 text-sm md:text-base">
            Create an account to report and track campus issues
          </p>
        </div>

        {/* REGISTER CARD */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <h2 className="text-xl font-semibold text-slate-800 text-center">
            Register
          </h2>

          {error && (
            <p className="mt-4 text-sm text-red-600 text-center">
              {error}
            </p>
          )}

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-slate-700">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Your full name"
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Department */}
            <div>
              <label className="block text-sm font-medium text-slate-700">
                Department
              </label>
              <input
                type="text"
                name="dept"
                value={formData.dept}
                onChange={handleChange}
                placeholder="CSE / ECE / EE / ME etc."
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Year */}
            <div>
              <label className="block text-sm font-medium text-slate-700">
                Year
              </label>
              <select
                name="year"
                value={formData.year}
                onChange={handleChange}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select year</option>
                <option value="1">1st Year</option>
                <option value="2">2nd Year</option>
                <option value="3">3rd Year</option>
                <option value="4">4th Year</option>
              </select>
              <p className="text-xs text-slate-500 mt-1">
                *Admins don’t need to fill this field
              </p>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-slate-700">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="yourname@example.com"
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-slate-700">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Minimum 8 characters"
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Register Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-2 rounded-lg font-medium transition ${
                loading
                  ? "bg-green-400 text-white cursor-not-allowed"
                  : "bg-green-600 text-white hover:bg-green-700"
              }`}
            >
              {loading ? "Registering..." : "Register"}
            </button>
          </form>

          <p className="text-sm text-slate-500 text-center mt-4">
            Already registered?{" "}
            <Link to="/" className="text-blue-600 hover:underline font-medium">
              Login here
            </Link>
          </p>

          <p className="text-xs text-slate-400 text-center mt-6">
            &copy; 2025 Campus Issue Portal. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
