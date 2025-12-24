from flask import Blueprint, request, jsonify
import requests
from firebase_admin import auth
from firebase.database import create_user_profile, get_user_role

auth_bp = Blueprint("auth", __name__)

FIREBASE_API_KEY = "AIzaSyAn7RDBHo1XJdTte0U2u0rAEbNm0lWhx6Y"


# ---------------- REGISTER ----------------
@auth_bp.route("/register", methods=["POST"])
def register():
    data = request.json


    try:
        user = auth.create_user(
            email=data["email"],
            password=data["password"]
        )

        create_user_profile(user.uid, data)

        return jsonify({"message": "Registration successful"})

    except Exception as e:
        return jsonify({"error": str(e)}), 400


# ---------------- LOGIN ----------------
@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.json

    payload = {
        "email": data["email"],
        "password": data["password"],
        "returnSecureToken": True
    }

    r = requests.post(
        f"https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key={FIREBASE_API_KEY}",
        json=payload
    )

    if r.status_code != 200:
        return jsonify({"error": "Invalid credentials"}), 401

    res = r.json()
    uid = res["localId"]

    role = get_user_role(uid)

    return jsonify({
        "token": res["idToken"],
        "role": role
    })
