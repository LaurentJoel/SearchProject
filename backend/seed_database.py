# backend/seed_fresh.py - NEW FILE
import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from flask import Flask
from config import Config
from models import db, ContentSection, Feature, AdminUser, Media
import json

def create_seed_app():
    """Create app just for seeding"""
    app = Flask(__name__)
    app.config.from_object(Config)
    db.init_app(app)
    return app

def seed_fresh():
    """Seed fresh data without circular imports"""
    app = create_seed_app()
    
    with app.app_context():
        print("🌱 Seeding fresh database...")
        
        # Create all tables first
        db.create_all()
        print("📋 Created database tables")
        
        # Clean existing data first
        ContentSection.query.delete()
        print("🧹 Cleaned existing sections")
        
        # Seed all content sections
        sections = [
            # Hero Section
            {
                'section_key': 'hero',
                'title': 'Intelligent Search for Modern Administration',
                'subtitle': 'Enterprise Document Intelligence',
                'content': 'Advanced document management platform transforming Cameroonian national archives with AI-powered search, automated workflows, and enterprise-grade security.',
                'image_url': '',
                'video_url': '',
                'bullet_points': '[]'
            },
            # Features Section Header
            {
                'section_key': 'features',
                'title': 'Enterprise-Grade Features',
                'subtitle': 'Comprehensive document management solution designed for modern administration needs',
                'content': '',
                'image_url': '',
                'video_url': '',
                'bullet_points': '[]'
            },
            # Platform Sections
            {
                'section_key': 'platform',
                'title': 'Platform Experience',
                'subtitle': 'Clean, intuitive design built for efficient document management',
                'content': 'Experience our platform through interactive demos and screenshots showcasing AI-powered search, workflow automation, and enterprise security features.',
                'image_url': '',
                'video_url': '',
                'bullet_points': '[]'
            },
            {
                'section_key': 'platform_welcome',
                'title': 'Welcome Interface',
                'subtitle': 'User-friendly login and dashboard',
                'content': 'Experience our intuitive welcome interface with easy navigation and quick access to all features.',
                'image_url': '',
                'video_url': '',
                'bullet_points': '[]'
            },
            {
                'section_key': 'platform_search',
                'title': 'AI-Powered Search',
                'subtitle': 'Intelligent document search interface',
                'content': 'Advanced search interface with AI-powered suggestions and filters for finding documents instantly.',
                'image_url': '',
                'video_url': '',
                'bullet_points': '[]'
            },
            {
                'section_key': 'platform_dashboard',
                'title': 'Dashboard Overview',
                'subtitle': 'Comprehensive analytics dashboard',
                'content': 'Centralized dashboard showing document statistics, user activity, and system performance metrics.',
                'image_url': '',
                'video_url': '',
                'bullet_points': '[]'
            },
            # Video Demo Section
            {
                'section_key': 'video',
                'title': 'See It In Action',
                'subtitle': 'Watch how SearchEngine transforms document management with intelligent workflows',
                'content': 'Add your demo video to showcase the platform\'s features and user experience',
                'image_url': '',
                'video_url': '',
                'bullet_points': '[]'
            },
            # Future Section
            {
                'section_key': 'future',
                'title': 'The Future is Bright',
                'subtitle': 'Exciting features coming soon to make SearchEngine even more powerful',
                'content': 'We\'re committed to evolving SearchEngine with cutting-edge features that meet the changing needs of modern administrations',
                'image_url': '',
                'video_url': '',
                'bullet_points': '[]'
            },
            # CTA Section
            {
                'section_key': 'cta',
                'title': 'Modernizing Cameroonian Administration',
                'subtitle': '',
                'content': 'SearchEngine represents a major contribution to digital transformation, revolutionizing national documentary archive management with cutting-edge technology and innovation.',
                'image_url': '',
                'video_url': '',
                'bullet_points': '[]'
            },
            # NEW: Welcome & Authentication Section
            {
                'section_key': 'welcome_auth',
                'title': 'Welcome & Authentication',
                'subtitle': 'Professional login interface with secure access controls and intuitive user experience.',
                'content': '',
                'image_url': '',
                'video_url': '',
                'bullet_points': json.dumps([
                    'Clean, professional welcome screen',
                    'Secure authentication system',
                    'Role-based access control',
                    'User-friendly interface design'
                ])
            },
            # NEW: Intelligent Search Interface Section
            {
                'section_key': 'intelligent_search',
                'title': 'Intelligent Search Interface',
                'subtitle': 'Advanced search functionality with AI-powered document discovery across all formats.',
                'content': '',
                'image_url': '',
                'video_url': '',
                'bullet_points': json.dumps([
                    'Full-text search across all document types',
                    'Integrated OCR technology',
                    'Smart bandwidth optimization',
                    'Real-time search results'
                ])
            },
            # NEW: Dashboard & Management Section
            {
                'section_key': 'dashboard_management',
                'title': 'Dashboard & Management',
                'subtitle': 'Comprehensive dashboard for document workflows, progress tracking, and team collaboration.',
                'content': '',
                'image_url': '',
                'video_url': '',
                'bullet_points': json.dumps([
                    'Document workflow management',
                    'Real-time progress monitoring',
                    'Team collaboration tools',
                    'Administrative controls'
                ])
            },
            # NEW: Advanced Features Section
            {
                'section_key': 'advanced_features',
                'title': 'Advanced Features',
                'subtitle': 'Next-generation document management capabilities',
                'content': '',
                'image_url': '',
                'video_url': '',
                'bullet_points': json.dumps([
                    'AI-powered query understanding beyond keyword matching',
                    'Digital certificates for legal authenticity',
                    'Voice search for improved accessibility',
                    'Audio document reading for hands-free consultation',
                    'Real-time PDF annotations and comments',
                    'Federated network for Cameroonian administrations'
                ])
            },
            # NEW: Secure & Reliable Section
            {
                'section_key': 'secure_reliable',
                'title': 'Secure & Reliable',
                'subtitle': 'Enterprise-grade security for sensitive documents',
                'content': '',
                'image_url': '',
                'video_url': '',
                'bullet_points': json.dumps([
                    'Enterprise-grade security for sensitive documents',
                    'Intelligent bandwidth optimization technology',
                    'Seamless collaboration across departments'
                ])
            },
            # NEW: Footer Section
            {
                'section_key': 'footer',
                'title': 'SearchEngine',
                'subtitle': 'Transforming national archive management for Cameroonian administration',
                'content': '© 2025 SearchEngine. All rights reserved.',
                'image_url': '',
                'video_url': '',
                'bullet_points': '[]'
            }
        ]
        
        for section_data in sections:
            section = ContentSection(**section_data)
            db.session.add(section)
        
        db.session.commit()
        print(f"✅ Created {len(sections)} content sections")
        
        # Seed features if needed
        if Feature.query.count() == 0:
            print("✨ Seeding features...")
            
            features = [
                {
                    'title': 'AI-Powered Search',
                    'description': 'Intelligent full-text search across all document types with integrated OCR technology',
                    'icon': '⚡',
                    'order': 1,
                    'is_active': True
                },
                {
                    'title': 'Bandwidth Optimized',
                    'description': 'Smart segmentation delivers only relevant pages, reducing data transfer significantly',
                    'icon': '🎯',
                    'order': 2,
                    'is_active': True
                },
                {
                    'title': 'Workflow Automation',
                    'description': 'Customizable BPM engine for document validation and approval processes',
                    'icon': '🔒',
                    'order': 3,
                    'is_active': True
                },
                {
                    'title': 'Enterprise Security',
                    'description': 'JWT authentication, hierarchical roles, and granular RBAC permissions',
                    'icon': '🌍',
                    'order': 4,
                    'is_active': True
                },
                {
                    'title': 'Document Management',
                    'description': 'Complete document lifecycle management with metadata and version control',
                    'icon': '💡',
                    'order': 5,
                    'is_active': True
                },
                {
                    'title': 'Team Collaboration',
                    'description': 'Seamless collaboration with comments, digital signatures, and real-time tracking',
                    'icon': '📱',
                    'order': 6,
                    'is_active': True
                }
            ]
            
            for feature_data in features:
                feature = Feature(**feature_data)
                db.session.add(feature)
            
            db.session.commit()
            print(f"✅ Created {len(features)} features")
        
        # Verify
        all_sections = ContentSection.query.all()
        print(f"\n📋 VERIFICATION - Total sections: {len(all_sections)}")
        for section in all_sections:
            print(f"  • {section.section_key}: '{section.title[:30]}...'")
        
        print("\n🎉 Fresh seeding completed successfully!")

if __name__ == '__main__':
    seed_fresh()