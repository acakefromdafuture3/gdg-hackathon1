from flask import Blueprint, request, jsonify
from firebase.auth import require_auth
from utils.role_guard import role_required
from firebase.database import (
    get_all_issues,
    update_issue_status,
    get_student_email_by_issue,
    finalize_issue
)
from firebase.init import db
from utils.email_service import send_email
from utils.email_templates import student_issue_finalized_email
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
    admin_message = data.get("admin_message")

    if not issue_id or not final_status or not admin_message or not admin_note:
        return jsonify({
            "error": "issue_id, status and admin_message are required"
        }), 400

    try:
        finalize_issue(
            issue_id,
            final_status,
            admin_note=admin_note,
            admin_message=admin_message
        )

        # 📧 Email student
        student_email = get_student_email_by_issue(issue_id)
        if student_email:
            issue_doc = db.collection("issues").document(issue_id).get()
            issue_data = issue_doc.to_dict()

            email_html = student_issue_finalized_email(
                issue_data,
                admin_message
            )

            send_email(
                to_emails=[student_email],
                subject="Update on Your Campus Issue",
                html_content=email_html
            )

    except ValueError as e:
        return jsonify({"error": str(e)}), 400
    except PermissionError as e:
        return jsonify({"error": str(e)}), 403

    return jsonify({
        "message": f"Issue {final_status.lower()} successfully"
    }), 200
