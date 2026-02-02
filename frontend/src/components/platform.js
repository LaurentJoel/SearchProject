import React, { useState, useEffect, useMemo } from 'react';
import { CheckCircle, Search, Workflow, LogIn, ChevronLeft, ChevronRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useContent } from '../context/ContentContext';
import {
  getTranslations,
  getTranslationValue,
  buildReverseTranslationMap,
  translateMaybe
} from '../utils/translation';
import { getBackendResourceUrl } from '../utils/backend';

export default function Platform() {
  const { isFrench } = useLanguage();
  const { content, loading } = useContent();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [imageErrors, setImageErrors] = useState({});

  const translations = getTranslations(isFrench);
  const t = (key, defaultValue = '') => getTranslationValue(translations, key, defaultValue);

  const reverseMap = useMemo(() => buildReverseTranslationMap(), []);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const welcomeAuth = content.welcome_auth || {};
  const intelligentSearch = content.intelligent_search || {};
  const dashboardManagement = content.dashboard_management || {};

  const FALLBACK_IMAGES = {
    welcome: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
    search: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80',
    dashboard: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=800&q=80'
  };

  const parseBullets = (bulletString) => {
    if (!bulletString) return [];
    try {
      if (Array.isArray(bulletString)) return bulletString;
      const parsed = JSON.parse(bulletString);
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      if (typeof bulletString === 'string') {
        return bulletString
          .split(/[,|\n]/)
          .map((item) => item.trim())
          .filter((item) => item.length > 0);
      }
      return [];
    }
  };

  const translateBullets = (bullets, fallbackBullets) => {
    const list = Array.isArray(bullets) && bullets.length ? bullets : fallbackBullets || [];
    return list.map((b) => translateMaybe(b, isFrench, reverseMap, b));
  };

  const sectionsToDisplay = [
    {
      id: 'welcome',
      icon: <LogIn className="w-6 h-6" />,
      title: translateMaybe(
        welcomeAuth.title,
        isFrench,
        reverseMap,
        t('platform.welcome.title', 'Welcome & Authentication')
      ),
      description: translateMaybe(
        welcomeAuth.subtitle,
        isFrench,
        reverseMap,
        t('platform.welcome.description', 'Professional login interface with secure access controls and intuitive user experience.')
      ),
      features: translateBullets(
        parseBullets(welcomeAuth.bullet_points),
        t('platform.welcome.features', [
          'Clean, professional welcome screen',
          'Secure authentication system',
          'Role-based access control',
          'User-friendly interface design'
        ])
      ),
      imageUrl: getBackendResourceUrl(welcomeAuth.image_url),
      fallbackImage: FALLBACK_IMAGES.welcome,
      color: 'from-blue-500 to-blue-600'
    },
    {
      id: 'search',
      icon: <Search className="w-6 h-6" />,
      title: translateMaybe(
        intelligentSearch.title,
        isFrench,
        reverseMap,
        t('platform.search.title', 'Intelligent Search Interface')
      ),
      description: translateMaybe(
        intelligentSearch.subtitle,
        isFrench,
        reverseMap,
        t('platform.search.description', 'Advanced search functionality with AI-powered document discovery across all formats.')
      ),
      features: translateBullets(
        parseBullets(intelligentSearch.bullet_points),
        t('platform.search.features', [
          'Full-text search across all document types',
          'Integrated OCR technology',
          'Smart bandwidth optimization',
          'Real-time search results'
        ])
      ),
      imageUrl: getBackendResourceUrl(intelligentSearch.image_url),
      fallbackImage: FALLBACK_IMAGES.search,
      color: 'from-green-500 to-emerald-600'
    },
    {
      id: 'dashboard',
      icon: <Workflow className="w-6 h-6" />,
      title: translateMaybe(
        dashboardManagement.title,
        isFrench,
        reverseMap,
        t('platform.dashboard.title', 'Dashboard & Management')
      ),
      description: translateMaybe(
        dashboardManagement.subtitle,
        isFrench,
        reverseMap,
        t('platform.dashboard.description', 'Comprehensive dashboard for document workflows, progress tracking, and team collaboration.')
      ),
      features: translateBullets(
        parseBullets(dashboardManagement.bullet_points),
        t('platform.dashboard.features', [
          'Document workflow management',
          'Real-time progress monitoring',
          'Team collaboration tools',
          'Administrative controls'
        ])
      ),
      imageUrl: getBackendResourceUrl(dashboardManagement.image_url),
      fallbackImage: FALLBACK_IMAGES.dashboard,
      color: 'from-purple-500 to-purple-600'
    }
  ];

  const handleImageError = (sectionId) => setImageErrors((prev) => ({ ...prev, [sectionId]: true }));

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % sectionsToDisplay.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + sectionsToDisplay.length) % sectionsToDisplay.length);

  if (loading) {
    return (
      <section id="platform" className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto" />
          <p className="mt-4 text-gray-600">{t('platform.loading', 'Loading platform...')}</p>
        </div>
      </section>
    );
  }

  const headerTitle = translateMaybe(
    content.platform?.title,
    isFrench,
    reverseMap,
    t('platform.title', 'Platform Experience')
  );

  const headerSubtitle = translateMaybe(
    content.platform?.subtitle,
    isFrench,
    reverseMap,
    t('platform.subtitle', 'Clean, intuitive design built for efficient document management')
  );

  return (
    <section id="platform" className="py-16 sm:py-20 md:py-24 px-4 sm:px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className={`text-center mb-12 md:mb-16 transition-all duration-700 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-100 to-emerald-100 rounded-full text-green-700 text-sm font-medium mb-4">
            {t('platform.tagline', 'Professional Interface')}
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">{headerTitle}</h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">{headerSubtitle}</p>
        </div>

        <div className="hidden lg:block space-y-20">
          {sectionsToDisplay.map((section, index) => (
            <div
              key={section.id}
              className={`grid lg:grid-cols-2 gap-12 items-center transition-all duration-700 ${
                isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
              }`}
              style={{ transitionDelay: `${index * 200}ms` }}
            >
              <div className={`space-y-6 ${index % 2 === 1 ? 'lg:order-2' : ''}`}>
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-14 h-14 bg-gradient-to-br ${section.color} rounded-xl flex items-center justify-center text-white shadow-lg transform hover:scale-110 transition-transform duration-300`}>
                    {section.icon}
                  </div>
                  <h3 className="text-3xl font-bold text-gray-900">{section.title}</h3>
                </div>

                <p className="text-lg text-gray-600 leading-relaxed">{section.description}</p>

                {Array.isArray(section.features) && section.features.length > 0 && (
                  <div className="space-y-3 pt-4">
                    {section.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-start gap-3 group">
                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform duration-300" />
                        <span className="text-gray-700 group-hover:text-emerald-600 transition-colors">{feature}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className={`relative ${index % 2 === 1 ? 'lg:order-1' : ''}`}>
                <div className="relative group">
                  <div className={`absolute -inset-2 bg-gradient-to-r ${section.color} rounded-xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity duration-500`} />

                  <div className="relative aspect-video bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl overflow-hidden border-2 border-gray-200 shadow-xl group-hover:shadow-2xl transition-all duration-300">
                    {section.imageUrl && !imageErrors[section.id] ? (
                      <img
                        src={section.imageUrl}
                        alt={section.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={() => handleImageError(section.id)}
                      />
                    ) : (
                      <img
                        src={section.fallbackImage}
                        alt={section.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="lg:hidden relative">
          <div className="overflow-hidden rounded-xl">
            <div className="flex transition-transform duration-500 ease-in-out" style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
              {sectionsToDisplay.map((section) => (
                <div key={section.id} className="w-full flex-shrink-0 px-2">
                  <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-lg">
                    <div className="flex items-center gap-3 mb-4">
                      <div className={`w-12 h-12 bg-gradient-to-br ${section.color} rounded-lg flex items-center justify-center text-white`}>
                        {section.icon}
                      </div>
                      <h3 className="text-xl font-bold text-gray-900">{section.title}</h3>
                    </div>

                    <p className="text-gray-600 mb-4">{section.description}</p>

                    {Array.isArray(section.features) && section.features.length > 0 && (
                      <div className="space-y-2 mb-6">
                        {section.features.map((feature, featureIndex) => (
                          <div key={featureIndex} className="flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                            <span className="text-gray-700 text-sm">{feature}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="aspect-video bg-gradient-to-br from-slate-50 to-slate-100 rounded-lg overflow-hidden border border-gray-200">
                      {section.imageUrl && !imageErrors[section.id] ? (
                        <img
                          src={section.imageUrl}
                          alt={section.title}
                          className="w-full h-full object-cover"
                          onError={() => handleImageError(section.id)}
                        />
                      ) : (
                        <img src={section.fallbackImage} alt={section.title} className="w-full h-full object-cover" />
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-center gap-4 mt-6">
            <button
              onClick={prevSlide}
              className="p-3 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full shadow-md hover:shadow-lg transition-all hover:scale-110 active:scale-95"
              aria-label={t('common.previous', 'Previous')}
            >
              <ChevronLeft className="w-5 h-5 text-emerald-600" />
            </button>

            <div className="flex gap-2">
              {sectionsToDisplay.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentSlide(idx)}
                  className={`h-2 rounded-full transition-all ${idx === currentSlide ? 'bg-emerald-600 w-8' : 'bg-emerald-200 w-2 hover:bg-emerald-300'}`}
                  aria-label={`${t('common.slide', 'Slide')} ${idx + 1}`}
                />
              ))}
            </div>

            <button
              onClick={nextSlide}
              className="p-3 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full shadow-md hover:shadow-lg transition-all hover:scale-110 active:scale-95"
              aria-label={t('common.next', 'Next')}
            >
              <ChevronRight className="w-5 h-5 text-emerald-600" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
