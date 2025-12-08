import React, { useState, useEffect } from 'react';
import { Search, Menu, X, Globe } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import enTranslations from '../translations/en.json';
import frTranslations from '../translations/fr.json';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { language, toggleLanguage, isFrench } = useLanguage();
  
  const translations = isFrench ? frTranslations : enTranslations;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`fixed w-full z-50 transition-all duration-300 ${
      isScrolled ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-green-100' : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-green-600 to-emerald-600 rounded-xl flex items-center justify-center">
              <Search className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="text-xl font-semibold text-gray-900">SearchEngine</div>
              <div className="text-xs text-green-600 -mt-1">{translations.header.logoSubtitle}</div>
            </div>
          </div>

          {/* Navigation - Clean and minimal */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-sm text-gray-600 hover:text-green-600 transition-colors font-medium">
              {translations.header.features}
            </a>
            <a href="#platform" className="text-sm text-gray-600 hover:text-green-600 transition-colors font-medium">
              {translations.header.platform}
            </a>
            <a href="#video" className="text-sm text-gray-600 hover:text-green-600 transition-colors font-medium">
              {translations.header.demo}
            </a>
            <a href="#future" className="text-sm text-gray-600 hover:text-green-600 transition-colors font-medium">
              {translations.header.vision}
            </a>
          </nav>

          {/* Language Switcher and Presentation */}
          <div className="flex items-center gap-6">
            {/* Language Toggle Button */}
            <button
              onClick={toggleLanguage}
              className="hidden md:flex items-center gap-2 text-sm text-gray-600 hover:text-green-600 transition-colors font-medium"
              aria-label={isFrench ? "Switch to English" : "Passer en Français"}
            >
              <Globe className="w-4 h-4" />
              <span className="text-xs font-medium">
                {isFrench ? translations.languageSwitcher.en : translations.languageSwitcher.fr}
              </span>
            </button>
            
            <div className="text-xs text-gray-500 hidden md:block">
              {translations.header.presentation}
            </div>
          </div>

          {/* Mobile menu button */}
          <button 
            className="md:hidden p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-5 h-5 text-gray-600" /> : <Menu className="w-5 h-5 text-gray-600" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-md border-t border-green-100">
          <div className="max-w-7xl mx-auto px-6 py-4 space-y-4">
            <a href="#features" className="block text-gray-600 hover:text-green-600 transition-colors font-medium text-sm">
              {translations.header.features}
            </a>
            <a href="#platform" className="block text-gray-600 hover:text-green-600 transition-colors font-medium text-sm">
              {translations.header.platform}
            </a>
            <a href="#video" className="block text-gray-600 hover:text-green-600 transition-colors font-medium text-sm">
              {translations.header.demo}
            </a>
            <a href="#future" className="block text-gray-600 hover:text-green-600 transition-colors font-medium text-sm">
              {translations.header.vision}
            </a>
            
            {/* Mobile Language Toggle */}
            <div className="pt-4 border-t border-green-100">
              <button
                onClick={toggleLanguage}
                className="flex items-center gap-2 text-gray-600 hover:text-green-600 transition-colors font-medium text-sm"
              >
                <Globe className="w-4 h-4" />
                <span>
                  {isFrench ? translations.languageSwitcher.en : translations.languageSwitcher.fr}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}