import cookieParser from 'cookie-parser';
import express from 'express';

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

app.service = register(app);

app.use((request, response, next) => {
  if ( ! config.secure.application.rules.www || ! config.secure.application.rules.backslash) {
    const host = request.header('x-forwarded-host') || request.hostname;

    // eslint-disable-next-line max-len
    if (( ! config.secure.application.rules.www && host.match(/^www\..*/i)) || ( ! config.secure.application.rules.backslash && request.path.endsWith('/') && request.path.length > 1)) {
      const route = config.secure.application.rules.backslash ? request.path : request.path.replace(/\/$/i, '');
      const queries = request.url.replace(request.path, '');

      return response.redirect(301, `${ request.protocol }://${ config.secure.application.rules.www ? host : host.replace(/^www\./i, '') }${ route || '/' }${ queries || '' }`);
    }
  }

  return next();
});

try {
  let middleware = null;

  try {
    // eslint-disable-next-line global-require, import/no-unresolved
    middleware = require('../../../application/middleware/server');
  } catch (error) {
    // skip
  }

  try {
    // eslint-disable-next-line global-require, import/no-unresolved
    middleware = require('../../../../../../../application/middleware/server');
  } catch (error) {
    // skip
  }

  middleware = middleware && middleware.default ? middleware.default : middleware;
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
