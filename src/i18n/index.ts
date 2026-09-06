import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import es from './es.json';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      es: { translation: es },
     // en: { translation: en }
    },
    fallbackLng: 'es', // Idioma por defecto si no se detecta o falta traducción
    interpolation: {
      escapeValue: false 
    }
  });

export default i18n;