import HttpRequest from 'request';
import cookieParser from 'cookie-parser';
import express from 'express';
import path from 'path';

import config from '../../config';
import log from '../../log';
import routes from './routes';
import session from '../../session';


export default async () => {
  if (config.secure.database.mongoose) {
    const mongoose = require('mongoose');
    mongoose.connect(config.secure.database.mongoose.uri, Object.assign(config.secure.database.mongoose.options, { useMongoClient: true }));
    mongoose.conenction.on('error', error => log.error(`${ chalk.bgRed(' ERROR ') } mongoose unable connect to the mongodb: ${ error }`));
  }

  const app = express();

  app.set('trust proxy', true);
  app.set('view engine', config.secure.template.engine);
  app.set('views', config.secure.template.source);

  app.use(cookieParser());
  app.use(session.middleware());
  app.use(express.static(config.secure.application.public))

  try {
    const middleware = await import(path.resolve(process.cwd(), './middleware/server.js'));
    middleware(app);
  } catch (error) {
    // skip
  }

  await routes.setup(app);

  if ( ! module.hot) {
    app.listen(config.secure.application.port, () => {
      console.info(`The server is running on port ${ config.secure.application.port }`);
    });
  } else {
    app.hot = module.hot;
  }

  return app;
}
