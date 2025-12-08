import React from 'react';
import { Shield, Zap, Users } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import enTranslations from '../translations/en.json';
import frTranslations from '../translations/fr.json';

export default function CTA() {
  const { isFrench } = useLanguage();
  const translations = isFrench ? frTranslations : enTranslations;

  return (
    <>
      {/* CTA Section */}
      <section className="py-20 px-6 bg-gradient-to-br from-green-600 to-emerald-700 text-white">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            {translations.cta.title}
          </h2>
          <p className="text-xl mb-8 opacity-90">
            {translations.cta.description}
          </p>
          <div className="grid md:grid-cols-3 gap-8 mt-12">
            <div className="text-center">
              <div className="w-16 h-16 bg-white/20 rounded-xl mx-auto mb-4 flex items-center justify-center">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-bold mb-2">{translations.cta.secure}</h3>
              <p className="text-sm opacity-90">{translations.cta.secureDesc}</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-white/20 rounded-xl mx-auto mb-4 flex items-center justify-center">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-bold mb-2">{translations.cta.fast}</h3>
              <p className="text-sm opacity-90">{translations.cta.fastDesc}</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-white/20 rounded-xl mx-auto mb-4 flex items-center justify-center">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-bold mb-2">{translations.cta.teams}</h3>
              <p className="text-sm opacity-90">{translations.cta.teamsDesc}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 bg-gray-900 text-gray-400">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-white">SearchEngine</span>
            </div>
            <div className="text-center md:text-left">
              <p className="text-sm">
                {translations.cta.footerMessage}
              </p>
              <p className="text-sm mt-2">
                {translations.cta.copyright}
              </p>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}