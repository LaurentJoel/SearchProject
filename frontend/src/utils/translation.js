// src/utils/translation.js
import en from '../translations/en.json';
import fr from '../translations/fr.json';

export const getTranslations = (isFrench) => (isFrench ? fr : en);

export const getTranslationValue = (translations, key, defaultValue = '') => {
  if (!translations || !key) return defaultValue || key;

  const keys = key.split('.');
  let result = translations;

  for (const k of keys) {
    if (result && typeof result === 'object' && k in result) {
      result = result[k];
    } else {
      return defaultValue || key;
    }
  }

  return result ?? defaultValue ?? key;
};

// Flatten JSON {a:{b:"x"}} => {"a.b":"x"}
const flatten = (obj, prefix = '', out = {}) => {
  if (!obj || typeof obj !== 'object') return out;
  for (const [k, v] of Object.entries(obj)) {
    const nextKey = prefix ? `${prefix}.${k}` : k;
    if (typeof v === 'string') out[nextKey] = v;
    else if (Array.isArray(v)) out[nextKey] = v;
    else if (v && typeof v === 'object') flatten(v, nextKey, out);
  }
  return out;
};

/**
 * Manual overrides for backend/admin strings that must translate
 * even if they don't match en.json exactly.
 *
 * Key = exact EN text stored/displayed
 * Value = desired FR translation
 */
const MANUAL_FR_OVERRIDES = {
  "Advanced document management platform transforming Cameroonian national archives with AI-powered search, automated workflows, and enterprise-grade security.": 
    "Plateforme avancée de gestion documentaire transformant les archives nationales camerounaises grâce à une recherche alimentée par l’IA, des flux de travail automatisés et une sécurité de niveau entreprise.",

  // Platform bullets - Welcome
  "Clean, professional welcome screen":
    "Écran d’accueil propre et professionnel",
  "Secure authentication system":
    "Système d’authentification sécurisé",
  "Role-based access control":
    "Contrôle d’accès basé sur les rôles",
  "User-friendly interface design":
    "Conception d’interface conviviale",

  // Platform bullets - Search
  "Full-text search across all document types":
    "Recherche en texte intégral sur tous les types de documents",
  "Integrated OCR technology":
    "Technologie OCR intégrée",
  "Smart bandwidth optimization":
    "Optimisation intelligente de la bande passante",
  "Real-time search results":
    "Résultats de recherche en temps réel",

  // Platform bullets - Dashboard
  "Document workflow management":
    "Gestion des flux de travail documentaires",
  "Real-time progress monitoring":
    "Surveillance des progrès en temps réel",
  "Team collaboration tools":
    "Outils de collaboration d’équipe",
  "Administrative controls":
    "Contrôles administratifs"
};

export const buildReverseTranslationMap = () => {
  const flatEn = flatten(en);
  const flatFr = flatten(fr);

  const map = new Map();
  for (const key of Object.keys(flatEn)) {
    const enVal = flatEn[key];
    const frVal = flatFr[key];
    if (typeof enVal === 'string' && typeof frVal === 'string') {
      map.set(enVal.trim(), frVal);
    }
  }
  return map;
};

export const translateMaybe = (text, isFrench, reverseMap, fallbackText) => {
  if (!text) return fallbackText ?? '';
  if (!isFrench) return text;

  const candidate = typeof text === 'string' ? text.trim() : text;
  if (typeof candidate !== 'string') return fallbackText ?? text;

  // 1) Manual override first (for backend text mismatches)
  const manual = MANUAL_FR_OVERRIDES[candidate];
  if (manual) return manual;

  // 2) Then try auto map from en.json -> fr.json
  const mapped = reverseMap?.get(candidate);
  if (mapped) return mapped;

  // 3) fallback
  return fallbackText || text;
};
