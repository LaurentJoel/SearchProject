import React, { useState, useEffect, useMemo } from 'react';
import { Search } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useContent } from '../context/ContentContext';
import {
  getTranslations,
  getTranslationValue,
  buildReverseTranslationMap,
  translateMaybe
} from '../utils/translation';

export default function CTA() {
  const { isFrench } = useLanguage();
  const { content, loading } = useContent();
  const [isVisible, setIsVisible] = useState(false);

  const translations = getTranslations(isFrench);
  const t = (key, defaultValue = '') => getTranslationValue(translations, key, defaultValue);

  const reverseMap = useMemo(() => buildReverseTranslationMap(), []);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const ctaSections = content.ctaSections || [];
  const ctaContent = content.cta || {};
  const footerContent = content.footer || {};

  const fallbackItems = [
    {
      icon: '🛡️',
      title: t('cta.secure', 'Enterprise Security'),
      description: t('cta.secureDesc', 'Military-grade encryption for sensitive documents'),
      content: t('cta.secureContent', 'Your data is protected with AES-256 encryption and secure protocols')
    },
    {
      icon: '⚡',
      title: t('cta.fast', 'Lightning Fast'),
      description: t('cta.fastDesc', 'Optimized search results in milliseconds'),
      content: t('cta.fastContent', 'Our optimized algorithms deliver results faster than traditional search')
    },
    {
      icon: '👥',
      title: t('cta.teams', 'Team Collaboration'),
      description: t('cta.teamsDesc', 'Seamless workflow across departments'),
      content: t('cta.teamsContent', 'Share, comment, and collaborate on documents in real-time')
    }
  ];

  if (loading) {
    return (
      <>
        <section className="py-16 sm:py-20 md:py-24 px-4 sm:px-6 bg-gradient-to-br from-green-600 to-emerald-700 text-white">
          <div className="container mx-auto max-w-5xl text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto" />
            <p className="mt-4 text-white/80">{t('common.loading', 'Loading...')}</p>
          </div>
        </section>
        <footer className="py-12 px-4 sm:px-6 bg-gray-900 text-gray-400">
          <div className="text-center text-sm">{t('common.loading', 'Loading...')}</div>
        </footer>
      </>
    );
  }

  const title = translateMaybe(
    ctaContent.title,
    isFrench,
    reverseMap,
    t('cta.title', 'Modernizing Cameroonian Administration')
  );

  const subtitle = translateMaybe(
    ctaContent.subtitle,
    isFrench,
    reverseMap,
    t(
      'cta.description',
      'SearchEngine represents a major contribution to digital transformation, revolutionizing national documentary archive management with cutting-edge technology and innovation.'
    )
  );

  const footerSubtitle = translateMaybe(
    footerContent.subtitle,
    isFrench,
    reverseMap,
    t('cta.footerMessage', 'Transforming national archive management for Cameroonian administration')
  );

  const footerCopy = translateMaybe(
    footerContent.content,
    isFrench,
    reverseMap,
    t('cta.copyright', '© 2025 SearchEngine. All rights reserved.')
  );

  return (
    <>
      <section className="py-16 sm:py-20 md:py-24 px-4 sm:px-6 bg-gradient-to-br from-green-600 via-emerald-600 to-green-700 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-72 h-72 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-emerald-300 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto max-w-5xl relative z-10">
          <div
            className={`text-center mb-12 transition-all duration-700 ${
              isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
            }`}
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">{title}</h2>
            <p className="text-lg md:text-xl opacity-95 max-w-3xl mx-auto leading-relaxed">
              {subtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {ctaSections.length > 0
              ? ctaSections.map((section, idx) => {
                  const f = fallbackItems[idx];
                  const cardTitle = translateMaybe(section.title, isFrench, reverseMap, f?.title || `Feature ${idx + 1}`);
                  const cardDesc = translateMaybe(section.description, isFrench, reverseMap, f?.description || 'Description not available');
                  const cardContent = section.content
                    ? translateMaybe(section.content, isFrench, reverseMap, f?.content)
                    : null;

                  return (
                    <div
                      key={section.id}
                      className={`text-center p-6 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 hover:bg-white/20 hover:border-white/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl ${
                        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
                      }`}
                      style={{ transitionDelay: `${idx * 100}ms` }}
                    >
                      <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-xl mx-auto mb-4 flex items-center justify-center shadow-lg">
                        <span className="text-3xl">{section.icon || '📢'}</span>
                      </div>
                      <h3 className="text-xl font-bold mb-2">{cardTitle}</h3>
                      <p className="opacity-90 leading-relaxed">{cardDesc}</p>
                      {cardContent && <p className="text-sm opacity-80 mt-2">{cardContent}</p>}
                    </div>
                  );
                })
              : fallbackItems.map((item, idx) => (
                  <div
                    key={idx}
                    className={`text-center p-6 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 hover:bg-white/20 hover:border-white/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl ${
                      isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
                    }`}
                    style={{ transitionDelay: `${idx * 100}ms` }}
                  >
                    <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-xl mx-auto mb-4 flex items-center justify-center shadow-lg">
                      <span className="text-3xl">{item.icon || '📢'}</span>
                    </div>
                    <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                    <p className="opacity-90 leading-relaxed">{item.description}</p>
                    {item.content && <p className="text-sm opacity-80 mt-2">{item.content}</p>}
                  </div>
                ))}
          </div>
        </div>
      </section>

      <footer className="py-12 px-4 sm:px-6 bg-gray-900 text-gray-400">
        <div className="container mx-auto max-w-7xl">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center shadow-lg">
                <Search className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">
                {translateMaybe(footerContent.title, isFrench, reverseMap, 'SearchEngine')}
              </span>
            </div>

            <div className="text-center md:text-left max-w-2xl">
              <p className="text-sm leading-relaxed mb-2">{footerSubtitle}</p>
              <p className="text-xs opacity-75">{footerCopy}</p>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}

