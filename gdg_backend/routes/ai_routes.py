from flask import Blueprint, request, jsonify
from firebase.auth import require_auth
from ai.gemini import generate_issue_description

ai_bp = Blueprint("ai", __name__)

@ai_bp.route("/generate-description", methods=["POST"])
@require_auth
def generate_description():
    data = request.json
    topic = data.get("topic")

    if not topic:
        return jsonify({"error": "Topic is required"}), 400

    description = generate_issue_description(topic)

    return jsonify({
        "description": description
    }), 200
