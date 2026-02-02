# backend/config.py - FIXED
import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    # Use the actual database name that exists
    SQLALCHEMY_DATABASE_URI = os.getenv(
        "DATABASE_URL",
        "postgresql+psycopg2://postgres:postgres@localhost:5432/search_presentation"  # Changed to search_presentation
    )

    JWT_SECRET_KEY = os.getenv(
        "JWT_SECRET_KEY",
        "your-super-secret-jwt-key-change-this-in-production"
    )

    ADMIN_USERNAME = os.getenv("ADMIN_USERNAME", "admin")
    ADMIN_PASSWORD = os.getenv("ADMIN_PASSWORD", "admin123")

    FRONTEND_ORIGIN = os.getenv("FRONTEND_ORIGIN", "http://localhost:3000")

    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SECRET_KEY = os.getenv("SECRET_KEY", "flask-secret-key-change-this")
    ENV = os.getenv("FLASK_ENV", "development")
