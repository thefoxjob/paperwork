import i18n from 'i18next';
import * as middleware from 'i18next-express-middleware';


export default {
  init: (app) => {
    i18n.use(middleware.LanguageDetector);
    i18n.init({
      detection: {
        lookupQueryString: 'language',
        lookupCookie: 'language',
        lookupSession: 'language',
        lookupPath: 'language',
      },
      fallbackLng: 'en',
      lng: 'en',
      lowerCaseLng: true,
    });

    app.use(middleware.handle(i18n));

    return i18n;
  },
};
