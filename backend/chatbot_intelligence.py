# backend/chatbot_intelligence.py - FIXED PATTERN MATCHING
"""
Intelligent Chatbot for SearchEngine Platform
Handles questions in both English and French
IMPROVED: Better pattern matching with fuzzy detection
"""

import re
from datetime import datetime
class ChatbotIntelligence:
    def __init__(self):
        self.en_responses = self._load_english_responses()
        self.fr_responses = self._load_french_responses()
    
    def _load_english_responses(self):
        return {
            # Greetings
            'greetings': {
                'patterns': ['hello', 'hi', 'hey', 'good morning', 'good afternoon', 'good evening', 'greetings', 'goodmorning', 'goodafternoon'],
                'responses': [
                    "👋 Hello! I'm the SearchEngine assistant. How can I help you today?",
                    "Hi there! Welcome to SearchEngine. What would you like to know?",
                    "Hello! I'm here to answer your questions about SearchEngine."
                ]
            },
            
            # What is SearchEngine
            'what_is': {
                'patterns': ['what is searchengine', 'what is this', 'tell me about searchengine', 'what does searchengine', 'explain searchengine', 'about searchengine', 'searchengine is'],
                'responses': [
                    "SearchEngine is an advanced document management platform designed for Cameroonian national archives. It features:\n\n✨ AI-powered intelligent search\n🔒 Enterprise-grade security\n⚡ Bandwidth optimization\n📊 Workflow automation\n👥 Team collaboration tools\n\nIt transforms how administrations manage and access documents."
                ]
            },
            
            # Features
            'features': {
                'patterns': ['feature', 'what can', 'capabilities', 'function', 'what does it do', 'can it do'],
                'responses': [
                    "SearchEngine offers powerful features:\n\n🔍 **AI-Powered Search** - Intelligent full-text search with OCR\n⚡ **Bandwidth Optimized** - Smart page segmentation\n🔒 **Workflow Automation** - Customizable BPM engine\n🛡️ **Enterprise Security** - JWT auth & RBAC\n📁 **Document Management** - Complete lifecycle management\n👥 **Team Collaboration** - Real-time tracking & signatures"
                ]
            },
            
            # Search functionality
            'search': {
                'patterns': ['how to search', 'search document', 'find document', 'search feature', 'ai search', 'searching'],
                'responses': [
                    "Our AI-powered search is incredibly smart:\n\n✨ Searches across ALL document types (PDF, Word, Excel, etc.)\n🔍 Full-text search with OCR for scanned documents\n⚡ Fast results in milliseconds\n🎯 Filters by date, type, department\n🧠 Learns from context for better accuracy\n\nJust type what you're looking for, and our AI finds it!"
                ]
            },
            
            # Security
            'security': {
                'patterns': ['security', 'safe', 'secure', 'protection', 'encrypt', 'data protection', 'is it safe'],
                'responses': [
                    "Security is our top priority:\n\n🛡️ **Enterprise-grade encryption** (AES-256)\n🔐 **JWT authentication** for all API calls\n👥 **Role-based access control** (RBAC)\n🔑 **Hierarchical permissions** system\n📊 **Audit trails** for compliance\n💾 **Secure data storage** with PostgreSQL\n\nYour sensitive documents are protected at every level!"
                ]
            },
            
            # Bandwidth optimization
            'bandwidth': {
                'patterns': ['bandwidth', 'data usage', 'optimization', 'network', 'speed', 'fast', 'slow connection'],
                'responses': [
                    "Our bandwidth optimization is revolutionary:\n\n⚡ **Smart Segmentation** - Only sends relevant pages\n📉 **Reduces data transfer** by up to 80%\n🚀 **Faster loading** for large documents\n📱 **Works on slow connections**\n💡 **Intelligent caching** for frequently accessed docs\n\nPerfect for areas with limited internet!"
                ]
            },
            
            # Workflow automation
            'workflow': {
                'patterns': ['workflow', 'automation', 'approval', 'process', 'bpm', 'automate'],
                'responses': [
                    "Workflow automation streamlines your processes:\n\n📋 **Customizable workflows** for document approval\n✅ **Automatic validation** rules\n🔄 **Multi-step processes** with routing\n📧 **Email notifications** at each stage\n📊 **Progress tracking** dashboard\n⏱️ **Deadline management** and reminders\n\nAutomate repetitive tasks and boost efficiency!"
                ]
            },
            
            # Collaboration
            'collaboration': {
                'patterns': ['collaboration', 'team', 'share', 'sharing', 'collaborate', 'work together', 'together'],
                'responses': [
                    "Collaborate seamlessly with your team:\n\n👥 **Real-time collaboration** on documents\n💬 **Comments & annotations** directly on PDFs\n✍️ **Digital signatures** for approvals\n📊 **Activity tracking** - see who did what\n🔔 **Instant notifications** for updates\n📤 **Easy sharing** across departments\n\nWork together, anywhere, anytime!"
                ]
            },
            
            # Pricing / Cost
            'pricing': {
                'patterns': ['price', 'cost', 'how much', 'pricing', 'payment', 'subscription', 'pay'],
                'responses': [
                    "SearchEngine is currently deployed for Cameroonian government administrations.\n\nFor pricing information regarding:\n• Government deployment\n• Enterprise licensing\n• Custom installations\n\nPlease contact Tech Chantier directly for a customized quote based on your needs."
                ]
            },
            
            # Setup / Installation
            'setup': {
                'patterns': ['install', 'setup', 'deploy', 'implementation', 'how to start', 'get started', 'begin'],
                'responses': [
                    "Getting started with SearchEngine:\n\n1️⃣ **Consultation** - We assess your needs\n2️⃣ **Infrastructure Setup** - Docker deployment\n3️⃣ **Data Migration** - Import existing documents\n4️⃣ **User Training** - Comprehensive onboarding\n5️⃣ **Go Live** - Full support during launch\n\n⏱️ Typical deployment: 2-4 weeks\n\nContact Tech Chantier for a deployment plan!"
                ]
            },
            
            # Support
            'support': {
                'patterns': ['support', 'help', 'assistance', 'contact', 'reach', 'need help'],
                'responses': [
                    "Need help? We're here for you:\n\n📧 **Email**: support@searchengine.cm\n📞 **Phone**: +237 XXX XXX XXX\n💬 **Live Chat**: Right here!\n📚 **Documentation**: Available in admin panel\n🎓 **Training**: Comprehensive user guides\n\nOur support team responds within 24 hours!"
                ]
            },
            
            # Languages
            'languages': {
                'patterns': ['language', 'french', 'english', 'bilingual', 'translation', 'translate'],
                'responses': [
                    "SearchEngine is fully bilingual:\n\n🇬🇧 **English** - Complete interface\n🇫🇷 **French** - Interface entièrement traduite\n🌍 **Seamless switching** - Toggle anytime\n📝 **Both languages** for all features\n\nClick the language switcher at the top!"
                ]
            },
            
            # Future features
            'future': {
                'patterns': ['coming soon', 'future', 'roadmap', 'upcoming', 'planned', 'next'],
                'responses': [
                    "Exciting features coming soon:\n\n🌐 **AI Semantic Search** - Contextual understanding\n📝 **Digital Signatures** - Legal authenticity\n🎤 **Voice Commands** - Hands-free search\n🔊 **Text-to-Speech** - Listen to documents\n✏️ **Real-time Annotations** - Collaborative markup\n🏛️ **National Deployment** - Federated network\n\nStay tuned for updates!"
                ]
            },
            
            # Document types
            'documents': {
                'patterns': ['document type', 'file type', 'format', 'pdf', 'word', 'excel', 'support'],
                'responses': [
                    "Supported document formats:\n\n📄 **PDF** - Including scanned documents\n📝 **Word** - .doc, .docx\n📊 **Excel** - .xls, .xlsx\n📑 **Text** - .txt, .rtf\n🖼️ **Images** - .jpg, .png (with OCR)\n📧 **Email** - .eml, .msg\n\nOur OCR technology reads scanned documents too!"
                ]
            },
            
            # Mobile
            'mobile': {
                'patterns': ['mobile', 'phone', 'smartphone', 'tablet', 'app', 'android', 'ios'],
                'responses': [
                    "SearchEngine is mobile-ready:\n\n📱 **Responsive Design** - Works on any device\n💻 **Web-based** - No app installation needed\n🔄 **Sync across devices** - Same data everywhere\n📶 **Offline mode** - Coming soon!\n\nAccess your documents from anywhere!"
                ]
            },
            
            # Performance
            'performance': {
                'patterns': ['performance', 'slow', 'speed', 'faster', 'optimization', 'quick'],
                'responses': [
                    "SearchEngine is built for speed:\n\n⚡ **Search results** in milliseconds\n🚀 **Optimized database** queries\n💾 **Smart caching** for frequently accessed data\n📉 **Bandwidth optimization** reduces load times\n🔧 **Regular performance** tuning\n\nExperience lightning-fast document access!"
                ]
            },
            
            # Thank you
            'thanks': {
                'patterns': ['thank', 'thanks', 'appreciate', 'merci', 'thx'],
                'responses': [
                    "You're very welcome! 😊",
                    "Happy to help! If you have more questions, just ask!",
                    "My pleasure! Feel free to ask anything else about SearchEngine."
                ]
            }
        }
    
    def _load_french_responses(self):
        return {
            # Salutations
            'greetings': {
                'patterns': ['bonjour', 'salut', 'bonsoir', 'bonne journée', 'hey', 'coucou', 'bjr'],
                'responses': [
                    "👋 Bonjour ! Je suis l'assistant SearchEngine. Comment puis-je vous aider aujourd'hui ?",
                    "Salut ! Bienvenue sur SearchEngine. Que souhaitez-vous savoir ?",
                    "Bonjour ! Je suis là pour répondre à vos questions sur SearchEngine."
                ]
            },
            
            # Qu'est-ce que SearchEngine
            'what_is': {
                'patterns': ["qu'est-ce que searchengine", "qu'est ce que searchengine", "ques ce que searchengine", "c'est quoi searchengine", 'parlez-moi de searchengine', 'expliquez searchengine', 'présentation searchengine', 'a propos de searchengine'],
                'responses': [
                    "SearchEngine est une plateforme avancée de gestion documentaire conçue pour les archives nationales camerounaises. Elle comprend :\n\n✨ Recherche intelligente avec IA\n🔒 Sécurité de niveau entreprise\n⚡ Optimisation de la bande passante\n📊 Automatisation des flux de travail\n👥 Outils de collaboration d'équipe\n\nElle transforme la façon dont les administrations gèrent et accèdent aux documents."
                ]
            },
            
            # Fonctionnalités
            'features': {
                'patterns': ['fonctionnalité', 'que fait', 'capacité', 'fonction', 'peut faire', 'possibilité'],
                'responses': [
                    "SearchEngine offre des fonctionnalités puissantes :\n\n🔍 **Recherche IA** - Recherche plein texte avec OCR\n⚡ **Optimisation** - Segmentation intelligente des pages\n🔒 **Automatisation** - Moteur BPM personnalisable\n🛡️ **Sécurité** - Authentification JWT & RBAC\n📁 **Gestion** - Cycle de vie complet des documents\n👥 **Collaboration** - Suivi temps réel & signatures"
                ]
            },
            
            # Recherche
            'search': {
                'patterns': ['comment chercher', 'rechercher', 'trouver document', 'recherche', 'chercher', 'comment rechercher'],
                'responses': [
                    "Notre recherche IA est incroyablement intelligente :\n\n✨ Recherche dans TOUS les types de documents (PDF, Word, Excel, etc.)\n🔍 Recherche plein texte avec OCR pour documents scannés\n⚡ Résultats rapides en millisecondes\n🎯 Filtres par date, type, département\n🧠 Apprend du contexte pour plus de précision\n\nTapez simplement ce que vous cherchez et notre IA le trouve !"
                ]
            },
            
            # Sécurité
            'security': {
                'patterns': ['sécurité', 'sûr', 'sécurisé', 'protection', 'chiffrement', 'données', 'securite', 'est-ce sécurisé', 'est ce securise'],
                'responses': [
                    "La sécurité est notre priorité absolue :\n\n🛡️ **Chiffrement** de niveau entreprise (AES-256)\n🔐 **Authentification JWT** pour tous les appels API\n👥 **Contrôle d'accès** basé sur les rôles (RBAC)\n🔑 **Système de permissions** hiérarchiques\n📊 **Pistes d'audit** pour la conformité\n💾 **Stockage sécurisé** avec PostgreSQL\n\nVos documents sensibles sont protégés à tous les niveaux !"
                ]
            },
            
            # Optimisation bande passante
            'bandwidth': {
                'patterns': ['bande passante', 'données', 'optimisation', 'réseau', 'vitesse', 'rapide', 'connexion lente'],
                'responses': [
                    "Notre optimisation de bande passante est révolutionnaire :\n\n⚡ **Segmentation intelligente** - Envoie uniquement les pages pertinentes\n📉 **Réduit le transfert** de données jusqu'à 80%\n🚀 **Chargement plus rapide** pour gros documents\n📱 **Fonctionne sur connexions lentes**\n💡 **Mise en cache intelligente** pour docs fréquents\n\nParfait pour les zones à internet limité !"
                ]
            },
            
            # Flux de travail
            'workflow': {
                'patterns': ['flux de travail', 'automatisation', 'approbation', 'processus', 'workflow', 'automatiser'],
                'responses': [
                    "L'automatisation des flux de travail simplifie vos processus :\n\n📋 **Flux personnalisables** pour approbation de documents\n✅ **Validation automatique** avec règles\n🔄 **Processus multi-étapes** avec routage\n📧 **Notifications email** à chaque étape\n📊 **Tableau de bord** de suivi\n⏱️ **Gestion des délais** et rappels\n\nAutomatisez les tâches répétitives et gagnez en efficacité !"
                ]
            },
            
            # Collaboration
            'collaboration': {
                'patterns': ['collaboration', 'équipe', 'partager', 'partage', 'collaborer', 'travailler ensemble', 'ensemble'],
                'responses': [
                    "Collaborez facilement avec votre équipe :\n\n👥 **Collaboration temps réel** sur les documents\n💬 **Commentaires & annotations** directement sur PDFs\n✍️ **Signatures numériques** pour approbations\n📊 **Suivi d'activité** - voyez qui a fait quoi\n🔔 **Notifications instantanées** des mises à jour\n📤 **Partage facile** entre départements\n\nTravaillez ensemble, n'importe où, n'importe quand !"
                ]
            },
            
            # Prix
            'pricing': {
                'patterns': ['prix', 'coût', 'combien', 'tarif', 'paiement', 'abonnement', 'cout'],
                'responses': [
                    "SearchEngine est actuellement déployé pour les administrations gouvernementales camerounaises.\n\nPour les informations tarifaires concernant :\n• Déploiement gouvernemental\n• Licence entreprise\n• Installations personnalisées\n\nVeuillez contacter Tech Chantier directement pour un devis adapté à vos besoins."
                ]
            },
            
            # Installation
            'setup': {
                'patterns': ['installer', 'installation', 'déployer', 'déploiement', 'commencer', 'débuter'],
                'responses': [
                    "Démarrage avec SearchEngine :\n\n1️⃣ **Consultation** - Nous évaluons vos besoins\n2️⃣ **Configuration** - Déploiement Docker\n3️⃣ **Migration données** - Import documents existants\n4️⃣ **Formation** - Intégration complète\n5️⃣ **Lancement** - Support pendant le déploiement\n\n⏱️ Déploiement typique : 2-4 semaines\n\nContactez Tech Chantier pour un plan de déploiement !"
                ]
            },
            
            # Support
            'support': {
                'patterns': ['support', 'aide', 'assistance', 'contact', 'joindre', 'besoin d\'aide', 'aidez-moi'],
                'responses': [
                    "Besoin d'aide ? Nous sommes là :\n\n📧 **Email** : support@searchengine.cm\n📞 **Téléphone** : +237 XXX XXX XXX\n💬 **Chat en direct** : Ici même !\n📚 **Documentation** : Disponible dans le panneau admin\n🎓 **Formation** : Guides utilisateurs complets\n\nNotre équipe répond sous 24 heures !"
                ]
            },
            
            # Langues
            'languages': {
                'patterns': ['langue', 'français', 'anglais', 'bilingue', 'traduction', 'traduire'],
                'responses': [
                    "SearchEngine est entièrement bilingue :\n\n🇬🇧 **Anglais** - Interface complète\n🇫🇷 **Français** - Interface entièrement traduite\n🌍 **Changement fluide** - Basculez à tout moment\n📝 **Les deux langues** pour toutes les fonctionnalités\n\nCliquez sur le sélecteur de langue en haut !"
                ]
            },
            
            # Fonctionnalités futures
            'future': {
                'patterns': ['bientôt', 'futur', 'prochainement', 'à venir', 'planifié', 'prochaine'],
                'responses': [
                    "Fonctionnalités passionnantes à venir :\n\n🌐 **Recherche sémantique IA** - Compréhension contextuelle\n📝 **Signatures numériques** - Authenticité légale\n🎤 **Commandes vocales** - Recherche mains libres\n🔊 **Synthèse vocale** - Écouter les documents\n✏️ **Annotations temps réel** - Marquage collaboratif\n🏛️ **Déploiement national** - Réseau fédéré\n\nRestez à l'écoute pour les mises à jour !"
                ]
            },
            
            # Types de documents
            'documents': {
                'patterns': ['types de document', 'format', 'fichier', 'pdf', 'word', 'excel', 'type de fichier'],
                'responses': [
                    "Formats de documents supportés :\n\n📄 **PDF** - Y compris documents scannés\n📝 **Word** - .doc, .docx\n📊 **Excel** - .xls, .xlsx\n📑 **Texte** - .txt, .rtf\n🖼️ **Images** - .jpg, .png (avec OCR)\n📧 **Email** - .eml, .msg\n\nNotre technologie OCR lit aussi les documents scannés !"
                ]
            },
            
            # Mobile
            'mobile': {
                'patterns': ['mobile', 'téléphone', 'smartphone', 'tablette', 'application', 'android', 'ios'],
                'responses': [
                    "SearchEngine est prêt pour le mobile :\n\n📱 **Design responsive** - Fonctionne sur tout appareil\n💻 **Basé web** - Pas d'installation d'app nécessaire\n🔄 **Synchronisation** - Mêmes données partout\n📶 **Mode hors ligne** - Bientôt disponible !\n\nAccédez à vos documents de n'importe où !"
                ]
            },
            
            # Performance
            'performance': {
                'patterns': ['performance', 'lent', 'vitesse', 'plus rapide', 'optimisation', 'rapide'],
                'responses': [
                    "SearchEngine est conçu pour la vitesse :\n\n⚡ **Résultats de recherche** en millisecondes\n🚀 **Requêtes optimisées** de base de données\n💾 **Mise en cache intelligente** pour données fréquentes\n📉 **Optimisation bande passante** réduit les temps de chargement\n🔧 **Optimisation régulière** des performances\n\nProfitez d'un accès ultra-rapide aux documents !"
                ]
            },
            
            # Merci
            'thanks': {
                'patterns': ['merci', 'merci beaucoup', 'remercie', 'thank'],
                'responses': [
                    "Je vous en prie ! 😊",
                    "Avec plaisir ! Si vous avez d'autres questions, n'hésitez pas !",
                    "C'est un plaisir ! N'hésitez pas à demander quoi que ce soit d'autre sur SearchEngine."
                ]
            }
        }
    
    def get_response(self, message, language='en'):
        """Get intelligent response based on message and language"""
        message_lower = message.lower().strip()
        
        # Remove accents for better French matching
        message_normalized = self._normalize_text(message_lower)
        
        # Determine language from message if not specified
        detected_lang = self._detect_language(message_normalized)
        if detected_lang:
            language = detected_lang
        
        responses = self.fr_responses if language == 'fr' else self.en_responses
        
        # Check each category
        for category, data in responses.items():
            patterns = data['patterns']
            for pattern in patterns:
                # Check if pattern exists in message
                if pattern in message_normalized or pattern in message_lower:
                    import random
                    return random.choice(data['responses'])
        
        # Default response based on language
        import random
        default_responses = responses.get('default', {
            'responses': [
                "I can help you with:\n\n🔍 **Features** - What SearchEngine can do\n🛡️ **Security** - How we protect your data\n⚡ **Search** - AI-powered document discovery\n👥 **Collaboration** - Team features\n📊 **Workflows** - Automation capabilities\n🌐 **Languages** - Bilingual support\n\nWhat would you like to know?" if language == 'en' else 
                "Je peux vous aider avec :\n\n🔍 **Fonctionnalités** - Ce que SearchEngine peut faire\n🛡️ **Sécurité** - Comment nous protégeons vos données\n⚡ **Recherche** - Découverte de documents par IA\n👥 **Collaboration** - Fonctionnalités d'équipe\n📊 **Flux de travail** - Capacités d'automatisation\n🌐 **Langues** - Support bilingue\n\nQue souhaitez-vous savoir ?"
            ]
        })
        return random.choice(default_responses['responses'])
    
    def _normalize_text(self, text):
        """Remove accents and normalize text for better matching"""
        # Simple accent removal for common French characters
        replacements = {
            'é': 'e', 'è': 'e', 'ê': 'e', 'ë': 'e',
            'à': 'a', 'â': 'a', 'ä': 'a',
            'ù': 'u', 'û': 'u', 'ü': 'u',
            'ô': 'o', 'ö': 'o',
            'î': 'i', 'ï': 'i',
            'ç': 'c',
            ''': '\'', ''': '\''
        }
        normalized = text
        for old, new in replacements.items():
            normalized = normalized.replace(old, new)
        return normalized
    
    def _detect_language(self, text):
        """Detect if message is in French"""
        french_indicators = [
            'bonjour', 'salut', 'merci', 'qu\'est', 'ques', 
            'parlez', 'expliquez', 'aide', 'besoin',
            'comment', 'pourquoi', 'quand', 'ou',
            'fonctionnalite', 'securite', 'recherche'
        ]
        
        # Check if any French indicator is in the text
        for indicator in french_indicators:
            if indicator in text:
                return 'fr'
        
        return None

# Singleton instance
chatbot = ChatbotIntelligence()