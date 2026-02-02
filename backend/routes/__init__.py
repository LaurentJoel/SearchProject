# This file makes the routes directory a Python package
# Import all blueprints for easy access
from .auth_routes import auth_bp
from .content import content_bp
from .chat_routes import chat_bp

__all__ = ['auth_bp', 'content_bp', 'chat_bp']