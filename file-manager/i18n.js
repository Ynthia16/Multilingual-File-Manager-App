const i18next = require('i18next');
const i18nextMiddleware = require('i18next-http-middleware');  
const backend = require('i18next-fs-backend');  

// Initialize i18next
i18next
  .use(backend)  
  .use(i18nextMiddleware.LanguageDetector)  
  .init({
    fallbackLng: 'en',
    preload: ['en', 'fr'], 
    ns: ['translation'], 
    defaultNS: 'translation',
    backend: {
      loadPath: './locales/{{lng}}/{{ns}}.json', 
    },
    detection: {
    caches: ['cookie'], 
    cookieMinutes: 10, 
      order: ['header', 'querystring', 'cookie'], 
      lookupHeader: 'accept-language',
     }
  });

module.exports = i18next;
