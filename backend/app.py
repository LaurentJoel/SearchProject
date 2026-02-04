# backend/app.py - UPDATED WITH MISSING ROUTES
import os
from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from flask_restx import Api, Resource, fields, Namespace
from werkzeug.datastructures import FileStorage
from config import Config
from models import db, AdminUser, ContentSection, Feature, ChatMessage, Media, DynamicSection
from datetime import datetime
import uuid
import json
from sqlalchemy import text
from chatbot_intelligence import chatbot

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    
    # CORS Configuration
    CORS(app, 
         origins=["http://localhost:3000","http://localhost:8080", "http://localhost"],
         supports_credentials=True,
         methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"])
    
    # JWT Configuration
    app.config['JWT_SECRET_KEY'] = Config.JWT_SECRET_KEY
    app.config['JWT_ACCESS_TOKEN_EXPIRES'] = 3600
    
    # Upload configuration
    UPLOAD_FOLDER = os.path.join(os.path.dirname(__file__), 'uploads')
    os.makedirs(os.path.join(UPLOAD_FOLDER, 'images'), exist_ok=True)
    os.makedirs(os.path.join(UPLOAD_FOLDER, 'videos'), exist_ok=True)
    
    app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
    app.config['MAX_CONTENT_LENGTH'] = 50 * 1024 * 1024
    
    ALLOWED_IMAGE_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'webp'}
    ALLOWED_VIDEO_EXTENSIONS = {'mp4', 'mov', 'avi', 'webm'}
    
    jwt = JWTManager(app)
    db.init_app(app)
    
    # JWT Error Handlers - return 401 instead of 500 for expired/invalid tokens
    @jwt.expired_token_loader
    def expired_token_callback(jwt_header, jwt_payload):
        return jsonify({
            'success': False,
            'error': 'Token has expired',
            'message': 'Please log in again'
        }), 401
    
    @jwt.invalid_token_loader
    def invalid_token_callback(error):
        return jsonify({
            'success': False,
            'error': 'Invalid token',
            'message': 'Please log in again'
        }), 401
    
    @jwt.unauthorized_loader
    def missing_token_callback(error):
        return jsonify({
            'success': False,
            'error': 'Authorization required',
            'message': 'Please log in'
        }), 401
    
    @jwt.revoked_token_loader
    def revoked_token_callback(jwt_header, jwt_payload):
        return jsonify({
            'success': False,
            'error': 'Token has been revoked',
            'message': 'Please log in again'
        }), 401

    # Initialize Flask-RESTX API
    api = Api(
        app,
        version='1.0',
        title='Search Presentation API',
        description='Admin API',
        doc='/api/docs/',
        authorizations={
            'Bearer Auth': {
                'type': 'apiKey',
                'in': 'header',
                'name': 'Authorization'
            }
        },
        security='Bearer Auth'
    )
    
    # Configure Flask-RESTX to propagate JWT exceptions to Flask's error handlers
    app.config['PROPAGATE_EXCEPTIONS'] = True
    
    # Create namespaces
    auth_ns = Namespace('auth', description='Authentication operations')
    content_ns = Namespace('content', description='Content management operations')
    upload_ns = Namespace('upload', description='File upload operations')
    chat_ns = Namespace('chat', description='Chatbot operations')
    
    api.add_namespace(auth_ns, path='/api/auth')
    api.add_namespace(content_ns, path='/api/content')
    api.add_namespace(upload_ns, path='/api/upload')
    api.add_namespace(chat_ns, path='/api/chat')
    
    # Define models for Swagger
    login_model = api.model('Login', {
        'username': fields.String(required=True, description='Admin username'),
        'password': fields.String(required=True, description='Admin password')
    })
    
    content_model = api.model('ContentSection', {
        'section_key': fields.String(required=True, description='Section identifier'),
        'title': fields.String(description='Section title'),
        'subtitle': fields.String(description='Section subtitle'),
        'content': fields.String(description='Section content'),
        'image_url': fields.String(description='Image URL'),
        'video_url': fields.String(description='Video URL'),
        'bullet_points': fields.String(description='JSON array of bullet points')
    })
    
    feature_model = api.model('Feature', {
        'title': fields.String(required=True, description='Feature title'),
        'description': fields.String(required=True, description='Feature description'),
        'icon': fields.String(description='Feature icon'),
        'order': fields.Integer(description='Display order'),
        'is_active': fields.Boolean(description='Is feature active')
    })
    
    # ADD THIS NEW MODEL
    dynamic_section_model = api.model('DynamicSection', {
        'section_type': fields.String(required=True, description='Section type (future, cta, platform)'),
        'title': fields.String(required=True, description='Section title'),
        'description': fields.String(description='Section description'),
        'content': fields.String(description='Section content'),
        'image_url': fields.String(description='Image URL'),
        'video_url': fields.String(description='Video URL'),
        'icon': fields.String(description='Icon for display'),
        'display_order': fields.Integer(description='Display order'),
        'is_active': fields.Boolean(description='Is section active')
    })
    
    chat_model = api.model('ChatRequest', {
        'message': fields.String(required=True, description='User message'),
        'session_id': fields.String(description='Chat session ID'),
        'language': fields.String(description='Language code', enum=['en', 'fr'], default='en')
    })
    
    upload_parser = api.parser()
    upload_parser.add_argument('file', location='files', type=FileStorage, required=True, help='File to upload')
    upload_parser.add_argument('section_key', location='form', type=str, required=False, help='Section key for association')
    
    def allowed_file(filename, file_type='image'):
        allowed_extensions = ALLOWED_IMAGE_EXTENSIONS if file_type == 'image' else ALLOWED_VIDEO_EXTENSIONS
        return '.' in filename and filename.rsplit('.', 1)[1].lower() in allowed_extensions
    
    # ========== AUTH ENDPOINTS ==========
    @auth_ns.route('/login')
    class Login(Resource):
        @auth_ns.expect(login_model)
        def post(self):
            data = request.get_json()
            username = data.get('username')
            password = data.get('password')
            
            admin_user = AdminUser.query.filter_by(username=username).first()
            
            if admin_user and admin_user.check_password(password):
                access_token = create_access_token(identity=str(admin_user.id))
                return {
                    'access_token': access_token,
                    'username': admin_user.username,
                    'user_id': admin_user.id
                }, 200
            
            return {'message': 'Invalid credentials'}, 401
    
    @auth_ns.route('/verify')
    class Verify(Resource):
        @auth_ns.doc(security='Bearer Auth')
        @jwt_required()
        def get(self):
            current_user_id = get_jwt_identity()
            admin_user = AdminUser.query.get(current_user_id)
            
            if admin_user:
                return {
                    'authenticated': True,
                    'username': admin_user.username,
                    'user_id': admin_user.id
                }, 200
            
            return {'authenticated': False}, 401
    
    # ========== CONTENT ENDPOINTS ==========
    @content_ns.route('/')
    class ContentList(Resource):
        def get(self):
            sections = ContentSection.query.all()
            return [{
                'section_key': s.section_key,
                'title': s.title or '',
                'subtitle': s.subtitle or '',
                'content': s.content or '',
                'image_url': s.image_url or '',
                'video_url': s.video_url or '',
                'bullet_points': s.bullet_points or '[]',
                'updated_at': s.updated_at.isoformat() if s.updated_at else None
            } for s in sections], 200
    
    @content_ns.route('/<string:section_key>')
    class ContentItem(Resource):
        def get(self, section_key):
            section = ContentSection.query.filter_by(section_key=section_key).first()
            if section:
                return {
                    'section_key': section.section_key,
                    'title': section.title or '',
                    'subtitle': section.subtitle or '',
                    'content': section.content or '',
                    'image_url': section.image_url or '',
                    'video_url': section.video_url or '',
                    'bullet_points': section.bullet_points or '[]',
                    'updated_at': section.updated_at.isoformat() if section.updated_at else None
                }, 200
            
            return {
                'section_key': section_key,
                'title': '',
                'subtitle': '',
                'content': '',
                'image_url': '',
                'video_url': '',
                'bullet_points': '[]',
                'updated_at': None
            }, 200
        
        @content_ns.expect(content_model)
        @content_ns.doc(security='Bearer Auth')
        @jwt_required()
        def put(self, section_key):
            data = request.get_json()
            section = ContentSection.query.filter_by(section_key=section_key).first()
            
            if not section:
                section = ContentSection(section_key=section_key)
                db.session.add(section)
            
            # Handle None values
            section.title = data.get('title') or ''
            section.subtitle = data.get('subtitle') or ''
            section.content = data.get('content') or ''
            section.image_url = data.get('image_url') or ''
            section.video_url = data.get('video_url') or ''
            
            if 'bullet_points' in data:
                section.bullet_points = data['bullet_points']
            
            section.updated_at = datetime.utcnow()
            db.session.commit()
            
            return {
                'section_key': section.section_key,
                'title': section.title or '',
                'subtitle': section.subtitle or '',
                'content': section.content or '',
                'image_url': section.image_url or '',
                'video_url': section.video_url or '',
                'bullet_points': section.bullet_points or '[]',
                'updated_at': section.updated_at.isoformat()
            }, 200
    
    # ========== FEATURES ENDPOINTS ==========
    @content_ns.route('/features')
    class FeaturesList(Resource):
        def get(self):
            features = Feature.query.order_by(Feature.order, Feature.id).all()
            return [{
                'id': f.id,
                'title': f.title or '',
                'description': f.description or '',
                'icon': f.icon or '',
                'order': f.order or 0,
                'is_active': f.is_active if f.is_active is not None else True,
                'updated_at': f.updated_at.isoformat() if f.updated_at else None
            } for f in features], 200
        
        @content_ns.expect(feature_model)
        @content_ns.doc(security='Bearer Auth')
        @jwt_required()
        def post(self):
            data = request.get_json()
            
            if not data.get('title') or not data.get('description'):
                return {"error": "Title and description are required"}, 400
            
            feature = Feature(
                title=data.get('title', ''),
                description=data.get('description', ''),
                icon=data.get('icon', 'âœ¨'),
                order=data.get('order', 0),
                is_active=data.get('is_active', True)
            )
            
            db.session.add(feature)
            db.session.commit()
            
            return {
                'id': feature.id,
                'title': feature.title or '',
                'description': feature.description or '',
                'icon': feature.icon or '',
                'order': feature.order or 0,
                'is_active': feature.is_active,
                'updated_at': feature.updated_at.isoformat() if feature.updated_at else None
            }, 201
    
    @content_ns.route('/features/<int:feature_id>')
    class FeatureItem(Resource):
        @content_ns.expect(feature_model)
        @content_ns.doc(security='Bearer Auth')
        @jwt_required()
        def put(self, feature_id):
            data = request.get_json()
            feature = Feature.query.get(feature_id)
            
            if not feature:
                return {"error": "Feature not found"}, 404
            
            if 'title' in data:
                feature.title = data['title'] or ''
            if 'description' in data:
                feature.description = data['description'] or ''
            if 'icon' in data:
                feature.icon = data['icon'] or ''
            if 'order' in data:
                feature.order = data['order'] or 0
            if 'is_active' in data:
                feature.is_active = data['is_active']
            
            db.session.commit()
            
            return {
                'id': feature.id,
                'title': feature.title or '',
                'description': feature.description or '',
                'icon': feature.icon or '',
                'order': feature.order or 0,
                'is_active': feature.is_active,
                'updated_at': feature.updated_at.isoformat() if feature.updated_at else None
            }, 200
        
        @content_ns.doc(security='Bearer Auth')
        @jwt_required()
        def delete(self, feature_id):
            feature = Feature.query.get(feature_id)
            
            if not feature:
                return {"error": "Feature not found"}, 404
            
            db.session.delete(feature)
            db.session.commit()
            return {"message": "Feature deleted successfully"}, 200
    
    # ========== DYNAMIC SECTIONS ENDPOINTS (ADDED TO content_ns) ==========
    @content_ns.route('/dynamic-sections')
    class DynamicSectionsAPI(Resource):
        def get(self):
            """Get all dynamic sections or filter by type"""
            section_type = request.args.get('section_type', None)
            
            query = DynamicSection.query
            if section_type:
                query = query.filter_by(section_type=section_type)
            
            sections = query.filter_by(is_active=True).order_by(DynamicSection.display_order).all()
            
            return [{
                'id': ds.id,
                'section_type': ds.section_type,
                'title': ds.title or '',
                'description': ds.description or '',
                'content': ds.content or '',
                'image_url': ds.image_url or '',
                'video_url': ds.video_url or '',
                'icon': ds.icon or '',
                'display_order': ds.display_order or 0,
                'is_active': ds.is_active if ds.is_active is not None else True,
                'updated_at': ds.updated_at.isoformat() if ds.updated_at else None
            } for ds in sections], 200
        
        @content_ns.expect(dynamic_section_model)
        @content_ns.doc(security='Bearer Auth')
        @jwt_required()
        def post(self):
            """Create a new dynamic section"""
            data = request.get_json()
            
            if not data.get('section_type') or not data.get('title'):
                return {"error": "Section type and title are required"}, 400
            
            section = DynamicSection(
                section_type=data.get('section_type'),
                title=data.get('title', ''),
                description=data.get('description', ''),
                content=data.get('content', ''),
                image_url=data.get('image_url', ''),
                video_url=data.get('video_url', ''),
                icon=data.get('icon', '✨'),
                display_order=data.get('display_order', 0),
                is_active=data.get('is_active', True)
            )
            
            db.session.add(section)
            db.session.commit()
            
            return {
                'id': section.id,
                'section_type': section.section_type,
                'title': section.title or '',
                'description': section.description or '',
                'content': section.content or '',
                'image_url': section.image_url or '',
                'video_url': section.video_url or '',
                'icon': section.icon or '',
                'display_order': section.display_order or 0,
                'is_active': section.is_active,
                'updated_at': section.updated_at.isoformat() if section.updated_at else None
            }, 201
    
    @content_ns.route('/dynamic-sections/<int:section_id>')
    class DynamicSectionAPI(Resource):
        @content_ns.expect(dynamic_section_model)
        @content_ns.doc(security='Bearer Auth')
        @jwt_required()
        def put(self, section_id):
            """Update a dynamic section"""
            data = request.get_json()
            section = DynamicSection.query.get(section_id)
            
            if not section:
                return {"error": "Section not found"}, 404
            
            if 'section_type' in data:
                section.section_type = data['section_type']
            if 'title' in data:
                section.title = data['title'] or ''
            if 'description' in data:
                section.description = data['description'] or ''
            if 'content' in data:
                section.content = data['content'] or ''
            if 'image_url' in data:
                section.image_url = data['image_url'] or ''
            if 'video_url' in data:
                section.video_url = data['video_url'] or ''
            if 'icon' in data:
                section.icon = data['icon'] or ''
            if 'display_order' in data:
                section.display_order = data['display_order'] or 0
            if 'is_active' in data:
                section.is_active = data['is_active']
            
            db.session.commit()
            
            return {
                'id': section.id,
                'section_type': section.section_type,
                'title': section.title or '',
                'description': section.description or '',
                'content': section.content or '',
                'image_url': section.image_url or '',
                'video_url': section.video_url or '',
                'icon': section.icon or '',
                'display_order': section.display_order or 0,
                'is_active': section.is_active,
                'updated_at': section.updated_at.isoformat() if section.updated_at else None
            }, 200
        
        @content_ns.doc(security='Bearer Auth')
        @jwt_required()
        def delete(self, section_id):
            """Delete a dynamic section"""
            section = DynamicSection.query.get(section_id)
            
            if not section:
                return {"error": "Section not found"}, 404
            
            db.session.delete(section)
            db.session.commit()
            return {"message": "Section deleted successfully"}, 200
    
    # ========== UPLOAD ENDPOINTS ==========
    @upload_ns.route('/image')
    class UploadImage(Resource):
        @upload_ns.expect(upload_parser)
        @upload_ns.doc(security='Bearer Auth')
        @jwt_required()
        def post(self):
            if 'file' not in request.files:
                return {'error': 'No file provided'}, 400
            
            file = request.files['file']
            section_key = request.form.get('section_key', '')
            
            if file.filename == '':
                return {'error': 'No file selected'}, 400
            
            if not allowed_file(file.filename, 'image'):
                return {'error': 'File type not allowed. Use: png, jpg, jpeg, gif, webp'}, 400
            
            file_extension = file.filename.rsplit('.', 1)[1].lower()
            unique_filename = f"{uuid.uuid4()}.{file_extension}"
            images_folder = os.path.join(app.config['UPLOAD_FOLDER'], 'images')
            os.makedirs(images_folder, exist_ok=True)
            file_path = os.path.join(images_folder, unique_filename)
            
            file.save(file_path)
            
            file_url = f"/uploads/images/{unique_filename}"
            
            media = Media(
                filename=file.filename,
                file_url=file_url,
                file_type='image',
                file_size=os.path.getsize(file_path),
                section_key=section_key if section_key else None
            )
            db.session.add(media)
            
            if section_key:
                section = ContentSection.query.filter_by(section_key=section_key).first()
                if section:
                    section.image_url = file_url
                    section.updated_at = datetime.utcnow()
            
            db.session.commit()
            
            return {
                'message': 'Image uploaded successfully',
                'url': file_url,
                'filename': unique_filename,
                'section_key': section_key
            }, 200
    
    @upload_ns.route('/video')
    class UploadVideo(Resource):
        @upload_ns.expect(upload_parser)
        @upload_ns.doc(security='Bearer Auth')
        @jwt_required()
        def post(self):
            if 'file' not in request.files:
                return {'error': 'No file provided'}, 400
            
            file = request.files['file']
            section_key = request.form.get('section_key', '')
            
            if file.filename == '':
                return {'error': 'No file selected'}, 400
            
            if not allowed_file(file.filename, 'video'):
                return {'error': 'File type not allowed. Use: mp4, mov, avi, webm'}, 400
            
            file_extension = file.filename.rsplit('.', 1)[1].lower()
            unique_filename = f"{uuid.uuid4()}.{file_extension}"
            videos_folder = os.path.join(app.config['UPLOAD_FOLDER'], 'videos')
            os.makedirs(videos_folder, exist_ok=True)
            file_path = os.path.join(videos_folder, unique_filename)
            
            file.save(file_path)
            
            file_url = f"/uploads/videos/{unique_filename}"
            
            media = Media(
                filename=file.filename,
                file_url=file_url,
                file_type='video',
                file_size=os.path.getsize(file_path),
                section_key=section_key if section_key else None
            )
            db.session.add(media)
            
            if section_key:
                section = ContentSection.query.filter_by(section_key=section_key).first()
                if section:
                    section.video_url = file_url
                    section.updated_at = datetime.utcnow()
            
            db.session.commit()
            
            return {
                'message': 'Video uploaded successfully',
                'url': file_url,
                'filename': unique_filename,
                'section_key': section_key
            }, 200
    
    # ========== CHATBOT ENDPOINT ==========
    @chat_ns.route('/')
    class Chat(Resource):
     @chat_ns.expect(chat_model)
     def post(self):
        try:
            data = request.get_json()
            user_message = data.get('message', '').strip()
            language = data.get('language', 'en')
            
            if not user_message:
                return {'error': 'Message is required'}, 400
            
            # Get intelligent response from chatbot
            bot_response = chatbot.get_response(user_message, language)
            
            # Save chat message to database
            try:
                chat_msg = ChatMessage(
                    session_id=data.get('session_id', f'session_{int(datetime.utcnow().timestamp())}'),
                    user_message=user_message,
                    bot_response=bot_response,
                    language=language
                )
                db.session.add(chat_msg)
                db.session.commit()
            except Exception as e:
                print(f"Chat save error: {e}")
            
            return {
                'response': bot_response,
                'session_id': data.get('session_id', f'session_{int(datetime.utcnow().timestamp())}'),
                'language': language,
                'timestamp': datetime.utcnow().isoformat()
            }, 200
            
        except Exception as e:
            print(f"Chat error: {e}")
            # Fallback response
            fallback = "👋 Hello! I'm the SearchEngine assistant." if language == 'en' else "👋 Bonjour ! Je suis l'assistant SearchEngine."
            return {
                'response': fallback,
                'session_id': f'session_{int(datetime.utcnow().timestamp())}',
                'language': language,
                'timestamp': datetime.utcnow().isoformat()
            }, 200
    # ========== SERVE UPLOADED FILES ==========
    @app.route('/uploads/<path:filename>')
    def serve_upload(filename):
        try:
            return send_from_directory(app.config['UPLOAD_FOLDER'], filename)
        except Exception as e:
            return {"error": "File not found"}, 404
    
    # ========== HEALTH CHECK ENDPOINT ==========
    @app.route('/api/health', methods=['GET'])
    def health_check():
        try:
            db.session.execute(text('SELECT 1'))
            db_status = 'Connected'
            
            section_count = ContentSection.query.count()
            feature_count = Feature.query.count()
            
            return jsonify({
                'status': 'healthy',
                'database': db_status,
                'timestamp': datetime.utcnow().isoformat(),
                'message': 'All systems operational',
                'service': 'SearchEngine Backend',
                'content_sections': section_count,
                'features': feature_count,
                'environment': app.config.get('ENV', 'development')
            }), 200
        except Exception as e:
            return jsonify({
                'status': 'error',
                'database': f'Disconnected: {str(e)}',
                'timestamp': datetime.utcnow().isoformat(),
                'message': 'Database connection failed',
                'content_sections': 0,
                'features': 0
            }), 500
    
    # ========== DASHBOARD STATS ENDPOINT ==========
    @app.route('/api/stats/dashboard', methods=['GET'])
    def dashboard_stats():
        try:
            # Database connection check
            db.session.execute(text('SELECT 1'))
            db_status = 'Connected'
            
            # Get counts
            section_count = ContentSection.query.count()
            feature_count = Feature.query.count()
            
            # Get most recent update time
            recent_section = ContentSection.query.order_by(ContentSection.updated_at.desc()).first()
            recent_feature = Feature.query.order_by(Feature.updated_at.desc()).first()
            
            last_updates = []
            if recent_section and recent_section.updated_at:
                last_updates.append(recent_section.updated_at)
            if recent_feature and recent_feature.updated_at:
                last_updates.append(recent_feature.updated_at)
            
            last_updated = max(last_updates) if last_updates else None
            
            # Get recent activities
            recent_sections = ContentSection.query.order_by(ContentSection.updated_at.desc()).limit(10).all()
            
            return jsonify({
                'status': 'healthy',
                'database': db_status,
                'timestamp': datetime.utcnow().isoformat(),
                'message': 'All systems operational',
                'counts': {
                    'content_sections': section_count,
                    'features': feature_count
                },
                'last_updated': last_updated.isoformat() if last_updated else None,
                'recent_updates': [
                    {
                        'section_key': section.section_key,
                        'title': section.title or f'Section: {section.section_key}',
                        'updated_at': section.updated_at.isoformat() if section.updated_at else None
                    }
                    for section in recent_sections
                ]
            }), 200
        except Exception as e:
            return jsonify({
                'status': 'error',
                'database': f'Disconnected: {str(e)}',
                'timestamp': datetime.utcnow().isoformat(),
                'message': 'Database connection failed',
                'counts': {
                    'content_sections': 0,
                    'features': 0
                },
                'last_updated': None,
                'recent_updates': []
            }), 500
    
    # ========== DATABASE INITIALIZATION ==========
    with app.app_context():
        print("\n" + "="*60)
        print("ðŸš€ INITIALIZING DATABASE: search_presentation")
        print("="*60)
        
        try:
            db.create_all()
            print("âœ… Database tables created/verified")
        except Exception as e:
            print(f"âš ï¸  Database error: {str(e)}")
        
        # Create uploads directory
        upload_folder = app.config['UPLOAD_FOLDER']
        if not os.path.exists(upload_folder):
            os.makedirs(upload_folder)
            print("âœ… Created uploads directory")
        
        # Create admin user if doesn't exist
        if AdminUser.query.count() == 0:
            admin = AdminUser(username='admin', email='admin@search-presentation.com')
            admin.set_password('admin123')
            db.session.add(admin)
            db.session.commit()
            print("âœ… Created admin user (admin/admin123)")
        else:
            print("âœ… Admin user already exists")
        
        # Check what sections exist
        sections = ContentSection.query.all()
        print(f"ðŸ”‹ Found {len(sections)} existing content sections")
        
        if sections:
            print("ðŸ”Š Existing sections (first 10):")
            for section in sections[:10]:
                title = section.title or "No title"
                # Safely display title
                if isinstance(title, str):
                    display_title = title[:30] + "..." if len(title) > 30 else title
                else:
                    display_title = "Invalid title"
                print(f"  â€¢ {section.section_key}: {display_title}")
        
        # Fix any sections with None values
        sections_to_fix = ContentSection.query.filter(
            (ContentSection.title == None) | 
            (ContentSection.title == '')
        ).all()
        
        if sections_to_fix:
            print(f"\nðŸ""§ Fixing {len(sections_to_fix)} sections with empty titles...")
            for section in sections_to_fix:
                default_title = section.section_key.replace('_', ' ').title()
                section.title = default_title
                print(f"  â€¢ Fixed '{section.section_key}' â†’ '{default_title}'")
            
            db.session.commit()
            print("âœ… Fixed empty titles")
        
        # Final stats
        section_count = ContentSection.query.count()
        feature_count = Feature.query.count()
        
        print(f"\nðŸ""Š Final database stats:")
        print(f"   â€¢ Content Sections: {section_count}")
        print(f"   â€¢ Features: {feature_count}")
        
        if section_count >= 15:
            print("âœ… Perfect! Database has all expected sections")
        else:
            print(f"âš ï¸  Database has {section_count} sections (expected 15)")
        
        print("="*60)
    
    return app

