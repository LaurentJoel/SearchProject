import React, { useState, useEffect, useMemo } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useContent } from '../context/ContentContext';
import {
  getTranslations,
  getTranslationValue,
  buildReverseTranslationMap,
  translateMaybe
} from '../utils/translation';
import { ChevronLeft, ChevronRight, Zap, Clock } from 'lucide-react';

export default function Future() {
  const { isFrench } = useLanguage();
  const { content, loading } = useContent();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  const translations = getTranslations(isFrench);
  const t = (key, defaultValue = '') => getTranslationValue(translations, key, defaultValue);

  const reverseMap = useMemo(() => buildReverseTranslationMap(), []);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const visionSections = content.visionSections || [];
  const futureContent = content.future || {};

  const fallbackItems = [
    {
      icon: '🌐',
      title: t('future.semanticSearch', 'AI-Powered Semantic Search'),
      description: t('future.semanticSearchDesc', 'Beyond keyword matching with contextual understanding'),
      content: t('future.semanticSearchContent', 'Our AI learns from document context to provide more accurate search results'),
      color: 'from-green-50 to-emerald-100'
    },
    {
      icon: '📝',
      title: t('future.digitalSignatures', 'Digital Signatures & Certificates'),
      description: t('future.digitalSignaturesDesc', 'Legal authenticity for digital documents'),
      content: t('future.digitalSignaturesContent', 'Add legally-binding digital signatures and certificates to your documents'),
      color: 'from-emerald-50 to-teal-100'
    },
    {
      icon: '🎤',
      title: t('future.speechRecognition', 'Voice Search & Commands'),
      description: t('future.speechRecognitionDesc', 'Hands-free document access and control'),
      content: t('future.speechRecognitionContent', 'Use voice commands to search and navigate through documents'),
      color: 'from-teal-50 to-cyan-100'
    },
    {
      icon: '🔊',
      title: t('future.textToSpeech', 'Text-to-Speech Conversion'),
      description: t('future.textToSpeechDesc', 'Listen to documents instead of reading them'),
      content: t('future.textToSpeechContent', 'Convert any document to audio for accessibility and convenience'),
      color: 'from-cyan-50 to-emerald-100'
    },
    {
      icon: '✏️',
      title: t('future.annotations', 'Real-time Annotations'),
      description: t('future.annotationsDesc', 'Collaborative document markup and comments'),
      content: t('future.annotationsContent', 'Add comments, highlights, and annotations in real-time with team members'),
      color: 'from-green-100 to-emerald-50'
    },
    {
      icon: '🏛️',
      title: t('future.nationalDeployment', 'National Deployment'),
      description: t('future.nationalDeploymentDesc', 'Federated network for administrations'),
      content: t('future.nationalDeploymentContent', 'Scale to national level with federated architecture'),
      color: 'from-emerald-100 to-green-50'
    }
  ];

  const displayItems =
    visionSections.length > 0
      ? visionSections.map((s, idx) => {
          const f = fallbackItems[idx];
          return {
            ...s,
            title: translateMaybe(s.title, isFrench, reverseMap, f?.title || s.title),
            description: translateMaybe(s.description, isFrench, reverseMap, f?.description || s.description),
            content: translateMaybe(s.content, isFrench, reverseMap, f?.content || s.content),
            color: idx % 2 === 0 ? 'from-green-50 to-emerald-100' : 'from-emerald-50 to-green-100'
          };
        })
      : fallbackItems;

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % displayItems.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + displayItems.length) % displayItems.length);

  if (loading) {
    return (
      <section id="future" className="py-16 sm:py-20 md:py-24 px-4 sm:px-6 bg-gradient-to-b from-white to-emerald-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto" />
          <p className="mt-4 text-gray-600">{t('future.loading', 'Loading future vision...')}</p>
        </div>
      </section>
    );
  }

  const headerTitle = translateMaybe(
    futureContent.title,
    isFrench,
    reverseMap,
    t('future.title', 'The Future is Bright')
  );

  const headerSubtitle = translateMaybe(
    futureContent.subtitle,
    isFrench,
    reverseMap,
    t('future.subtitle', 'Exciting features coming soon to make SearchEngine even more powerful')
  );

  const innovationMessage = translateMaybe(
    futureContent.content,
    isFrench,
    reverseMap,
    t(
      'future.innovationMessage',
      "We're committed to evolving SearchEngine with cutting-edge features that meet the changing needs of modern administrations"
    )
  );

  return (
    <section id="future" className="py-16 sm:py-20 md:py-24 px-4 sm:px-6 bg-gradient-to-b from-white to-emerald-50">
      <div className="container mx-auto max-w-7xl">
        <div className={`text-center mb-12 md:mb-16 transition-all duration-700 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-100 to-emerald-100 rounded-full text-green-700 text-sm font-medium mb-4 shadow-sm">
            <Zap className="w-4 h-4" />
            {t('future.visionFuture', 'Future Vision')}
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">{headerTitle}</h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">{headerSubtitle}</p>
        </div>

        <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {displayItems.map((item, idx) => (
            <div
              key={item.id || idx}
              className={`group p-6 bg-gradient-to-br ${item.color} rounded-2xl border border-green-100 hover:border-emerald-300 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 ${
                isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
              }`}
              style={{ transitionDelay: `${idx * 100}ms` }}
            >
              <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center text-white mb-4 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg">
                <span className="text-2xl">{item.icon || '✨'}</span>
              </div>

              <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-emerald-600 transition-colors">
                {item.title}
              </h3>
              <p className="text-gray-600 mb-2 leading-relaxed">{item.description}</p>
              {item.content && <p className="text-gray-500 text-sm">{item.content}</p>}
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
                    <p className="text-gray-600 mb-2">{item.description}</p>
                    {item.content && <p className="text-gray-500 text-sm">{item.content}</p>}
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

        <div className={`mt-16 text-center transition-all duration-700 delay-300 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
          <div className="inline-block p-8 bg-gradient-to-br from-emerald-50 to-green-50 rounded-2xl border-2 border-emerald-200 shadow-xl max-w-3xl">
            <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center text-white mx-auto mb-4 shadow-lg">
              <Clock className="w-8 h-8" />
            </div>
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
              {t('future.innovationTitle', 'Continuous Innovation')}
            </h3>
            <p className="text-gray-600 text-lg leading-relaxed">{innovationMessage}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
