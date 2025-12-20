import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";

export default function ReportIssue() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    severity: "",
    location: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
const handleAutofill = async () => {
  try {
    if (!formData.title.trim()) return;

    setAiLoading(true);
    const token = localStorage.getItem("token");

    const res = await api.post(
      "/ai/generate-issue-fields",
      { topic: formData.title },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const { description, category, severity } = res.data;

    setFormData(prev => ({
      ...prev,
      description: description || prev.description,
      category: category || prev.category,
      severity: severity || prev.severity,
    }));
  } catch (err) {
    alert("AI could not generate issue details");
  } finally {
    setAiLoading(false);
  }
};


  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // -------- Client-side validation --------
    if (!formData.title.trim()) {
      return setError("Issue title is required.");
    }

    if (!formData.description.trim()) {
      return setError("Please describe the issue.");
    }

    if (!formData.category) {
      return setError("Please select a category.");
    }

    if (!formData.severity) {
      return setError("Please select severity level.");
    }

    if (!formData.location.trim()) {
      return setError("Location is required.");
    }

    setError("");
    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("Authentication token missing");
      }

      await api.post(
        "/student/report",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Success
      navigate("/student", {
        state: { success: "Issue reported successfully!" },
      });

    } catch (err) {
      setError(
        err.response?.data?.error ||
        err.message ||
        "Failed to submit issue. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800">
          Report an Issue
        </h1>
        <p className="text-slate-600 mt-1">
          Fill in the details below to report a campus issue
        </p>
      </div>

      {/* Form Card */}
      <div className="bg-white rounded-xl shadow p-6">
        {error && (
          <p className="mb-4 text-sm text-red-600 text-center">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-slate-700">
              Issue Title
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Short summary of the issue"
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
<button
  type="button"
  onClick={handleAutofill}
  disabled={!formData.title || aiLoading}
  className={`
    mt-3
    inline-flex items-center gap-2
    px-4 py-2
    rounded-lg
    text-sm font-medium
    transition-all
    disabled:opacity-50 disabled:cursor-not-allowed

    bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500
    text-white
    hover:brightness-110
    shadow-sm
    focus:outline-none
    focus:ring-2 focus:ring-purple-400
  `}
>
  <span className="text-base">✨</span>
  {aiLoading ? "Analyzing issue..." : "Generate details with AI"}
</button>
<p className="mt-1 text-xs text-slate-500">
  AI will suggest a description, category, and severity
</p>



          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-slate-700">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe the issue in detail"
              rows={4}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-slate-700">
              Category
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select category</option>
              <option value="Classroom">Classroom</option>
              <option value="Infrastructure">Infrastructure</option>
              <option value="Hostel">Hostel</option>
              <option value="Network">Network</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Severity */}
          <div>
            <label className="block text-sm font-medium text-slate-700">
              Severity
            </label>
            <select
              name="severity"
              value={formData.severity}
              onChange={handleChange}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select severity</option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-slate-700">
              Location
            </label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="Room number / Block / Area"
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 rounded-lg font-medium transition ${
              loading
                ? "bg-blue-400 text-white cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
          >
            {loading ? "Submitting..." : "Submit Issue"}
          </button>
        </form>
      </div>
    </div>
  );
}
