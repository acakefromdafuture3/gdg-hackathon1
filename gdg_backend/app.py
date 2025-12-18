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

    # 🔥 KEEP-ALIVE PING
    @app.route("/ping")
    def ping():
        return {
            "status": "ok",
            "message": "pong"
        }

    return app
