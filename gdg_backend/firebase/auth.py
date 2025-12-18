from functools import wraps
from flask import request, jsonify
from firebase_admin import auth
from firebase.init import db


def require_auth(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get("Authorization")

        if not token:
            return jsonify({"error": "Token missing"}), 401

        try:
            token = token.split(" ")[1]
            decoded = auth.verify_id_token(token)
            request.user = decoded
            return f(*args, **kwargs)
        except Exception as e:
            return jsonify({"error": "Invalid token"}), 401

    return decorated
