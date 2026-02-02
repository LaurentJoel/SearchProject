import { useLanguage } from '../context/LanguageContext';
import enTranslations from '../translations/en.json';
import frTranslations from '../translations/fr.json';

export const useTranslation = () => {
  const { language, isFrench } = useLanguage();
  
  const t = (key, defaultValue = '') => {
    // Get the correct translations object
    const translations = isFrench ? frTranslations : enTranslations;
    
    // Split the key by dots to navigate nested objects
    const keys = key.split('.');
    let result = translations;
    
    // Navigate through the nested object structure
    for (const k of keys) {
      if (result && typeof result === 'object' && k in result) {
        result = result[k];
      } else {
        // Key not found, return default value or the key itself
        return defaultValue || key;
      }
    }
    
    // If result is an array, return it as is (for feature lists)
    if (Array.isArray(result)) {
      return result;
    }
    
    // If result is a string, return it
    if (typeof result === 'string') {
      return result;
    }
    
    // If result is an object, try to return a string representation
    if (typeof result === 'object' && result !== null) {
      // For objects with title/desc structure
      if (result.title && result.desc) {
        return result.title; // Return title by default
      }
      // Try to stringify
      try {
        return JSON.stringify(result);
      } catch {
        return defaultValue || key;
      }
    }
    
    // Fallback
    return result || defaultValue || key;
  };
  
  const tDesc = (key, defaultValue = '') => {
    // Special function to get description from objects
    const translations = isFrench ? frTranslations : enTranslations;
    const keys = key.split('.');
    let result = translations;
    
    for (const k of keys) {
      if (result && typeof result === 'object' && k in result) {
        result = result[k];
      } else {
        return defaultValue || key;
      }
    }
    
    // If result is an object with desc property
    if (typeof result === 'object' && result !== null && result.desc) {
      return result.desc;
    }
    
    return defaultValue || key;
  };
  
  return { 
    t, 
    tDesc,
    language, 
    isFrench 
  };
};