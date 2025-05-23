import os
from flask import Flask, send_from_directory
from flask_mysqldb import MySQL
from dotenv import load_dotenv
from flask_cors import CORS

def create_app():
    load_dotenv()
    app = Flask(__name__, static_folder=None)
    CORS(app)

    # Configurations
    app.config['MYSQL_HOST'] = os.getenv('MYSQL_HOST', 'localhost')
    app.config['MYSQL_USER'] = os.getenv('MYSQL_USER', 'root')
    app.config['MYSQL_PASSWORD'] = os.getenv('MYSQL_PASSWORD', '')
    app.config['MYSQL_DB'] = os.getenv('MYSQL_DB', 'academguard')
    app.config['MYSQL_CURSORCLASS'] = 'DictCursor'

    mysql = MySQL(app)
    app.extensions = getattr(app, 'extensions', {})
    app.extensions['mysql'] = mysql

    # Register blueprints here
    from routes import main as main_blueprint  # Use absolute import
    app.register_blueprint(main_blueprint)

    # Serve React/Vite frontend for Plateform
    FRONTEND_DIST = os.path.abspath(os.path.join(os.path.dirname(__file__), '../Plateform/frontend/dist'))

    @app.route('/', defaults={'path': ''})
    @app.route('/<path:path>')
    def serve_frontend(path):
        file_path = os.path.join(FRONTEND_DIST, path)
        if path != "" and os.path.exists(file_path) and os.path.isfile(file_path):
            return send_from_directory(FRONTEND_DIST, path)
        else:
            return send_from_directory(FRONTEND_DIST, 'index.html')

    return app
