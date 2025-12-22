import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api/api";

export default function StudentDashboard() {
  const [myIssues, setMyIssues] = useState([]);
  const [recentIssues, setRecentIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showMyIssues, setShowMyIssues] = useState(false);
  const [myIssuesLoading, setMyIssuesLoading] = useState(false);

  useEffect(() => {
    const fetchRecentIssues = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("User not authenticated");

        const res = await api.get("/student/recent-issues");
        setRecentIssues(res.data);
      } catch (err) {
        setError(
          err.response?.data?.error ||
          "Failed to load recent issues."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchRecentIssues();
  }, []);

  const loadMyIssues = async () => {
    if (myIssues.length > 0) return;

    try {
      setMyIssuesLoading(true);
      const res = await api.get("/student/my-issues");
      setMyIssues(res.data);
    } catch (err) {
      setError(
        err.response?.data?.error ||
        "Failed to load your issues."
      );
    } finally {
      setMyIssuesLoading(false);
    }
  };

  const totalIssues = myIssues.length;
  const pendingIssues = myIssues.filter(
    (issue) => issue.status === "Pending"
  ).length;
  const resolvedIssues = myIssues.filter(
    (issue) => issue.status === "Resolved"
  ).length;

  if (loading) {
    return (
      <p className="text-center text-slate-500 mt-10">
        Loading your issues...
      </p>
    );
  }

  if (error) {
    return (
      <p className="text-center text-red-600 mt-10">
        {error}
      </p>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800">
          Student Dashboard
        </h1>
        <p className="text-slate-600 mt-1">
          Track and manage issues you have reported
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard title="Total Issues" value={totalIssues} />
        <StatCard title="Pending" value={pendingIssues} color="text-yellow-600" />
        <StatCard title="Resolved" value={resolvedIssues} color="text-green-600" />
      </div>

      {/* Action Button */}
      <Link
        to="/student/report"
        className="inline-block bg-blue-600 text-white px-5 py-2 rounded-lg font-medium hover:bg-blue-700 transition"
      >
        + Report New Issue
      </Link>

      {/* Recent Issues */}
      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-lg font-semibold text-slate-800 mb-4">
          Recent Issues
        </h2>

        {recentIssues.length === 0 ? (
          <p className="text-slate-500">
            No issues reported in the last 7 days.
          </p>
        ) : (
          <div className="space-y-3">
            {recentIssues.map((issue) => (
              <div
                key={issue.id}
                className="flex items-center justify-between border border-slate-200 rounded-lg px-4 py-3"
              >
                <div>
                  <p className="font-medium text-slate-800">{issue.title}</p>
                  <p className="text-sm text-slate-500">{issue.category}</p>
                </div>

                <span
                  className={`text-sm font-medium px-3 py-1 rounded-full ${
                    issue.status === "Resolved"
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {issue.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* My Issues */}
      <div className="bg-white rounded-xl shadow p-6">
        <button
          onClick={() => {
            setShowMyIssues((prev) => !prev);
            if (!showMyIssues) loadMyIssues();
          }}
          className="flex items-center justify-between w-full text-left"
        >
          <h2 className="text-lg font-semibold text-slate-800">My Issues</h2>
          <span className="text-slate-500 text-xl">
            {showMyIssues ? "−" : "+"}
          </span>
        </button>

        {showMyIssues && (
          <div className="mt-4 space-y-3">
            {myIssuesLoading ? (
              <p className="text-slate-500">Loading your issues...</p>
            ) : myIssues.length === 0 ? (
              <p className="text-slate-500">
                You haven’t reported any issues yet.
              </p>
            ) : (
              myIssues.map((issue) => (
                <div
                  key={issue.id}
                  className="border border-slate-200 rounded-lg px-4 py-3"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium text-slate-800">{issue.title}</p>
                      <p className="text-sm text-slate-500">{issue.category}</p>
                    </div>
                    <span
                      className={`text-sm font-medium px-3 py-1 rounded-full ${
                        issue.status === "Resolved"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {issue.status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}

/* Reusable stat card component */
function StatCard({ title, value, color = "text-slate-800" }) {
  return (
    <div className="bg-white rounded-xl shadow p-5">
      <p className="text-sm text-slate-500">{title}</p>
      <p className={`text-3xl font-bold mt-2 ${color}`}>
        {value}
      </p>
    </div>
  );
}