# Create app instance
app = create_app()


# ===== DYNAMIC SECTIONS ENDPOINTS =====
# KEEP THESE FOR BACKWARD COMPATIBILITY
@app.route('/api/dynamic-sections', methods=['GET'])
def get_all_dynamic_sections():
    """Get all dynamic sections (backward compatibility)"""
    sections = DynamicSection.query.filter_by(is_active=True).order_by(DynamicSection.display_order).all()
    return jsonify([{
        'id': ds.id,
        'section_type': ds.section_type,
        'title': ds.title or '',
        'description': ds.description or '',
        'content': ds.content or '',
        'image_url': ds.image_url or '',
        'video_url': ds.video_url or '',
        'icon': ds.icon or '',
        'display_order': ds.display_order or 0,
        'is_active': ds.is_active if ds.is_active is not None else True,
        'updated_at': ds.updated_at.isoformat() if ds.updated_at else None
    } for ds in sections])

@app.route('/api/vision-sections', methods=['GET'])
def get_vision_sections():
    """Get vision/future sections (backward compatibility)"""
    sections = DynamicSection.query.filter_by(section_type='future', is_active=True).order_by(DynamicSection.display_order).all()
    return jsonify([{
        'id': ds.id,
        'section_type': ds.section_type,
        'title': ds.title or '',
        'description': ds.description or '',
        'content': ds.content or '',
        'image_url': ds.image_url or '',
        'video_url': ds.video_url or '',
        'icon': ds.icon or '',
        'display_order': ds.display_order or 0,
        'is_active': ds.is_active if ds.is_active is not None else True,
        'updated_at': ds.updated_at.isoformat() if ds.updated_at else None
    } for ds in sections])

