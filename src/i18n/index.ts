import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import id from './locales/id.json';
import en from './locales/en.json';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      id: { translation: id },
      en: { translation: en },
    },
    supportedLngs: ['id', 'en'],
    fallbackLng: 'id',
    load: 'languageOnly', // 'en-US' dianggap 'en'
    interpolation: { escapeValue: false },
    detection: {
      order: ['localStorage', 'navigator'],
      lookupLocalStorage: 'lang',
      caches: ['localStorage'],
    },
  });

// Sinkronkan atribut <html lang> setiap bahasa berubah
i18n.on('languageChanged', (lng) => {
  document.documentElement.lang = lng;
});

export default i18n;