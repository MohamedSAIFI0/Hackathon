from .routes import main as main_blueprint

def register_blueprints(app):
    app.register_blueprint(main_blueprint)
