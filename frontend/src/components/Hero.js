// src/components/Hero.js - FIXED title rendering
import React, { useEffect, useMemo, useState } from 'react';
import { Search, Shield, Sparkles } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useContent } from '../context/ContentContext';
import {
  getTranslations,
  getTranslationValue,
  buildReverseTranslationMap,
  translateMaybe
} from '../utils/translation';

export default function Hero() {
  const { isFrench } = useLanguage();
  const { content, loading } = useContent();
  const [isVisible, setIsVisible] = useState(false);

  const translations = getTranslations(isFrench);
  const t = (key, defaultValue = '') => getTranslationValue(translations, key, defaultValue);

  const reverseMap = useMemo(() => buildReverseTranslationMap(), []);

  const heroContent = content.hero || {};

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // Log when hero content changes
  useEffect(() => {
    console.log('🎯 [Hero] Content updated:', heroContent);
  }, [heroContent]);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) element.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  // Parse title - try both full title and split parts
  const heroTitle = translateMaybe(
    heroContent.title,
    isFrench,
    reverseMap,
    t('hero.title', 'Intelligent Search for Modern Administration')
  );

  const heroSubtitle = translateMaybe(
    heroContent.subtitle,
    isFrench,
    reverseMap,
    t('hero.subtitle', 'Enterprise Document Intelligence')
  );

  const heroDescription = translateMaybe(
    heroContent.content,
    isFrench,
    reverseMap,
    t(
      'hero.description',
      'Advanced document management platform transforming Cameroonian national archives with AI-powered search, automated workflows, and enterprise-grade security.'
    )
  );

  // Split title for styling
  const titleParts = heroTitle.split(' ');
  const firstPart = titleParts.slice(0, 3).join(' '); // "Intelligent Search for"
  const middlePart = titleParts[3] || 'Modern'; // "Modern"
  const lastPart = titleParts.slice(4).join(' ') || 'Administration'; // "Administration"

  if (loading) {
    return (
      <section className="relative pt-24 sm:pt-28 md:pt-32 pb-16 sm:pb-20 md:pb-24 px-4 sm:px-6 min-h-screen flex items-center bg-gradient-to-br from-green-50 via-emerald-50 to-green-100">
        <div className="max-w-6xl mx-auto text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="relative pt-24 sm:pt-28 md:pt-32 pb-16 sm:pb-20 md:pb-24 px-4 sm:px-6 min-h-screen flex items-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-green-50 via-emerald-50 to-green-100 overflow-hidden">
        <div className={`absolute top-10 left-10 w-72 h-72 bg-gradient-to-br from-green-400/40 to-emerald-400/30 rounded-full animate-pulse transition-opacity duration-1000 ${isVisible ? 'opacity-40' : 'opacity-0'}`} />
        <div className={`absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-br from-emerald-400/35 to-teal-400/25 rounded-full animate-pulse transition-opacity duration-1000 delay-300 ${isVisible ? 'opacity-35' : 'opacity-0'}`} />
        <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-br from-teal-400/30 to-cyan-400/20 rounded-full animate-pulse transition-opacity duration-1000 delay-600 ${isVisible ? 'opacity-30' : 'opacity-0'}`} />
      </div>

      <div className="max-w-6xl mx-auto relative z-10 w-full">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className={`space-y-6 md:space-y-8 transition-all duration-700 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
            <div>
              <div className={`inline-flex items-center gap-2 px-4 py-2 bg-white/90 backdrop-blur-sm rounded-full text-green-700 text-sm font-medium mb-6 border border-green-200 shadow-sm transition-all duration-500 ${isVisible ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0'}`}>
                <Sparkles className="w-4 h-4" />
                {heroSubtitle}
              </div>

              <h1 className={`text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 leading-tight mb-4 transition-all duration-700 delay-100 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
                {firstPart}{' '}
                <span className="text-emerald-600">
                  {middlePart}
                </span>{' '}
                {lastPart}
              </h1>

              <p className={`text-lg md:text-xl text-gray-700 leading-relaxed max-w-xl transition-all duration-700 delay-200 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
                {heroDescription}
              </p>
            </div>

            <div className={`grid grid-cols-1 sm:grid-cols-2 gap-6 transition-all duration-700 delay-300 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
              <div
                onClick={() => scrollToSection('features')}
                className="group relative overflow-hidden rounded-xl p-4 bg-gradient-to-br from-green-50 to-emerald-50 border border-green-100 shadow-sm hover:shadow-lg hover:border-emerald-200 transition-all duration-300 cursor-pointer"
              >
                <div className="absolute -right-6 -top-6 w-24 h-24 bg-green-100 rounded-full opacity-20 group-hover:opacity-30 transition-opacity" />
                <div className="relative flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-green-50 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                    <Search className="w-6 h-6 text-green-600 group-hover:text-green-700 transition-colors" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 group-hover:text-emerald-700 transition-colors">
                      {t('hero.aiSearch', 'AI-Powered Search')}
                    </div>
                    <div className="text-sm text-gray-600">{t('hero.aiSearchDesc', 'Intelligent document discovery')}</div>
                  </div>
                </div>
              </div>

              <div
                onClick={() => scrollToSection('platform')}
                className="group relative overflow-hidden rounded-xl p-4 bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-100 shadow-sm hover:shadow-lg hover:border-emerald-200 transition-all duration-300 cursor-pointer"
              >
                <div className="absolute -left-6 -bottom-6 w-24 h-24 bg-emerald-100 rounded-full opacity-20 group-hover:opacity-30 transition-opacity" />
                <div className="relative flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-100 to-emerald-50 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                    <Shield className="w-6 h-6 text-emerald-600 group-hover:text-emerald-700 transition-colors" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 group-hover:text-emerald-700 transition-colors">
                      {t('hero.securePlatform', 'Secure Platform')}
                    </div>
                    <div className="text-sm text-gray-600">{t('hero.securePlatformDesc', 'Enterprise-grade security')}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className={`relative mt-8 lg:mt-0 transition-all duration-700 delay-400 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
            <div className="bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-2xl hover:shadow-3xl transition-all duration-300 max-w-md mx-auto">
              <div className="aspect-square bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-12">
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-600 to-emerald-600 rounded-2xl mx-auto flex items-center justify-center shadow-lg">
                    <Search className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {t('hero.platformTitle', 'SearchEngine Platform')}
                    </h3>
                    <p className="text-sm text-gray-600">{t('hero.platformSubtitle', 'Professional document management')}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}