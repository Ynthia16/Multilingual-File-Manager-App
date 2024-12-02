const i18next = require('../../i18n'); 

describe('i18n Initialization', () => {
  
  beforeAll(async () => {

    await i18next.init();
  });

  test('should initialize with default language "en"', () => {
    expect(i18next.language).toBe('en');
  });

  test('should change language when requested', async () => {
    await i18next.changeLanguage('fr');  
    expect(i18next.language).toBe('fr');
  });

});
