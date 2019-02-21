import config from 'config';
import express from 'express';

import middleware from '../../../src/middleware/server';
import routes from './routes';


const app = express();

app.set('trust proxy', true);
app.set('view engine', config.get('template.engine'));
app.set('views', config.get('template.source'));

app.use(express.static(config.get('application.public')));

if (typeof middleware === 'function') {
  middleware(app);
}

routes.setup(app);

if (! module.hot) {
  app.listen(config.get('application.port'), () => {
    // eslint-disable-next-line no-console
    console.info(`🚀 The server is running on port ${ config.get('application.port') }`);
  });
} else {
  app.hot = module.hot;
}

export default app;
