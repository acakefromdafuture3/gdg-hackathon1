from flask import jsonify, request
from functools import wraps
from firebase.database import get_user_role


def role_required(required_role):
    def decorator(f):
        @wraps(f)
        def wrapped(*args, **kwargs):
            # request.user is set by require_auth
            user = getattr(request, "user", None)

            if not user:
                return jsonify({"error": "Unauthorized"}), 401

            uid = user.get("uid")
            role = get_user_role(uid)

            if role != required_role:
                return jsonify({"error": "Access denied"}), 403

            return f(*args, **kwargs)

        return wrapped
    return decorator
