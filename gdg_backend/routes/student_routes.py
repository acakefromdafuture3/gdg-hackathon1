from flask import Blueprint, request, jsonify
from firebase.auth import require_auth
from firebase.database import create_issue
from firebase.database import get_issues_by_user
from firebase.database import get_recent_issues
from firebase.init import db
from firebase.database import get_issue_stats_by_user

student_bp = Blueprint("student", __name__)

@student_bp.route("/report", methods=["POST"])
@require_auth
def report_issue():
    data = request.json

    if not data:
        return jsonify({"error": "No data provided"}), 400

    required_fields = ["title", "description", "category", "severity", "location"]
    for field in required_fields:
        if not data.get(field):
            return jsonify({"error": f"{field} is required"}), 400

    user_id = request.user["uid"]

    issue_id = create_issue(data, user_id)

    return jsonify({
        "message": "Issue reported successfully",
        "issue_id": issue_id
    }), 201
@student_bp.route("/my-issues", methods=["GET"])
@require_auth
def my_issues():
    user_id = request.user["uid"]
    issues = get_issues_by_user(user_id)
    return jsonify(issues), 200

@student_bp.route("/recent-issues", methods=["GET"])
@require_auth
def recent_issues():
    user_id = request.user["uid"]
    issues = get_recent_issues(user_id)
    return jsonify(issues), 200
@student_bp.route("/issues/<issue_id>", methods=["GET"])
@require_auth
def get_issue_detail(issue_id):
    user_id = request.user["uid"]

    issue_doc = db.collection("issues").document(issue_id).get()

    if not issue_doc.exists:
        return jsonify({"error": "Issue not found"}), 404

    issue = issue_doc.to_dict()

    # 🔒 Security check: student can only view their own issue
    if issue.get("created_by") != user_id:
        return jsonify({"error": "Unauthorized"}), 403

    issue["id"] = issue_doc.id
    return jsonify(issue), 200
@student_bp.route("/issue-stats", methods=["GET"])
@require_auth
def issue_stats():
    user_id = request.user["uid"]
    stats = get_issue_stats_by_user(user_id)
    return jsonify(stats), 200
