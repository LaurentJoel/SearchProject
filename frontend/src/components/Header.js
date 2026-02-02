import React, { useState, useEffect } from 'react';
import { Search, Menu, X, Globe } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { getTranslations, getTranslationValue } from '../utils/translation';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { toggleLanguage, isFrench } = useLanguage();

  const translations = getTranslations(isFrench);
  const t = (key, defaultValue = '') => getTranslationValue(translations, key, defaultValue);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (mobileMenuOpen && !event.target.closest('.mobile-menu-container')) {
        setMobileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [mobileMenuOpen]);

  const scrollToSection = (sectionId) => {
    setMobileMenuOpen(false);

    setTimeout(() => {
      const element = document.getElementById(sectionId);
      const headerHeight = 80;

      const target = element || document.querySelector(`[data-section="${sectionId}"]`);

      if (target) {
        const elementPosition = target.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerHeight;

        window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
      }
    }, 100);
  };

  return (
    <header
      className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-md shadow-lg border-b border-green-100'
          : 'bg-white/80 backdrop-blur-sm'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex items-center space-x-3 group"
          >
            <div className="w-10 h-10 bg-gradient-to-br from-green-600 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
              <Search className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="text-xl font-bold text-gray-900 group-hover:text-emerald-600 transition-colors">
                SearchEngine
              </div>
              <div className="text-xs text-green-600 -mt-1 hidden sm:block">
                {t('header.logoSubtitle', 'Document Intelligence Platform')}
              </div>
            </div>
          </button>

          <nav className="hidden md:flex items-center space-x-8">
            <button onClick={() => scrollToSection('features')} className="text-sm font-medium text-gray-600 hover:text-green-600 transition-colors relative group">
              {t('header.features', 'Features')}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-green-600 group-hover:w-full transition-all duration-300" />
            </button>

            <button onClick={() => scrollToSection('platform')} className="text-sm font-medium text-gray-600 hover:text-green-600 transition-colors relative group">
              {t('header.platform', 'Platform')}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-green-600 group-hover:w-full transition-all duration-300" />
            </button>

            <button onClick={() => scrollToSection('video')} className="text-sm font-medium text-gray-600 hover:text-green-600 transition-colors relative group">
              {t('header.demo', 'Demo')}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-green-600 group-hover:w-full transition-all duration-300" />
            </button>

            <button onClick={() => scrollToSection('future')} className="text-sm font-medium text-gray-600 hover:text-green-600 transition-colors relative group">
              {t('header.vision', 'Vision')}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-green-600 group-hover:w-full transition-all duration-300" />
            </button>
          </nav>

          <div className="flex items-center gap-4">
            <button
              onClick={toggleLanguage}
              className="hidden md:flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:text-green-600 bg-green-50 hover:bg-green-100 rounded-full transition-all font-medium border border-green-100 hover:border-green-200 hover:scale-105 active:scale-95"
              aria-label={isFrench ? 'Switch to English' : 'Passer en Français'}
            >
              <Globe className="w-4 h-4" />
              <span className="text-xs font-medium">
                {isFrench ? 'EN' : 'FR'}
              </span>
            </button>

            <button
              className="md:hidden p-2 rounded-lg hover:bg-green-50 transition-colors"
              onClick={() => setMobileMenuOpen((v) => !v)}
              aria-label="Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6 text-gray-600" /> : <Menu className="w-6 h-6 text-gray-600" />}
            </button>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden bg-white/98 backdrop-blur-md border-t border-green-100 shadow-lg mobile-menu-container">
          <div className="max-w-7xl mx-auto px-4 py-4 space-y-1">
            <button onClick={() => scrollToSection('features')} className="block w-full text-left text-gray-600 hover:text-green-600 hover:bg-green-50 transition-all font-medium text-base py-3 px-4 rounded-lg">
              {t('header.features', 'Features')}
            </button>
            <button onClick={() => scrollToSection('platform')} className="block w-full text-left text-gray-600 hover:text-green-600 hover:bg-green-50 transition-all font-medium text-base py-3 px-4 rounded-lg">
              {t('header.platform', 'Platform')}
            </button>
            <button onClick={() => scrollToSection('video')} className="block w-full text-left text-gray-600 hover:text-green-600 hover:bg-green-50 transition-all font-medium text-base py-3 px-4 rounded-lg">
              {t('header.demo', 'Demo')}
            </button>
            <button onClick={() => scrollToSection('future')} className="block w-full text-left text-gray-600 hover:text-green-600 hover:bg-green-50 transition-all font-medium text-base py-3 px-4 rounded-lg">
              {t('header.vision', 'Vision')}
            </button>

            <div className="pt-4 border-t border-green-100 mt-4">
              <button
                onClick={toggleLanguage}
                className="flex items-center gap-3 text-gray-600 hover:text-green-600 hover:bg-green-50 transition-all font-medium text-base w-full py-3 px-4 rounded-lg"
              >
                <Globe className="w-5 h-5" />
                <span>{isFrench ? 'EN' : 'FR'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
