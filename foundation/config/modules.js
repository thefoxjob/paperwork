/* eslint-disable global-require */
import fs from 'fs';
import merge from 'deepmerge';
import path from 'path';


// eslint-disable-next-line import/no-mutable-exports
let config = Object.assign({}, {
  adapters: {
    AuthAdapter: require('../auth/adapters/MemoryAuthAdapter').default,
    CurrencyAdapter: require('../currency/adapters/SimpleCurrencyAdapter').default,
    NotificationAdapter: require('../notification/adapters/SlackNotificationAdapter').default,
  },
  providers: {
    Auth: require('../auth/AuthServiceProvider').default,
    Currency: require('../currency/CurrencyServiceProvider').default,
    I18n: require('../i18n/I18nServiceProvider').default,
    Mongoose: require('../mongoose/MongooseServiceProvider').default,
    Notification: require('../notification/NotificationServiceProvider').default,
    Restful: require('../restful/RestfulServiceProvider').default,
  },
});

if (fs.existsSync(path.resolve(process.cwd(), './application/config/modules.js'))) {
  try {
    // eslint-disable-next-line import/no-unresolved
    config = merge(config, require('../../application/config/modules'));
  } catch (error) {
    // skip
  }

  try {
    // eslint-disable-next-line import/no-unresolved
    config = merge(config, require('../../../../../../application/config/modules'));
  } catch (error) {
    // skip
  }
}

export default config;