@app.route('/api/future-sections', methods=['GET'])
def get_future_sections():
    """Alias for vision sections (future = vision) (backward compatibility)"""
    sections = DynamicSection.query.filter_by(section_type='future', is_active=True).order_by(DynamicSection.display_order).all()
    return jsonify([{
        'id': ds.id,
        'section_type': ds.section_type,
        'title': ds.title or '',
        'description': ds.description or '',
        'content': ds.content or '',
        'image_url': ds.image_url or '',
        'video_url': ds.video_url or '',
        'icon': ds.icon or '',
        'display_order': ds.display_order or 0,
        'is_active': ds.is_active if ds.is_active is not None else True,
        'updated_at': ds.updated_at.isoformat() if ds.updated_at else None
    } for ds in sections])

@app.route('/api/cta-sections', methods=['GET'])
def get_cta_sections():
    """Get CTA sections (backward compatibility)"""
    sections = DynamicSection.query.filter_by(section_type='cta', is_active=True).order_by(DynamicSection.display_order).all()
    return jsonify([{
        'id': ds.id,
        'section_type': ds.section_type,
        'title': ds.title or '',
        'description': ds.description or '',
        'content': ds.content or '',
        'image_url': ds.image_url or '',
        'video_url': ds.video_url or '',
        'icon': ds.icon or '',
        'display_order': ds.display_order or 0,
        'is_active': ds.is_active if ds.is_active is not None else True,
        'updated_at': ds.updated_at.isoformat() if ds.updated_at else None
    } for ds in sections])

