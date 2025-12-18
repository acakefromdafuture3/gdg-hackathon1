from flask import Blueprint, request, jsonify
from firebase.auth import require_auth
from firebase.database import create_issue
from firebase.database import get_issues_by_user

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
