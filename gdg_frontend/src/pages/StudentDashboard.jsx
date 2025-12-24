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

  const [selectedIssue, setSelectedIssue] = useState(null);
  const [issueDetailLoading, setIssueDetailLoading] = useState(false);

  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    resolved: 0,
  });

  /* =========================
     FETCH DASHBOARD DATA
  ========================= */
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        await Promise.all([
          fetchRecentIssues(),
          fetchStats(),
        ]);
      } catch  {
        setError("Failed to load dashboard data.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const fetchRecentIssues = async () => {
    const res = await api.get("/student/recent-issues");
    setRecentIssues(res.data);
  };

  const fetchStats = async () => {
    const res = await api.get("/student/issue-stats");
    setStats(res.data);
  };

  /* =========================
     LAZY LOAD MY ISSUES
  ========================= */
  const loadMyIssues = async () => {
    if (myIssues.length > 0) return;

    try {
      setMyIssuesLoading(true);
      const res = await api.get("/student/my-issues");
      setMyIssues(res.data);
    } catch  {
      setError("Failed to load your issues.");
    } finally {
      setMyIssuesLoading(false);
    }
  };

  /* =========================
     ISSUE MODAL
  ========================= */
  const openIssueModal = async (issueId) => {
    try {
      setIssueDetailLoading(true);
      const res = await api.get(`/student/issues/${issueId}`);
      setSelectedIssue(res.data);
    } catch  {
      setError("Failed to load issue details.");
    } finally {
      setIssueDetailLoading(false);
    }
  };

  const closeModal = () => setSelectedIssue(null);

  if (loading) {
    return (
      <p className="text-center text-slate-500 mt-10">
        Loading your dashboard...
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
    <>
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
          <StatCard title="Total Issues" value={stats.total} />
          <StatCard title="Pending" value={stats.pending} color="text-yellow-600" />
          <StatCard title="Resolved" value={stats.resolved} color="text-green-600" />
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
                <button
                  key={issue.id}
                  onClick={() => openIssueModal(issue.id)}
                  className="w-full text-left flex items-center justify-between border border-slate-200 rounded-lg px-4 py-3 hover:bg-slate-50 transition"
                >
                  <div>
                    <p className="font-medium text-slate-800">{issue.title}</p>
                    <p className="text-sm text-slate-500">{issue.category}</p>
                  </div>
                  <StatusBadge status={issue.status} />
                </button>
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
            className="flex items-center justify-between w-full"
          >
            <h2 className="text-lg font-semibold text-slate-800">
              My Issues
            </h2>
            <span className="text-xl text-slate-500">
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
                  <button
                    key={issue.id}
                    onClick={() => openIssueModal(issue.id)}
                    className="w-full text-left border border-slate-200 rounded-lg px-4 py-3 hover:bg-slate-50 transition"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium text-slate-800">{issue.title}</p>
                        <p className="text-sm text-slate-500">{issue.category}</p>
                      </div>
                      <StatusBadge status={issue.status} />
                    </div>
                  </button>
                ))
              )}
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {selectedIssue && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full p-6 relative">
            <button
              onClick={closeModal}
              className="absolute top-3 right-3 text-slate-400 hover:text-slate-600"
            >
              ✕
            </button>

            {issueDetailLoading ? (
              <p className="text-center text-slate-500">
                Loading issue details...
              </p>
            ) : (
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-slate-800">
                  {selectedIssue.title}
                </h2>

                <Detail label="Category" value={selectedIssue.category} />
                <Detail label="Location" value={selectedIssue.location} />
                <Detail label="Severity" value={selectedIssue.severity} />

                <div>
                  <p className="font-medium text-slate-800 mb-1">
                    Description
                  </p>
                  <p className="text-slate-600">
                    {selectedIssue.description}
                  </p>
                </div>

                <StatusBadge status={selectedIssue.status} />
                {selectedIssue.admin_message && (
  <>
    <hr className="my-4" />

    <div className="p-4 rounded-lg bg-blue-50 border border-blue-200">
      <p className="text-sm font-semibold text-blue-700 mb-1">
        Message from Administration
      </p>
      <p className="text-sm text-slate-700 whitespace-pre-line">
        {selectedIssue.admin_message}
      </p>
    </div>
  </>
)}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

/* =========================
   REUSABLE COMPONENTS
========================= */

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

function StatusBadge({ status }) {
  return (
    <span
      className={`text-sm font-medium px-3 py-1 rounded-full ${
        status === "Resolved"
          ? "bg-green-100 text-green-700"
          : "bg-yellow-100 text-yellow-700"
      }`}
    >
      {status}
    </span>
  );
}

function Detail({ label, value }) {
  return (
    <p className="text-sm text-slate-500">
      {label}: {value}
    </p>
  );
}
