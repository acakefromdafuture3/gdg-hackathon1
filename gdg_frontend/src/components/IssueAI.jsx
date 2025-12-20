import { useEffect, useState } from "react";
import api from "../api/api";

export default function IssueAI({ issue, allIssues }) {
  const [summary, setSummary] = useState("");
  const [duplicateWarning, setDuplicateWarning] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    generateSummary();
    checkDuplicate();
    // eslint-disable-next-line
  }, []);

  const generateSummary = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const res = await api.post(
        "/ai/summarize",
        { description: issue.description },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSummary(res.data.summary);
    } catch {
      setSummary("AI summary unavailable.");
    } finally {
      setLoading(false);
    }
  };

  const checkDuplicate = async () => {
    try {
      const token = localStorage.getItem("token");

      const unresolved = allIssues
        .filter(i => i.status !== "Resolved" && i.id !== issue.id)
        .map(i => i.title);

      const res = await api.post(
        "/ai/check-duplicate",
        {
          new_issue: issue.title,
          existing_issues: unresolved,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.duplicate) {
        setDuplicateWarning(
          "This issue appears similar to an existing unresolved issue."
        );
      }
    } catch {
      // Silent fail — AI should never block admin
    }
  };

  return (
    <div className="space-y-3">
      {/* AI Summary */}
      <div className="p-3 rounded-lg bg-purple-50 border border-purple-200">
        <p className="text-sm font-semibold text-purple-700 mb-1">
          🤖 AI Summary
        </p>
        <p className="text-sm text-slate-700">
          {loading ? "Thinking..." : summary}
        </p>
      </div>

      {/* Duplicate Warning */}
      {duplicateWarning && (
        <div className="p-3 rounded-lg bg-yellow-50 border border-yellow-300 text-sm text-yellow-800">
          ⚠️ {duplicateWarning}
        </div>
      )}
    </div>
  );
}
