from flask import Blueprint, request, jsonify
from firebase.auth import require_auth
from firebase.database import get_all_issues, update_issue_status

admin_bp = Blueprint("admin", __name__)

# -------------------------------
# Test route (for debugging)
# -------------------------------
@admin_bp.route("/ping", methods=["GET"])
def ping():
    return jsonify({"msg": "Admin route working"})


# -------------------------------
# Get all reported issues
# -------------------------------
@admin_bp.route("/issues", methods=["GET"])
@require_auth
def get_issues():
    """
    Admin can view all issues
    """
    issues = get_all_issues()
    return jsonify(issues)


# -------------------------------
# Update issue status
# -------------------------------
@admin_bp.route("/update-status", methods=["PUT"])
@require_auth
def update_status():
    """
    Admin updates issue status
    """
    data = request.json

    issue_id = data.get("issue_id")
    new_status = data.get("status")

    if not issue_id or not new_status:
        return jsonify({"error": "issue_id and status are required"}), 400

    update_issue_status(issue_id, new_status)

    return jsonify({"message": "Issue status updated successfully"})
