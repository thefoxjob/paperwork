import HttpRequest from 'request';
import chalk from 'chalk';
import cookieParser from 'cookie-parser';
import express from 'express';
import path from 'path';

import config from '../../config';
import log from '../../log';
import routes from './routes';
import session from '../../session';


const promises = { route: null };

if (config.secure.database.mongoose) {
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

try {
  const middleware = require(path.resolve(process.cwd(), './middleware/server.js'));
  middleware(app);
} catch (error) {
  // skip
}

promises.route = routes.setup(app);

if ( ! module.hot) {
  promises.route.then(() => app.listen(config.secure.application.port, () => {
    console.info(`The server is running on port ${ config.secure.application.port }`);
  }));
} else {
  app.hot = module.hot;
}

export default app;
