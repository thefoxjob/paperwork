/* eslint-disable global-require */
import fs from 'fs';
import merge from 'deepmerge';
import path from 'path';


// eslint-disable-next-line import/no-mutable-exports
let config = Object.assign({}, {
  adapters: {
    AuthAdapter: require('../auth/adapters/MemoryAuthAdapter').default,
    NotificationAdapter: require('../notification/adapters/SlackNotificationAdapter').default,
  },
  providers: {
    Auth: require('../auth/AuthServiceProvider').default,
    I18n: require('../i18n/I18nServiceProvider').default,
    Mongoose: require('../mongoose/MongooseServiceProvider').default,
    Notification: require('../notification/NotificationServiceProvider').default,
    Restful: require('../restful/RestfulServiceProvider').default,
  },
});

const relative = path.relative(__dirname, process.cwd());

if (fs.existsSync(path.resolve(process.cwd(), './application/config/modules.js'))) {
  if (relative === '../..') {
    try {
      // eslint-disable-next-line import/no-unresolved
      config = merge(config, require('../../application/config/modules'));
    } catch (error) {
      // skip
    }
  } else if (relative === '../../../../../..') {
    try {
      // eslint-disable-next-line import/no-unresolved
      config = merge(config, require('../../../../../../application/config/modules'));
    } catch (error) {
      // skip
    }
  }
}

export default config;