@app.route('/api/platform-sections', methods=['GET'])
def get_platform_sections():
    """Get platform sections (backward compatibility)"""
    sections = DynamicSection.query.filter_by(section_type='platform', is_active=True).order_by(DynamicSection.display_order).all()
    return jsonify([{
        'id': ds.id,
        'section_type': ds.section_type,
        'title': ds.title or '',
        'description': ds.description or '',
        'content': ds.content or '',
        'image_url': ds.image_url or '',
        'video_url': ds.video_url or '',
        'icon': ds.icon or '',
        'display_order': ds.display_order or 0,
        'is_active': ds.is_active if ds.is_active is not None else True,
        'updated_at': ds.updated_at.isoformat() if ds.updated_at else None
    } for ds in sections])




# ===== COMPREHENSIVE UPLOAD ENDPOINTS =====
@app.route('/api/upload', methods=['POST', 'OPTIONS'])
@jwt_required()
def universal_upload():
    """Universal upload endpoint for frontend compatibility"""
    if request.method == 'OPTIONS':
        response = jsonify({'success': True})
        response.headers.add('Access-Control-Allow-Origin', '*')
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type, Authorization')
        response.headers.add('Access-Control-Allow-Methods', 'POST, OPTIONS')
        return response
    
    try:
        if 'file' not in request.files:
            return jsonify({'success': False, 'error': 'No file provided'}), 400
        
        file = request.files['file']
        if file.filename == '':
            return jsonify({'success': False, 'error': 'No file selected'}), 400
        
        # Check file type
        filename = file.filename.lower()
        if any(filename.endswith(ext) for ext in ['.png', '.jpg', '.jpeg', '.gif', '.webp']):
            file_type = 'image'
            folder = 'images'
        elif any(filename.endswith(ext) for ext in ['.mp4', '.mov', '.avi', '.webm']):
            file_type = 'video'
            folder = 'videos'
        else:
            return jsonify({'success': False, 'error': 'File type not allowed'}), 400
        
        import uuid
        file_extension = filename.rsplit('.', 1)[1].lower()
        unique_filename = f"{uuid.uuid4()}.{file_extension}"
        
        # Save file
        import os
        upload_folder = os.path.join(current_app.config['UPLOAD_FOLDER'], folder)
        os.makedirs(upload_folder, exist_ok=True)
        file_path = os.path.join(upload_folder, unique_filename)
        file.save(file_path)
        
        file_url = f"/uploads/{folder}/{unique_filename}"
        
        # Save to database
        from models import Media
        media = Media(
            filename=file.filename,
            file_url=file_url,
            file_type=file_type,
            file_size=os.path.getsize(file_path),
            section_key=request.form.get('section_key', '')
        )
        db.session.add(media)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'url': file_url,
            'filename': unique_filename,
            'message': 'File uploaded successfully'
        }), 200
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

