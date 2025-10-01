import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

// Risorse statiche (facili da estendere)
import en from './locales/en/common.json'
import it from './locales/it/common.json'
import fr from './locales/fr/common.json'
import es from './locales/es/common.json'

void i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      it: { translation: it },
      fr: { translation: fr },
      es: { translation: es },
    },
    fallbackLng: 'en',
    supportedLngs: ['en', 'it', 'fr', 'es'],
    interpolation: { escapeValue: false },
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
    },
  })

// Aggiorna <html lang=""> quando cambia lingua
i18n.on('languageChanged', (lng) => {
  document.documentElement.lang = lng
})

export default i18n
