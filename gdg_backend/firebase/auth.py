from firebase_admin import auth
from flask import request, jsonify
from functools import wraps

def require_auth(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        auth_header = request.headers.get("Authorization")
        if not auth_header:
            return jsonify({"error": "Missing token"}), 401

        token = auth_header.split("Bearer ")[-1]
        try:
            decoded = auth.verify_id_token(token)
            request.user = decoded
        except:
            return jsonify({"error": "Invalid token"}), 401

        return f(*args, **kwargs)
    return decorated
