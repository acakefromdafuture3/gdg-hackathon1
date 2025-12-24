import { useEffect, useState } from "react";
import api from "../api/api";
import IssueAI from "../components/IssueAI"
const formatDate = (ts) => {
  if (!ts) return "";
  const date = ts.seconds
    ? new Date(ts.seconds * 1000)
    : new Date(ts);
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

export default function AdminDashboard() {
  const [issues, setIssues] = useState([]);
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [severityFilter, setSeverityFilter] = useState("All");
  const [sortBy, setSortBy] = useState("newest");
  const [showResolved, setShowResolved] = useState(false);



  /* ---------------- Fetch all issues ---------------- */
  useEffect(() => {
    const fetchIssues = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await api.get("/admin/issues", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setIssues(res.data);
      } catch {
        setError("Failed to load admin issues");
      } finally {
        setLoading(false);
      }
    };

    fetchIssues();
  }, []);

  /* ---------------- Search Logic ---------------- */
  const processedIssues = issues
  .filter(issue => {
    const q = searchQuery.toLowerCase();
    return (
      issue.title.toLowerCase().includes(q) ||
      issue.reporter?.name?.toLowerCase().includes(q)
    );
  })
  .filter(issue =>
    statusFilter === "All" ? true : issue.status === statusFilter
  )
  .filter(issue =>
    severityFilter === "All" ? true : issue.severity === severityFilter
  )
  .sort((a, b) => {
    if (sortBy === "newest") {
      return new Date(b.created_at) - new Date(a.created_at);
    }

    if (sortBy === "severity") {
      const order = { High: 3, Medium: 2, Low: 1 };
      return order[b.severity] - order[a.severity];
    }

    return 0;
  });
const isClosed = (status) =>
  status === "Resolved" || status === "Rejected";

const activeIssues = processedIssues.filter(
  issue => !isClosed(issue.status)
);

const resolvedIssues = processedIssues.filter(
  issue => isClosed(issue.status)
);



  /* ---------------- Stats ---------------- */
  const total = issues.length;
  const pending = issues.filter(i => i.status === "Pending").length;
  const inProgress = issues.filter(i => i.status === "In Progress").length;
  const resolved = issues.filter(i => i.status === "Resolved").length;
  const rejected = issues.filter(i => i.status === "Rejected").length;

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (error) return <p className="text-center text-red-600 mt-10">{error}</p>;

  return (
    <div className="space-y-8">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Admin Dashboard</h1>
        <p className="text-slate-600 mt-1">
          Monitor and manage all reported campus issues
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <StatCard title="Total Issues" value={total} />
        <StatCard title="Pending" value={pending} color="text-yellow-600" />
        <StatCard title="In Progress" value={inProgress} color="text-blue-600" />
        <StatCard title="Closed" value={resolved + rejected} color="text-green-600" />
      </div>

      {/* Search */}
      <input
        type="text"
        placeholder="Search by title or reporter..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full sm:max-w-sm px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <div className="flex flex-col sm:flex-row gap-4">

  {/* Status Filter */}
  <select
    value={statusFilter}
    onChange={(e) => setStatusFilter(e.target.value)}
    className="px-4 py-2 border rounded-lg"
  >
    <option value="All">All Status</option>
    <option value="Pending">Pending</option>
    <option value="In Progress">In Progress</option>
    <option value="Resolved">Resolved</option>
    <option value="Rejected">Rejected</option>
  </select>

  {/* Severity Filter */}
  <select
    value={severityFilter}
    onChange={(e) => setSeverityFilter(e.target.value)}
    className="px-4 py-2 border rounded-lg"
  >
    <option value="All">All Severity</option>
    <option value="High">High</option>
    <option value="Medium">Medium</option>
    <option value="Low">Low</option>
  </select>

  {/* Sort */}
  <select
    value={sortBy}
    onChange={(e) => setSortBy(e.target.value)}
    className="px-4 py-2 border rounded-lg"
  >
    <option value="newest">Newest First</option>
    <option value="severity">Severity Priority</option>
  </select>

</div>


      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-gradient-to-r from-slate-100 to-slate-200 text-slate-700">
            <tr>
              <th className="px-4 py-3 text-left">Title</th>
              <th className="px-4 py-3 text-left">Severity</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-left">Reported By</th>
              <th className="px-4 py-3 text-center">Action</th>
            </tr>
          </thead>

          <tbody>
            {activeIssues.map((issue, index) => (
              <tr
  key={issue.id}
  className={`
    border-t
    transition-colors
    hover:bg-blue-50
    ${index % 2 === 0 ? "bg-white" : "bg-slate-50"}
    ${
      issue.severity === "High"
        ? "border-l-4 border-red-500"
        : issue.severity === "Medium"
        ? "border-l-4 border-orange-400"
        : "border-l-4 border-slate-200"
    }
  `}
>

                <td className="px-4 py-3 font-semibold text-slate-800 max-w-xs truncate group">
  <span className="group-hover:text-blue-600 transition">
    {issue.title.length > 40
      ? issue.title.slice(0, 40) + "…"
      : issue.title}
  </span>
</td>

                <td className="px-4 py-3">
                  <SeverityBadge value={issue.severity} />
                </td>

                <td className="px-4 py-3">
                  <StatusBadge issue={issue} />
                </td>

                <td className="px-4 py-3 text-slate-600 text-sm">
                  {issue.reporter?.name || "—"}
                </td>

                <td className="px-4 py-3 text-center">
                  <button
  onClick={() => setSelectedIssue(issue)}
  className="px-3 py-1 rounded-full text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 transition"
>
  View
</button>

                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
{/* Resolved Issues Section */}
<div className="bg-white rounded-2xl shadow-sm border border-slate-200">
  <button
    onClick={() => setShowResolved(!showResolved)}
    className="w-full flex items-center justify-between px-6 py-4 font-semibold text-slate-700 hover:bg-slate-50"
  >
    <span>
      Closed Issues ({resolvedIssues.length})
    </span>
    <span className="text-sm text-slate-500">
      {showResolved ? "Hide" : "Show"}
    </span>
  </button>

  {showResolved && (
    <div className="border-t overflow-x-auto">
      <table className="min-w-full text-sm">
        <thead className="bg-slate-50 text-slate-500">
          <tr>
            <th className="px-4 py-3 text-left">Title</th>
            <th className="px-4 py-3 text-left">Severity</th>
            <th className="px-4 py-3 text-left">Reported By</th>
            <th className="px-4 py-3 text-center">Action</th>
          </tr>
        </thead>

        <tbody>
          {resolvedIssues.map(issue => (
            <tr
              key={issue.id}
              className="border-t bg-slate-50 hover:bg-slate-100"
            >
              <td className="px-4 py-3 font-medium text-slate-700">
                {issue.title}
              </td>

              <td className="px-4 py-3">
                <SeverityBadge value={issue.severity} />
              </td>

              <td className="px-4 py-3 text-slate-600">
                {issue.reporter?.name || "—"}
              </td>

              <td className="px-4 py-3 text-center">
                <button
                  onClick={() => setSelectedIssue(issue)}
                  className="text-blue-600 hover:underline text-sm"
                >
                  View
                </button>
              </td>
            </tr>
          ))}

          {resolvedIssues.length === 0 && (
            <tr>
              <td
                colSpan={4}
                className="px-4 py-6 text-center text-slate-500"
              >
                No resolved issues
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )}
</div>
      {/* Modal */}
      {selectedIssue && (
       <IssueModal
  issue={selectedIssue}
  allIssues={issues}
  onClose={() => setSelectedIssue(null)}
  setIssues={setIssues}
/>

      )}
    </div>
  );
}

/* ---------------- Components ---------------- */

function StatCard({ title, value, color = "text-slate-800" }) {
  return (
    <div className="bg-white rounded-xl shadow p-5">
      <p className="text-sm text-slate-500">{title}</p>
      <p className={`text-3xl font-bold mt-2 ${color}`}>{value}</p>
    </div>
  );
}

function SeverityBadge({ value }) {
  const map = {
    High: "bg-red-100 text-red-700",
    Medium: "bg-orange-100 text-orange-700",
    Low: "bg-slate-100 text-slate-700",
  };
  return (
    <span className={`px-3 py-1 rounded-full text-xs ${map[value]}`}>
      {value}
    </span>
  );
}

function StatusBadge({ issue }) {
  const base =
    "px-3 py-1 rounded-full text-xs font-medium inline-block";

  if (issue.status === "Resolved") {
    return (
      <span className={`${base} bg-green-100 text-green-700`}>
        Resolved on {formatDate(issue.resolved_at)}
      </span>
    );
  }

  if (issue.status === "Rejected") {
    return (
      <span className={`${base} bg-red-100 text-red-700`}>
        Rejected on {formatDate(issue.rejected_at)}
      </span>
    );
  }

  if (issue.status === "In Progress") {
    return (
      <span className={`${base} bg-blue-100 text-blue-700`}>
        In Progress
      </span>
    );
  }

  return (
    <span className={`${base} bg-yellow-100 text-yellow-700`}>
      Pending
    </span>
  );
}


function IssueModal({ issue, allIssues, onClose, setIssues }) {
  const [status, setStatus] = useState(issue.status);
  const [updating, setUpdating] = useState(false);
  const [adminNote, setAdminNote] = useState("");
  const [adminMessage, setAdminMessage] = useState("");


  const isClosed =
    issue.status === "Resolved" || issue.status === "Rejected";

const handleUpdate = async () => {
  try {
    setUpdating(true);
    const token = localStorage.getItem("token");

    if (status === "Resolved" || status === "Rejected") {
      if (!adminNote || !adminMessage) {
        alert("Please fill both admin note and student message.");
        return;
      }

      await api.put(
        "/admin/finalize",
        {
          issue_id: issue.id,
          status,
          admin_note: adminNote,
          admin_message: adminMessage,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } else {
      await api.put(
        "/admin/update-status",
        { issue_id: issue.id, status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    }

    setIssues(prev =>
      prev.map(i =>
        i.id === issue.id
          ? { ...i, status }
          : i
      )
    );

    onClose();
  } catch {
    alert("Failed to update issue");
  } finally {
    setUpdating(false);
  }
};


  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-lg rounded-xl shadow-lg p-6 relative
        max-h-[90vh] overflow-y-auto">

        <button
          onClick={onClose}
          className="absolute top-3 right-4 text-slate-400 hover:text-slate-600"
        >
          ✕
        </button>

        <h2 className="text-xl font-semibold mb-4">Issue Details</h2>

        <div className="space-y-2 text-sm">
          <p><b>Title:</b> {issue.title}</p>
          <p><b>Description:</b> {issue.description}</p>
          <p><b>Category:</b> {issue.category}</p>
          <p><b>Severity:</b> {issue.severity}</p>
          <p><b>Location:</b> {issue.location}</p>

          <p>
            <b>Status:</b>{" "}
            {issue.status === "Resolved" &&
              `Resolved on ${formatDate(issue.resolved_at)}`}
            {issue.status === "Rejected" &&
              `Rejected on ${formatDate(issue.rejected_at)}`}
            {(issue.status === "Pending" ||
              issue.status === "In Progress") &&
              issue.status}
          </p>
        </div>

       {!isClosed && (
  <>
    <hr className="my-4" />
    <IssueAI issue={issue} allIssues={allIssues} />
  </>
)}
        <div className="mt-5 text-sm space-y-1">
          <h3 className="font-semibold mb-1">Reported By</h3>
          <p>Name: {issue.reporter?.name || "—"}</p>
          <p>Department: {issue.reporter?.dept || "—"}</p>
          <p>Year: {issue.reporter?.year || "—"}</p>
          <p>Email: {issue.reporter?.email || "—"}</p>
        </div>

        <hr className="my-4" />

    {!isClosed ? (
  <div className="space-y-4">
    <h3 className="font-semibold">Update Status</h3>

    {["Pending", "In Progress", "Resolved", "Rejected"].map(s => (
      <label key={s} className="flex items-center gap-2 text-sm">
        <input
          type="radio"
          checked={status === s}
          onChange={() => setStatus(s)}
        />
        {s}
      </label>
    ))}

    {(status === "Resolved" || status === "Rejected") && (
      <>
        <hr className="my-4" />

        <div>
          <label className="text-sm font-medium">
            Admin Note (internal)
          </label>
          <textarea
            value={adminNote}
            onChange={(e) => setAdminNote(e.target.value)}
            className="w-full mt-1 p-2 border rounded-lg text-sm"
            rows={3}
            placeholder="Internal note for admins..."
          />
        </div>

        <div>
          <label className="text-sm font-medium">
            Message to Student
          </label>
          <textarea
            value={adminMessage}
            onChange={(e) => setAdminMessage(e.target.value)}
            className="w-full mt-1 p-2 border rounded-lg text-sm"
            rows={4}
            placeholder="This message will be emailed to the student..."
          />
        </div>
      </>
    )}
  </div>
) : (
  <p className="text-sm text-slate-500 italic">
    This issue is closed and cannot be updated.
  </p>
)}

        <div className="flex justify-end gap-3 mt-6">
          <button onClick={onClose} className="px-4 py-2 border rounded-lg">
            Close
          </button>
          <button
            onClick={handleUpdate}
            disabled={updating || isClosed}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg
              hover:bg-blue-700 disabled:opacity-50"
          >
            {updating ? "Updating..." : "Update Status"}
          </button>
        </div>
      </div>
    </div>
  );
}
