import config from 'config';
import express from 'express';
import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';

import graphql from './graphql';
import logger from '../logger';
import relay from './relay';
import webpackConfig from '../../webpack.config';


const options = {
};

const createCompilationPromise = (name, compiler) => new Promise((resolve, reject) => {
  compiler.hooks.done.tap(name, (stats) => {
    if (stats.hasErrors()) {
      const info = stats.toJson('minimal');

      info.errors.forEach(error => logger.error(error));
      reject(new Error('Compilation Error!'));
    } else {
      resolve(stats);
    }
  });
});

const execute = async () => {
  if (config.get('graphql.use')) {
    await graphql({ watch: true });
  }

  await relay({ watch: true });

  const app = { instance: null, prommise: null, resolved: true };
  const compilers = { client: null, server: null };
  const promises = { client: null, server: null };
  const server = express();

  server.use(express.static(config.get('application.public')));

  const compile = webpack([webpackConfig.client, webpackConfig.server]);
  compilers.client = compile.compilers.find(compiler => compiler.name === 'client');
  compilers.server = compile.compilers.find(compiler => compiler.name === 'server');

  promises.client = createCompilationPromise('client', compilers.client);
  promises.server = createCompilationPromise('server', compilers.server);

  server.use(webpackDevMiddleware(compilers.client, {
    logLevel: 'silent',
    publicPath: webpackConfig.client.output.publicPath,
    quiet: true,
    serverSideRender: true,
  }));

  server.use(webpackHotMiddleware(compilers.client, { log: false }));

  const checkForUpdate = (update) => {
    const prefix = '[\x1b[35mHMR\x1b[0m] ';

    if (! app.instance.hot) {
      logger.error('Hot module replacement is disable.');
      return Promise.reject();
    }

    if (app.instance.hot.status() !== 'idle') {
      return Promise.resolve();
    }

    return app.instance.hot.check(true)
      .then((modules) => {
        if (! modules) {
          if (update) {
            logger.info(`${ prefix } updated applied.`);
          }

          return;
        }

        if (modules.length === 0) {
          logger.info(`${ prefix } nothing hot update.`);
        } else {
          logger.info(`${ prefix } updated modules: `);
          modules.forEach(id => logger.log(`${ prefix } - ${ id }`));

          checkForUpdate(true);
        }
      })
      .catch((error) => {
        if (['abort', 'fail'].includes(app.instance.hot.status())) {
          logger.warn(`${ prefix } cannot apply update.`);
          delete require.cache[require.resolve('../../../build/server/server')];

          // eslint-disable-next-line global-require, import/no-unresolved
          app.instance = require('../../../build/server/server').default;
          logger.info(`${ prefix } app has been reloaded.`);
        } else {
          logger.warn(`${ prefix } update failed: ${ error.stack || error.message }`);
        }
      });
  };

  compilers.server.hooks.compile.tap('server', () => {
    if (! app.resolved) {
      return;
    }

    app.resolved = false;
    app.promise = new Promise((resolve) => {
      app.resolve = resolve;
    });
  });

  compilers.server.watch(options, (error, stats) => {
    if (app.instance && ! error && ! stats.hasErrors()) {
      checkForUpdate().then(() => {
        app.resolved = true;
        app.resolve();
      });
    }
  });

  server.use((request, response) => app.promise
    .then(() => app.instance.handle(request, response))
    .catch(error => logger.log(error)));

  try {
    await promises.client;
    await promises.server;

    // eslint-disable-next-line global-require, import/no-unresolved
    app.instance = require('../../../build/server/server').default;
    app.resolved = true;
    app.resolve();
  } catch (error) {
    logger.error('Compilation failed');
    logger.log(error);
  } finally {
    server.listen(config.get('application.port'), () => {
      logger.log(`🚀 Development server is ready on port ${ config.get('application.port') }.`);
    });
  }
};

export default execute;
