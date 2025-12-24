from flask import Blueprint, request, jsonify
from firebase.auth import require_auth
from utils.role_guard import role_required
from firebase.database import (
    get_all_issues,
    update_issue_status,
    finalize_issue
)

admin_bp = Blueprint("admin", __name__)

# -------------------------------
# Fetch all issues (Admin)
# -------------------------------
@admin_bp.route("/issues", methods=["GET"])
@require_auth
@role_required("admin")
def get_issues():
    issues = get_all_issues()
    return jsonify(issues), 200


# -------------------------------
# Update issue status (Admin)
# -------------------------------
@admin_bp.route("/update-status", methods=["PUT"])
@require_auth
@role_required("admin")
def update_status():
    data = request.json

    issue_id = data.get("issue_id")
    new_status = data.get("status")

    if not issue_id or not new_status:
        return jsonify({"error": "issue_id and status are required"}), 400

    try:
        update_issue_status(issue_id, new_status)
    except ValueError as e:
        return jsonify({"error": str(e)}), 400
    except PermissionError as e:
        return jsonify({"error": str(e)}), 403

    return jsonify({"message": "Issue status updated successfully"}), 200

@admin_bp.route("/finalize", methods=["PUT"])
@require_auth
@role_required("admin")
def finalize_issue_route():
    data = request.json

    issue_id = data.get("issue_id")
    final_status = data.get("status")
    admin_note = data.get("admin_note")

    if not issue_id or not final_status or not admin_note:
        return jsonify({
            "error": "issue_id, status and admin_note are required"
        }), 400

    try:
        finalize_issue(issue_id, final_status, admin_note)
    except ValueError as e:
        return jsonify({"error": str(e)}), 400
    except PermissionError as e:
        return jsonify({"error": str(e)}), 403

    return jsonify({
        "message": f"Issue {final_status.lower()} successfully"
    }), 200
