from flask import Flask
from flask_cors import CORS

from routes.student_routes import student_bp
from routes.admin_routes import admin_bp
from routes.auth_routes import auth_bp


def create_app():
    app = Flask(__name__)
    CORS(app)

    app.register_blueprint(auth_bp, url_prefix="/auth")
    app.register_blueprint(student_bp, url_prefix="/student")
    app.register_blueprint(admin_bp, url_prefix="/admin")

    @app.route("/")
    def home():
        return {
            "status": "Backend running",
            "message": "Campus Issue Reporting API"
        }

    @app.route("/ping")
    def ping():
        return {
            "status": "ok",
            "message": "pong"
        }

    return app


# 🔑 MUST BE AT TOP LEVEL
app = create_app()


if __name__ == "__main__":
    app.run(debug=True)
