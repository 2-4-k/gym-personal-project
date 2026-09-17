from flask import Flask
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
import os

db = SQLAlchemy()


def create_app():
    app = Flask(__name__)

    frontend_origin = os.environ.get("FRONTEND_ORIGIN", "http://localhost:5173")
    CORS(app, origins=[o.strip() for o in frontend_origin.split(",")])

    database_url = os.environ.get("DATABASE_URL", "postgresql://localhost/gym_recovery_tracker")
    # Render (and some other hosts) hand out "postgres://" URLs, which SQLAlchemy 1.4+ rejects.
    if database_url.startswith("postgres://"):
        database_url = database_url.replace("postgres://", "postgresql://", 1)
    app.config["SQLALCHEMY_DATABASE_URI"] = database_url
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
    app.config["JWT_SECRET_KEY"] = os.environ.get("JWT_SECRET_KEY", "dev-secret-change-me")

    db.init_app(app)

    from app.auth import bp as auth_bp
    app.register_blueprint(auth_bp, url_prefix="/api/auth")

    from app.routes import bp as api_bp
    app.register_blueprint(api_bp, url_prefix="/api")

    with app.app_context():
        from app.seed import seed_reference_data

        db.create_all()
        seed_reference_data()

    return app