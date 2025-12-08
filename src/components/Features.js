import React from 'react';
import { Search, Zap, Workflow, Shield, FileText, Users } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import enTranslations from '../translations/en.json';
import frTranslations from '../translations/fr.json';

export default function Features() {
  const { isFrench } = useLanguage();
  const translations = isFrench ? frTranslations : enTranslations;

  const features = [
    {
      icon: <Search className="w-6 h-6" />,
      title: translations.features.aiSearch,
      description: translations.features.aiSearchDesc,
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: translations.features.bandwidthOptimized,
      description: translations.features.bandwidthOptimizedDesc,
    },
    {
      icon: <Workflow className="w-6 h-6" />,
      title: translations.features.workflowAutomation,
      description: translations.features.workflowAutomationDesc,
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: translations.features.enterpriseSecurity,
      description: translations.features.enterpriseSecurityDesc,
    },
    {
      icon: <FileText className="w-6 h-6" />,
      title: translations.features.documentManagement,
      description: translations.features.documentManagementDesc,
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: translations.features.teamCollaboration,
      description: translations.features.teamCollaborationDesc,
    }
  ];

  return (
    <section id="features" className="py-20 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {translations.features.title}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {translations.features.subtitle}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, idx) => (
            <div 
              key={idx}
              className="group p-8 bg-white rounded-xl border border-gray-200 hover:border-blue-200 hover:shadow-lg transition-all duration-300"
            >
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 mb-6 group-hover:scale-110 transition-transform">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
              <p className="text-gray-600 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}