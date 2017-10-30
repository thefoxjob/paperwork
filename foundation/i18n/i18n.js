import i18n from 'i18next';
import { LanguageDetector, handle as middleware } from 'i18next-express-middleware';


export default {
  init: (app) => {
    const instance = i18n
      .use(LanguageDetector)
      .createInstance({
        debug: process.env.NODE_ENV !== 'production',
        lowerCaseLng: true,
        detection: {
          lookupQueryString: 'language',
          lookupCookie: 'language',
          lookupSession: 'language',
          lookupPath: 'language',
        },
      });

    app.use(middleware(instance));

    return instance;
  },
};
