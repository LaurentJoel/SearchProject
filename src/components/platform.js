import React from 'react';
import { CheckCircle, Shield, Search, Workflow, LogIn, Image } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import enTranslations from '../translations/en.json';
import frTranslations from '../translations/fr.json';

export default function Platform() {
  const { isFrench } = useLanguage();
  const translations = isFrench ? frTranslations : enTranslations;

  const platformSections = [
    {
      icon: <LogIn className="w-6 h-6" />,
      title: translations.platform.welcome.title,
      description: translations.platform.welcome.description,
      features: translations.platform.welcome.features,
      imageName: "welcome-screenshot.jpg"
    },
    {
      icon: <Search className="w-6 h-6" />,
      title: translations.platform.search.title,
      description: translations.platform.search.description,
      features: translations.platform.search.features,
      imageName: "search-screenshot.jpg"
    },
    {
      icon: <Workflow className="w-6 h-6" />,
      title: translations.platform.dashboard.title,
      description: translations.platform.dashboard.description,
      features: translations.platform.dashboard.features,
      imageName: "dashboard-screenshot.jpg"
    }
  ];

  // Function to handle image display
  const ImageDisplay = ({ imageName, title, icon }) => {
    const imagePath = `/images/${imageName}`;
    
    return (
      <div className="screenshot-frame aspect-video bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl overflow-hidden relative group">
        {/* Actual Image */}
        <img 
          src={imagePath}
          alt={`${title} - SearchEngine Platform`}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={(e) => {
            e.target.style.display = 'none';
            e.target.nextSibling.style.display = 'flex';
          }}
        />
        
        {/* Fallback Placeholder */}
        <div 
          className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100 p-8 text-center"
          style={{ display: 'none' }}
        >
          <div className="w-16 h-16 bg-green-200 rounded-2xl mb-4 flex items-center justify-center">
            <Image className="w-8 h-8 text-green-600" />
          </div>
          <h4 className="font-semibold text-gray-900 mb-2">{title}</h4>
          <p className="text-gray-600 text-sm mb-3">{translations.platform.imagePlaceholder}</p>
          <div className="bg-white/80 rounded-lg px-3 py-2 border border-green-200">
            <code className="text-xs text-green-700 font-mono">{imageName}</code>
          </div>
        </div>
      </div>
    );
  };

  return (
    <section id="platform" className="py-20 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 rounded-full text-green-700 text-sm font-medium mb-4">
            {translations.platform.tagline}
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {translations.platform.title}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {translations.platform.subtitle}
          </p>
        </div>

        <div className="space-y-20">
          {platformSections.map((section, index) => (
            <div key={index} className={`grid lg:grid-cols-2 gap-12 items-center ${
              index % 2 === 1 ? 'lg:grid-flow-dense' : ''
            }`}>
              <div className={`space-y-6 ${index % 2 === 1 ? 'lg:col-start-2' : ''}`}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center text-white">
                    {section.icon}
                  </div>
                  <h3 className="text-2xl md:text-3xl font-bold text-gray-900">{section.title}</h3>
                </div>
                
                <p className="text-lg text-gray-600 leading-relaxed">{section.description}</p>
                
                <div className="space-y-3">
                  {section.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className={`${index % 2 === 1 ? 'lg:col-start-1' : ''}`}>
                <ImageDisplay 
                  imageName={section.imageName}
                  title={section.title}
                  icon={section.icon}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}