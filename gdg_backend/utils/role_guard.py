from flask import jsonify
from functools import wraps
from firebase.database import get_user_role


def role_required(required_role):
    def decorator(f):
        @wraps(f)
        def wrapped(*args, **kwargs):
            uid = getattr(getattr(f.__globals__.get("request"), "user", {}), "uid", None)
            role = get_user_role(uid)

            if role != required_role:
                return jsonify({"error": "Access denied"}), 403

            return f(*args, **kwargs)
        return wrapped
    return decorator
