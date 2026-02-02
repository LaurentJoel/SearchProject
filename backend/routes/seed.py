from flask import Blueprint, jsonify
from models import db, AdminUser, PageContent, Feature
from auth import hash_password
import sys

seed_bp = Blueprint('seed', __name__)

@seed_bp.route('/seed', methods=['POST'])
def seed_database_endpoint():
    """Development endpoint to seed database"""
    try:
        # Prevent accidental use in production
        if not is_development():
            return jsonify({'error': 'Seeding only allowed in development'}), 403
        
        # Clear existing data
        db.session.query(Feature).delete()
        db.session.query(PageContent).delete()
        db.session.query(AdminUser).delete()
        
        # Create admin user
        admin = AdminUser(
            email="admin@search.com",
            password_hash=hash_password("admin123"),
            name="Super Admin"
        )
        db.session.add(admin)
        
        # Add default sections (same as seed_database.py)
        sections = [
            # ... (same sections data as above)
        ]
        
        for section_data in sections:
            section = PageContent(**section_data)
            db.session.add(section)
        
        # Add features
        features = [
            # ... (same features data as above)
        ]
        
        for feature_data in features:
            feature = Feature(**feature_data)
            db.session.add(feature)
        
        db.session.commit()
        
        return jsonify({
            'message': 'Database seeded successfully',
            'counts': {
                'admin_users': 1,
                'sections': len(sections),
                'features': len(features)
            }
        })
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

def is_development():
    """Check if running in development mode"""
    return '--debug' in sys.argv or 'development' in os.getenv('FLASK_ENV', '')