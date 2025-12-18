from flask import Blueprint, jsonify
from firebase.auth import require_auth
from utils.role_guard import role_required

admin_bp = Blueprint("admin", __name__)

@admin_bp.route("/dashboard")
@require_auth
@role_required("admin")
def admin_dashboard():
    return jsonify({"msg": "Welcome Admin"})
