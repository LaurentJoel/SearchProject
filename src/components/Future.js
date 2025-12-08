import React from 'react';
import { Globe, FileText, Mic, Volume2, GitBranch, Database, Clock } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import enTranslations from '../translations/en.json';
import frTranslations from '../translations/fr.json';

export default function Future() {
  const { isFrench } = useLanguage();
  const translations = isFrench ? frTranslations : enTranslations;

  const futureFeatures = [
    {
      icon: <Globe className="w-5 h-5" />,
      title: translations.future.semanticSearch,
      description: translations.future.semanticSearchDesc
    },
    {
      icon: <FileText className="w-5 h-5" />,
      title: translations.future.digitalSignatures,
      description: translations.future.digitalSignaturesDesc
    },
    {
      icon: <Mic className="w-5 h-5" />,
      title: translations.future.speechRecognition,
      description: translations.future.speechRecognitionDesc
    },
    {
      icon: <Volume2 className="w-5 h-5" />,
      title: translations.future.textToSpeech,
      description: translations.future.textToSpeechDesc
    },
    {
      icon: <GitBranch className="w-5 h-5" />,
      title: translations.future.annotations,
      description: translations.future.annotationsDesc
    },
    {
      icon: <Database className="w-5 h-5" />,
      title: translations.future.nationalDeployment,
      description: translations.future.nationalDeploymentDesc
    }
  ];

  return (
    <section id="future" className="py-20 px-6 bg-white">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {translations.future.title}
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {translations.future.subtitle}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {futureFeatures.map((feature, idx) => (
            <div 
              key={idx}
              className="p-6 bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-200 hover:border-green-300 hover:shadow-lg transition-all"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center text-white mb-4">
                {feature.icon}
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-gray-600 text-sm">{feature.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <div className="inline-block p-8 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl border border-green-200">
            <Clock className="w-12 h-12 text-green-600 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              {translations.future.innovationTitle}
            </h3>
            <p className="text-gray-600 max-w-2xl">
              {translations.future.innovationMessage}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}