# ===== COMPREHENSIVE DELETE ENDPOINTS =====
@app.route('/api/dynamic-sections/<int:section_id>', methods=['DELETE', 'OPTIONS'])
@jwt_required()
def universal_delete_dynamic_section(section_id):
    """Universal delete endpoint for dynamic sections"""
    if request.method == 'OPTIONS':
        response = jsonify({'success': True})
        response.headers.add('Access-Control-Allow-Origin', '*')
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type, Authorization')
        response.headers.add('Access-Control-Allow-Methods', 'DELETE, OPTIONS')
        return response
    
    try:
        from models import DynamicSection
        section = DynamicSection.query.get(section_id)
        
        if not section:
            return jsonify({'success': False, 'error': 'Section not found'}), 404
        
        db.session.delete(section)
        db.session.commit()
        
        return jsonify({'success': True, 'message': 'Section deleted successfully'})
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/cta-sections/<int:section_id>', methods=['DELETE'])
@jwt_required()
def delete_cta_section_alias(section_id):
    """Alias for CTA section deletion"""
    return universal_delete_dynamic_section(section_id)

@app.route('/api/vision-sections/<int:section_id>', methods=['DELETE'])
@jwt_required()
def delete_vision_section_alias(section_id):
    """Alias for vision section deletion"""
    return universal_delete_dynamic_section(section_id)

