from flask import Blueprint, request, jsonify
from firebase.auth import require_auth
from firebase.database import create_issue, get_issues_by_user

student_bp = Blueprint("student", __name__)

@student_bp.route("/report", methods=["POST"])
@require_auth
def report_issue():
    data = request.json
    user_id = request.user["uid"]
    create_issue(data, user_id)
    return jsonify({"message": "Issue reported successfully"})

@student_bp.route("/my-issues", methods=["GET"])
@require_auth
def my_issues():
    user_id = request.user["uid"]
    issues = get_issues_by_user(user_id)
    return jsonify(issues)
