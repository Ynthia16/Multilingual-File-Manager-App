const i18next = require('i18next');
const i18nextMiddleware = require('i18next-http-middleware');  // Correct reference for Express middleware
const backend = require('i18next-fs-backend');  // For loading translations from files

// Initialize i18next
i18next
  .use(backend)  
  .use(i18nextMiddleware.LanguageDetector)  // Use i18next-express-middleware's LanguageDetector
  .init({
    fallbackLng: 'en', // Default language if no translation is found
    preload: ['en', 'fr'], // Languages to support
    ns: ['translation'], // Namespaces for translations
    defaultNS: 'translation',
    backend: {
      loadPath: './locales/{{lng}}/{{ns}}.json', // Path to your translation files
    },
    detection: {
    caches: ['cookie'], // Make sure it checks the cookie for the language
    cookieMinutes: 10, // The cookie expiration time
      order: ['header', 'querystring', 'cookie'], // Prioritize detecting language from cookies
      lookupHeader: 'accept-language',
     }
  });

module.exports = i18next;
