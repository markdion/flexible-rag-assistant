from dotenv import load_dotenv
from flask import Flask
import logging

def create_app():
  """Create Flask application."""
  app = Flask(__name__, instance_relative_config=False)
  app.config.from_object('config.Config')

  load_dotenv()

  # Configure logging
  logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

  with app.app_context():
    # Import parts of our application
    from .rag import routes

    # Register Blueprints
    app.register_blueprint(routes.rag_bp)

    return app