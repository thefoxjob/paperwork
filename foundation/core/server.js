import HttpRequest from 'request';
import cookieParser from 'cookie-parser';
import express from 'express';
import path from 'path';

import session from '../session';


const app = express();

app.set('trust proxy', true);
app.set('view engine', config.secure.template.engine);
app.set('views', config.secure.template.source);

app.use(cookieParser());
app.use(session.middleware());
app.use(express.static(config.secure.application.public))

try {
  const middleware = require(path.resolve(proces.cwd(), './middleware/server.js'));
  middleware(app);
} catch (error) {
}

if ( ! module.hot) {
  app.listen(config.secure.application.port, () => {
    console.info(`The server is running on port ${ config.secure.application.port }`);
  });
} else {
  app.hot = module.hot;
}

export default app;
