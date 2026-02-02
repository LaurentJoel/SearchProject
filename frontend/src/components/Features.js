import React, { useState, useEffect, useMemo } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useContent } from '../context/ContentContext';
import {
  getTranslations,
  getTranslationValue,
  buildReverseTranslationMap,
  translateMaybe
} from '../utils/translation';
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';

export default function Features() {
  const { isFrench } = useLanguage();
  const { content, loading, error } = useContent();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  const translations = getTranslations(isFrench);
  const t = (key, defaultValue = '') => getTranslationValue(translations, key, defaultValue);

  const reverseMap = useMemo(() => buildReverseTranslationMap(), []);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const fallbackItems = [
    {
      icon: '🔍',
      title: t('features.aiSearch', 'AI-Powered Search'),
      description: t('features.aiSearchDesc', 'Intelligent full-text search across all document types with integrated OCR technology'),
      color: 'from-green-100 to-emerald-50'
    },
    {
      icon: '⚡',
      title: t('features.bandwidthOptimized', 'Bandwidth Optimized'),
      description: t('features.bandwidthOptimizedDesc', 'Smart segmentation delivers only relevant pages, reducing data transfer significantly'),
      color: 'from-emerald-100 to-green-50'
    },
    {
      icon: '📊',
      title: t('features.workflowAutomation', 'Workflow Automation'),
      description: t('features.workflowAutomationDesc', 'Customizable BPM engine for document validation and approval processes'),
      color: 'from-teal-100 to-emerald-50'
    },
    {
      icon: '🛡️',
      title: t('features.enterpriseSecurity', 'Enterprise Security'),
      description: t('features.enterpriseSecurityDesc', 'JWT authentication, hierarchical roles, and granular RBAC permissions'),
      color: 'from-green-50 to-emerald-100'
    },
    {
      icon: '📄',
      title: t('features.documentManagement', 'Document Management'),
      description: t('features.documentManagementDesc', 'Complete document lifecycle management with metadata and version control'),
      color: 'from-emerald-50 to-teal-100'
    },
    {
      icon: '👥',
      title: t('features.teamCollaboration', 'Team Collaboration'),
      description: t('features.teamCollaborationDesc', 'Seamless collaboration with comments, digital signatures, and real-time tracking'),
      color: 'from-green-50 to-cyan-100'
    }
  ];

  const featuresData = content.featuresList || [];
  const displayItems =
    featuresData.length > 0
      ? featuresData.map((f, idx) => ({
          ...f,
          title: translateMaybe(f.title, isFrench, reverseMap, fallbackItems[idx]?.title || f.title),
          description: translateMaybe(f.description, isFrench, reverseMap, fallbackItems[idx]?.description || f.description),
          color: idx % 2 === 0 ? 'from-green-100 to-emerald-50' : 'from-emerald-50 to-green-100'
        }))
      : fallbackItems;

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % displayItems.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + displayItems.length) % displayItems.length);

  if (loading) {
    return (
      <section id="features" className="py-16 sm:py-20 md:py-24 px-4 sm:px-6 bg-gradient-to-b from-white to-green-50">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto" />
            <p className="mt-4 text-gray-600">{t('features.loading', 'Loading features...')}</p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="features" className="py-16 sm:py-20 md:py-24 px-4 sm:px-6 bg-gradient-to-b from-white to-green-50">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center text-red-600">
            <p>Error loading features: {error}</p>
          </div>
        </div>
      </section>
    );
  }

  const headerTitle = translateMaybe(
    content.features?.title,
    isFrench,
    reverseMap,
    t('features.title', 'Enterprise-Grade Features')
  );

  const headerSubtitle = translateMaybe(
    content.features?.subtitle,
    isFrench,
    reverseMap,
    t('features.subtitle', 'Comprehensive document management solution designed for modern administration needs')
  );

  return (
    <section id="features" className="py-16 sm:py-20 md:py-24 px-4 sm:px-6 bg-gradient-to-b from-white to-green-50">
      <div className="container mx-auto max-w-7xl">
        <div className={`text-center mb-12 md:mb-16 transition-all duration-700 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-100 to-emerald-100 rounded-full text-green-700 text-sm font-medium mb-4 shadow-sm">
            <Sparkles className="w-4 h-4" />
            {t('features.title', 'Enterprise-Grade Features')}
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">{headerTitle}</h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">{headerSubtitle}</p>
        </div>

        <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {displayItems.map((item, idx) => (
            <div
              key={item.id || idx}
              className={`group relative p-6 bg-gradient-to-br ${item.color} rounded-2xl border border-green-100 hover:border-emerald-300 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 ${
                isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
              }`}
              style={{ transitionDelay: `${idx * 100}ms` }}
            >
              <div className="relative">
                <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center text-white mb-4 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg">
                  <span className="text-2xl">{item.icon || '✨'}</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-emerald-600 transition-colors">{item.title}</h3>
                <p className="text-gray-600 leading-relaxed">{item.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="md:hidden relative">
          <div className="overflow-hidden rounded-2xl">
            <div className="flex transition-transform duration-500 ease-in-out" style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
              {displayItems.map((item, idx) => (
                <div key={item.id || idx} className="w-full flex-shrink-0 px-2">
                  <div className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl border border-green-100 shadow-lg">
                    <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center text-white mb-4 shadow-lg">
                      <span className="text-2xl">{item.icon || '✨'}</span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
                    <p className="text-gray-600">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-center gap-4 mt-6">
            <button
              onClick={prevSlide}
              className="p-3 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full shadow-md hover:shadow-xl transition-all hover:scale-110 active:scale-95"
              aria-label={t('common.previous', 'Previous')}
            >
              <ChevronLeft className="w-5 h-5 text-emerald-600" />
            </button>

            <div className="flex gap-2">
              {displayItems.map((_, idx) => (
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
              className="p-3 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full shadow-md hover:shadow-xl transition-all hover:scale-110 active:scale-95"
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
