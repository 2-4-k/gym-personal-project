from datetime import datetime, timedelta
from functools import wraps

import jwt
from flask import Blueprint, current_app, g, jsonify, request
from werkzeug.security import check_password_hash, generate_password_hash

from app import db
from app.models import User

bp = Blueprint("auth", __name__)

TOKEN_EXPIRY_DAYS = 30

VALID_SEX = {"male", "female", "other"}
VALID_EXPERIENCE = {"novice", "intermediate", "advanced"}


def generate_token(user_id):
    payload = {
        "sub": user_id,
        "exp": datetime.utcnow() + timedelta(days=TOKEN_EXPIRY_DAYS),
        "iat": datetime.utcnow(),
    }
    return jwt.encode(payload, current_app.config["JWT_SECRET_KEY"], algorithm="HS256")


def login_required(view):
    @wraps(view)
    def wrapped(*args, **kwargs):
        header = request.headers.get("Authorization", "")
        if not header.startswith("Bearer "):
            return jsonify({"error": "Missing or invalid Authorization header"}), 401

        token = header.split(" ", 1)[1]
        try:
            payload = jwt.decode(
                token, current_app.config["JWT_SECRET_KEY"], algorithms=["HS256"]
            )
        except jwt.ExpiredSignatureError:
            return jsonify({"error": "Token expired"}), 401
        except jwt.InvalidTokenError:
            return jsonify({"error": "Invalid token"}), 401

        user = User.query.get(payload["sub"])
        if user is None:
            return jsonify({"error": "User not found"}), 401

        g.current_user = user
        return view(*args, **kwargs)

    return wrapped


@bp.route("/signup", methods=["POST"])
def signup():
    data = request.get_json(silent=True) or {}
    email = (data.get("email") or "").strip().lower()
    password = data.get("password") or ""

    if not email or "@" not in email:
        return jsonify({"error": "A valid email is required"}), 400
    if len(password) < 8:
        return jsonify({"error": "Password must be at least 8 characters"}), 400

    try:
        bodyweight_lbs = float(data.get("bodyweight_lbs"))
        height_inches = float(data.get("height_inches"))
    except (TypeError, ValueError):
        return jsonify({"error": "Bodyweight and height are required"}), 400
    if not (50 <= bodyweight_lbs <= 700):
        return jsonify({"error": "Bodyweight must be between 50 and 700 lbs"}), 400
    if not (36 <= height_inches <= 96):
        return jsonify({"error": "Height must be between 36 and 96 inches"}), 400

    sex = (data.get("sex") or "").strip().lower()
    if sex not in VALID_SEX:
        return jsonify({"error": f"Sex must be one of {sorted(VALID_SEX)}"}), 400

    training_experience = (data.get("training_experience") or "").strip().lower()
    if training_experience not in VALID_EXPERIENCE:
        return jsonify({"error": f"Training experience must be one of {sorted(VALID_EXPERIENCE)}"}), 400

    if User.query.filter_by(email=email).first() is not None:
        return jsonify({"error": "An account with that email already exists"}), 409

    user = User(
        email=email,
        password_hash=generate_password_hash(password),
        bodyweight_lbs=bodyweight_lbs,
        height_inches=height_inches,
        sex=sex,
        training_experience=training_experience,
    )
    db.session.add(user)
    db.session.commit()

    token = generate_token(user.id)
    return jsonify({"token": token, "user": user.to_dict()}), 201


@bp.route("/login", methods=["POST"])
def login():
    data = request.get_json(silent=True) or {}
    email = (data.get("email") or "").strip().lower()
    password = data.get("password") or ""

    user = User.query.filter_by(email=email).first()
    if user is None or not check_password_hash(user.password_hash, password):
        return jsonify({"error": "Invalid email or password"}), 401

    token = generate_token(user.id)
    return jsonify({"token": token, "user": user.to_dict()})


@bp.route("/me", methods=["GET"])
@login_required
def me():
    return jsonify(g.current_user.to_dict())


@bp.route("/me", methods=["PATCH"])
@login_required
def update_me():
    data = request.get_json(silent=True) or {}
    user = g.current_user

    if "name" in data:
        name = (data.get("name") or "").strip()
        user.name = name or None

    if "bodyweight_lbs" in data:
        try:
            bodyweight_lbs = float(data["bodyweight_lbs"])
        except (TypeError, ValueError):
            return jsonify({"error": "Bodyweight must be a number"}), 400
        if not (50 <= bodyweight_lbs <= 700):
            return jsonify({"error": "Bodyweight must be between 50 and 700 lbs"}), 400
        user.bodyweight_lbs = bodyweight_lbs

    if "height_inches" in data:
        try:
            height_inches = float(data["height_inches"])
        except (TypeError, ValueError):
            return jsonify({"error": "Height must be a number"}), 400
        if not (36 <= height_inches <= 96):
            return jsonify({"error": "Height must be between 36 and 96 inches"}), 400
        user.height_inches = height_inches

    if "sex" in data:
        sex = (data.get("sex") or "").strip().lower()
        if sex not in VALID_SEX:
            return jsonify({"error": f"Sex must be one of {sorted(VALID_SEX)}"}), 400
        user.sex = sex

    if "training_experience" in data:
        training_experience = (data.get("training_experience") or "").strip().lower()
        if training_experience not in VALID_EXPERIENCE:
            return jsonify({"error": f"Training experience must be one of {sorted(VALID_EXPERIENCE)}"}), 400
        user.training_experience = training_experience

    db.session.commit()
    return jsonify(user.to_dict())
