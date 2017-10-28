import chalk from 'chalk';
import cookieParser from 'cookie-parser';
import express from 'express';
import path from 'path';

import config from '../../config';
import log from '../../log';
import routes from './routes';
import session from '../../session';
import { AuthServiceProvider } from '../../auth';
import { Service } from '../../service';
import { Translator, i18n } from '../../i18n';


const promises = { route: null };

if (config.secure.database.mongoose) {
  // eslint-disable-next-line global-require
  const mongoose = require('mongoose');
  mongoose.connect(config.secure.database.mongoose.uri, Object.assign(config.secure.database.mongoose.options || {}, { useMongoClient: true }));
  mongoose.connection.on('error', error => log.error(`${ chalk.bgRed(' ERROR ') } mongoose unable connect to the mongodb: ${ error }`));
}

const app = express();

app.set('trust proxy', true);
app.set('view engine', config.secure.template.engine);
app.set('views', config.secure.template.source);

app.use(cookieParser());
app.use(session.middleware(config.secure.session));
app.use(express.static(config.secure.application.public));

const language = i18n.init(app);

app.use((request, response, next) => {
  request.modules = {};
  request.modules.service = new Service(request, config.secure.service.endpoints, config.secure.service.services);
  request.modules.auth = new AuthServiceProvider(request, config.secure.auth);
  request.modules.translator = new Translator(request, language);

  next();
});

try {
  // eslint-disable-next-line global-require, import/no-dynamic-require
  const middleware = require(path.resolve(process.cwd(), './application/middleware/server.js'));
  middleware(app);
} catch (error) {
  // skip
}

promises.route = routes.setup(app);

if ( ! module.hot) {
  promises.route.then(() => app.listen(config.secure.application.port, () => {
    // eslint-disable-next-line no-console
    console.info(`The server is running on port ${ config.secure.application.port }`);
  }));
} else {
  app.hot = module.hot;
}

export default app;
