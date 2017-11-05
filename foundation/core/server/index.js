import cookieParser from 'cookie-parser';
import express from 'express';
import path from 'path';

import config from '../../config';
import register from './register';
import routes from './routes';
import session from './session';


const app = express();

app.set('trust proxy', true);
app.set('view engine', config.secure.template.engine);
app.set('views', config.secure.template.source);

app.use(cookieParser());
app.use(session(config.secure.session));
app.use(express.static(config.secure.application.public));

app.ioc = register(app);

app.use((request, response, next) => {
  request.modules = {};
  request.modules.service = app.ioc.make('restful', { request });
  request.modules.auth = app.ioc.make('auth', { request });
  request.modules.i18n = app.ioc.make('i18n', { request });

  next();
});

try {
  const relative = path.relative(__dirname, process.cwd());
  let middleware = null;

  if (relative === '../../..') {
    // eslint-disable-next-line global-require, import/no-unresolved
    middleware = require('../../../application/middleware/server');
  } else if (relative === '../../../../../../..') {
    // eslint-disable-next-line global-require, import/no-unresolved
    middleware = require('../../../../../../../application/middleware/server');
  }

  middleware = middleware.default ? middleware.default : middleware;
  middleware(app);
} catch (error) {
  // skip
}

routes.setup(app);

if ( ! module.hot) {
  app.listen(config.secure.application.port, () => {
    // eslint-disable-next-line no-console
    console.info(`The server is running on port ${ config.secure.application.port }`);
  });
} else {
  app.hot = module.hot;
}

export default app;
