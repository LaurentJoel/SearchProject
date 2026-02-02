from app import create_app
from models import db, DynamicSection
from datetime import datetime

app = create_app()

with app.app_context():
    print("🌱 Seeding dynamic sections data...")
    
    # Check if we already have data
    existing_count = DynamicSection.query.count()
    print(f"📊 Existing dynamic sections: {existing_count}")
    
    if existing_count == 0:
        # Seed future/vision sections
        future_sections = [
            {
                'section_type': 'future',
                'title': 'AI-Powered Semantic Search',
                'description': 'Beyond keyword matching with contextual understanding',
                'content': 'Our AI learns from document context to provide more accurate search results',
                'icon': '🌐',
                'display_order': 1,
                'is_active': True
            },
            {
                'section_type': 'future',
                'title': 'Digital Signatures & Certificates',
                'description': 'Legal authenticity for digital documents',
                'content': 'Add legally-binding digital signatures and certificates to your documents',
                'icon': '📝',
                'display_order': 2,
                'is_active': True
            },
            {
                'section_type': 'future',
                'title': 'Voice Search & Commands',
                'description': 'Hands-free document access and control',
                'content': 'Use voice commands to search and navigate through documents',
                'icon': '🎤',
                'display_order': 3,
                'is_active': True
            },
            {
                'section_type': 'future',
                'title': 'Text-to-Speech Conversion',
                'description': 'Listen to documents instead of reading them',
                'content': 'Convert any document to audio for accessibility and convenience',
                'icon': '🔊',
                'display_order': 4,
                'is_active': True
            },
            {
                'section_type': 'future',
                'title': 'Real-time Annotations',
                'description': 'Collaborative document markup and comments',
                'content': 'Add comments, highlights, and annotations in real-time with team members',
                'icon': '✏️',
                'display_order': 5,
                'is_active': True
            },
            {
                'section_type': 'future',
                'title': 'National Deployment',
                'description': 'Federated network for administrations',
                'content': 'Scale to national level with federated architecture',
                'icon': '🏛️',
                'display_order': 6,
                'is_active': True
            }
        ]
        
        # Seed CTA sections
        cta_sections = [
            {
                'section_type': 'cta',
                'title': 'Enterprise Security',
                'description': 'Military-grade encryption for sensitive documents',
                'content': 'Your data is protected with AES-256 encryption and secure protocols',
                'icon': '🛡️',
                'display_order': 1,
                'is_active': True
            },
            {
                'section_type': 'cta',
                'title': 'Lightning Fast',
                'description': 'Optimized search results in milliseconds',
                'content': 'Our optimized algorithms deliver results faster than traditional search',
                'icon': '⚡',
                'display_order': 2,
                'is_active': True
            },
            {
                'section_type': 'cta',
                'title': 'Team Collaboration',
                'description': 'Seamless workflow across departments',
                'content': 'Share, comment, and collaborate on documents in real-time',
                'icon': '👥',
                'display_order': 3,
                'is_active': True
            }
        ]
        
        # Seed platform sections
        platform_sections = [
            {
                'section_type': 'platform',
                'title': 'Welcome & Authentication',
                'description': 'Secure login and user management',
                'content': 'Professional interface with role-based access control',
                'icon': '🚪',
                'display_order': 1,
                'is_active': True
            },
            {
                'section_type': 'platform',
                'title': 'Intelligent Search Dashboard',
                'description': 'AI-powered document discovery',
                'content': 'Advanced search with filters, tags, and intelligent suggestions',
                'icon': '🔍',
                'display_order': 2,
                'is_active': True
            },
            {
                'section_type': 'platform',
                'title': 'Workflow Management',
                'description': 'Automated document processing',
                'content': 'Create custom workflows for document approval and processing',
                'icon': '📊',
                'display_order': 3,
                'is_active': True
            }
        ]
        
        # Add all sections
        all_sections = future_sections + cta_sections + platform_sections
        
        for section_data in all_sections:
            section = DynamicSection(**section_data)
            db.session.add(section)
        
        db.session.commit()
        print(f"✅ Seeded {len(all_sections)} dynamic sections")
    else:
        print("✅ Dynamic sections already exist, skipping seed")
    
    print("🎉 Seed completed!")