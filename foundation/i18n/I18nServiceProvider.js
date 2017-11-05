import ServiceProvider from '@thefoxjob/js-service-provider';
import i18n from 'i18next';
import * as middleware from 'i18next-express-middleware';

import Translator from './Translator';


class I18nServiceProvider extends ServiceProvider {
  register() {
    this.ioc.bind('i18n', (ioc, params) => {
      i18n.use(middleware.LanguageDetector);
      i18n.init({
        detection: {
          lookupCookie: 'language',
          lookupSession: 'language',
          lookupPath: 'language',
        },
        fallbackLng: 'en',
        lng: 'en',
        lowerCaseLng: true,
      });

      return new Translator(params.request, i18n);
    });
  }
}

export default I18nServiceProvider;
