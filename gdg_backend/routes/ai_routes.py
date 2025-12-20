from flask import Blueprint, request, jsonify
from firebase.auth import require_auth
from ai.gemini import (
    generate_issue_fields,
    summarize_issue,
    is_duplicate_issue
)

ai_bp = Blueprint("ai", __name__)


# --------------------------------
# 1. Autofill Description + Fields
# --------------------------------
@ai_bp.route("/generate-issue-fields", methods=["POST"])
@require_auth
def generate_issue_fields_route():
    data = request.get_json()

    if not data:
        return jsonify({"error": "Request body is required"}), 400

    topic = data.get("topic", "").strip()

    if not topic:
        return jsonify({"error": "Topic is required"}), 400

    ai_result = generate_issue_fields(topic)

    return jsonify(ai_result), 200


# --------------------------------
# 2. One-line Summary (Admin)
# --------------------------------
@ai_bp.route("/summarize", methods=["POST"])
@require_auth
def summarize():
    data = request.get_json()

    if not data:
        return jsonify({"error": "Request body is required"}), 400

    description = data.get("description", "").strip()

    if not description:
        return jsonify({"error": "Description is required"}), 400

    summary = summarize_issue(description)

    return jsonify({"summary": summary}), 200


# --------------------------------
# 3. Duplicate Issue Detection
# --------------------------------
@ai_bp.route("/check-duplicate", methods=["POST"])
@require_auth
def check_duplicate():
    data = request.get_json()

    if not data:
        return jsonify({"error": "Request body is required"}), 400

    new_issue = data.get("new_issue", "").strip()
    existing_issues = data.get("existing_issues", [])

    if not new_issue:
        return jsonify({"error": "New issue text is required"}), 400

    if not isinstance(existing_issues, list):
        return jsonify({"error": "existing_issues must be a list"}), 400

    duplicate = is_duplicate_issue(new_issue, existing_issues)

    return jsonify({"duplicate": duplicate}), 200
