import React from 'react';
import { Search, Shield } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import enTranslations from '../translations/en.json';
import frTranslations from '../translations/fr.json';

export default function Hero() {
  const { isFrench } = useLanguage();
  const translations = isFrench ? frTranslations : enTranslations;

  return (
    <section className="pt-32 pb-20 px-6 relative min-h-screen flex items-center overflow-hidden">
      {/* Background remains the same */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-50 via-emerald-50 to-green-100">
        <div className="absolute top-10 left-10 w-72 h-72 bg-green-300 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-emerald-300 rounded-full opacity-15 animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-teal-300 rounded-full opacity-10 animate-pulse" style={{animationDelay: '1s'}}></div>
        
        <div 
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `linear-gradient(rgba(6, 78, 59, 0.3) 1px, transparent 1px),
                              linear-gradient(90deg, rgba(6, 78, 59, 0.3) 1px, transparent 1px)`,
            backgroundSize: '50px 50px'
          }}
        ></div>
      </div>
      
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          {/* Text Content */}
          <div className="space-y-8">
            <div>
              <div className="inline-flex items-center px-4 py-2 bg-white/80 rounded-full text-green-700 text-sm font-medium mb-6 border border-green-200">
                {translations.hero.tagline}
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                {translations.hero.titlePart1}{' '}
                <span className="text-green-600">{translations.hero.titlePart2}</span>{' '}
                {translations.hero.titlePart3}
              </h1>
            </div>
            
            <p className="text-xl text-gray-700 leading-relaxed">
              {translations.hero.description}
            </p>

            {/* Platform highlights */}
            <div className="grid grid-cols-2 gap-6 pt-8">
              <div className="flex items-center gap-3 bg-white/80 rounded-xl p-4 border border-green-100 shadow-sm">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <Search className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <div className="font-semibold text-gray-900">{translations.hero.aiSearch}</div>
                  <div className="text-sm text-gray-600">{translations.hero.aiSearchDesc}</div>
                </div>
              </div>
              
              <div className="flex items-center gap-3 bg-white/80 rounded-xl p-4 border border-green-100 shadow-sm">
                <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                  <Shield className="w-6 h-6 text-emerald-600" />
                </div>
                <div>
                  <div className="font-semibold text-gray-900">{translations.hero.securePlatform}</div>
                  <div className="text-sm text-gray-600">{translations.hero.securePlatformDesc}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Hero Visual */}
          <div className="relative">
            <div className="bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-2xl">
              <div className="aspect-video bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center">
                <div className="text-center space-y-4 p-8">
                  <div className="w-20 h-20 bg-green-600 rounded-2xl mx-auto flex items-center justify-center">
                    <Search className="w-10 h-10 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-semibold text-gray-900 mb-2">{translations.hero.platformTitle}</h3>
                    <p className="text-gray-600">{translations.hero.platformSubtitle}</p>
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