# ===== FIXED RESPONSE FORMATS =====
# Ensure all responses have consistent format that frontend expects

@app.route('/api/content/sections/<string:section_key>', methods=['PUT'])
@jwt_required()
def update_section_universal(section_key):
    """Update endpoint with consistent response format"""
    try:
        data = request.get_json()
        section = ContentSection.query.filter_by(section_key=section_key).first()
        
        if not section:
            section = ContentSection(section_key=section_key)
            db.session.add(section)
        
        # Update fields
        if 'title' in data:
            section.title = data.get('title') or ''
        if 'content' in data:
            section.content = data.get('content') or ''
        if 'image_url' in data:
            section.image_url = data.get('image_url') or ''
        if 'video_url' in data:
            section.video_url = data.get('video_url') or ''
        if 'bullet_points' in data:
            section.bullet_points = data['bullet_points']
        
        section.updated_at = datetime.utcnow()
        db.session.commit()
        
        # Return response in format frontend expects
        return jsonify({
            'success': True,
            'message': 'Section updated successfully',
            'section': {
                'section_key': section.section_key,
                'title': section.title or '',
                'content': section.content or '',
                'image_url': section.image_url or '',
                'video_url': section.video_url or '',
                'bullet_points': section.bullet_points or '[]',
                'updated_at': section.updated_at.isoformat() if section.updated_at else None
            }
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'error': str(e)}), 500
if __name__ == '__main__':
    print("\n" + "="*60)
    print("ðŸš€ BACKEND SERVER STARTING")
    print("="*60)
    print("ðŸŒ URL: http://localhost:5000")
    print("ðŸ“š API Docs: http://localhost:5000/api/docs/")
    print("ðŸ’¾ Health: http://localhost:5000/api/health")
    print("ðŸ“Š Stats: http://localhost:5000/api/stats/dashboard")
    print("ðŸ” Admin: http://localhost:5000/api/auth/login")
    print("="*60 + "\n")
    
    app.run(debug=True, host='0.0.0.0', port=5000)
