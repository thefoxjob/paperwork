/* eslint-disable no-console */
import RequestShortener from 'webpack/lib/RequestShortener';
import chalk from 'chalk';
import clui from 'clui';
import express from 'express';
import path from 'path';
import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import { exec } from 'child_process';

import config from '../config';
import relay from './relay';
import webpackConfig from '../webpack.config';


const requestShortener = new RequestShortener(process.cwd());
const options = {
  // ignored: /node_modules/,
};

const runRelayCompiler = async () => {
  const bin = path.resolve(process.cwd(), './node_modules/.bin');
  const source = path.resolve(process.cwd(), './application');
  const schemas = path.resolve(process.cwd(), './build/schemas.json');

  await exec(`${ bin }/relay-compiler --src ${ source } --schema ${ schemas } --extensions js jsx`);
};

const transformWebpackCompilationError = (error) => {
  if (error.dependencies && error.dependencies.length > 0 && error.name === 'ModuleNotFoundError' && error.message.indexOf('Module not found') === 0) {
    const dependencies = [];
    const relatives = [];


    error.dependencies.forEach((dependency) => {
      if (dependency.request.startsWith('./') || dependency.request.startsWith('../')) {
        relatives.push(dependency);
      } else {
        dependencies.push(dependency);
      }
    });

    if (dependencies.length > 0) {
      const file = error.file || error.module.readableIdentifier(requestShortener);

      console.error(` > ${ chalk.bgRed(' Error ') } ${ dependencies.length > 1 ? 'These dependencies were' : 'This dependency was' } not found:`);
      dependencies.map(dependency => console.error(`   * ${ dependency.request } ${ chalk.cyan(`in ${ file }`) }`));
    }

    if (relatives.length > 0) {
      const file = error.file || error.module.readableIdentifier(requestShortener);

      console.error(` > ${ chalk.bgRed(' Error ') } ${ relatives.length > 1 ? 'These relative modules were' : 'This module was' } not found:`);
      relatives.map(relative => console.error(`   * ${ relative.request } ${ chalk.cyan(`in ${ file }`) }`));
    }
  } else if (error.name === 'ModuleBuildError' && error.message.indexOf('SyntaxError') >= 0) {
    console.error(` > ${ chalk.bgRed(' Error ') } Syntax Error: `);
    console.error(`    * ${ error.message }`);
  } else {
    console.error(` > ${ chalk.bgRed( ' Error ') } ${ error.message }`);
    console.error(error);
  }
};

const createCompilationPromise = (name, compiler, events) => new Promise((resolve, reject) => {
  const progress = new clui.Spinner(`${ chalk.bgBlue(' Compiling ') } ${ name } script...`);
  let start = new Date();

  compiler.plugin('compile', () => {
    start = new Date();
    progress.start();

    if (events && typeof (events.compile) === 'function') {
      events.compile();
    }
  });

  compiler.plugin('done', (stats) => {
    const end = new Date();
    const time = end.getTime() - start.getTime();

    progress.stop();

    if (stats.hasErrors() || stats.hasWarnings()) {
      if (stats.hasErrors()) {
        console.error(`${ chalk.bgRed(' Error ') } ${ name } script failed to compile`);
        stats.compilation.errors.map(error => transformWebpackCompilationError(error));

        return reject();
      }
    }

    console.info(`${ chalk.bgGreen(' Done ') } ${ name } script compiled successfully in ${ time }ms`);

    return resolve(stats);
  });
});

let server = null;

const execute = async () => {
  if (server) {
    return server;
  }

  const app = { instance: null, promise: null, resolved: true };
  const compilers = { client: null, server: null };
  const promises = { client: null, server: null };

  server = express();
  server.use(express.static(config.secure.application.public));

  const compile = webpack([webpackConfig.client, webpackConfig.server]);
  compilers.client = compile.compilers.find(compiler => compiler.name === 'client');
  compilers.server = compile.compilers.find(compiler => compiler.name === 'server');

  promises.client = createCompilationPromise('client', compilers.client);
  promises.server = createCompilationPromise('server', compilers.server, {
    compile: async () => {
      await relay();
      await runRelayCompiler();
    },
  });

  const devMiddleware = webpackDevMiddleware(compilers.client, {
    options,
    publicPath: webpackConfig.client.output.publicPath,
    quiet: true,
    serverSideRender: true,
  });

  server.use(devMiddleware);
  server.use(webpackHotMiddleware(compilers.client, { log: false }));

  const checkForUpdate = (update) => {
    const prefix = '[\x1b[35mHMR\x1b[0m]';

    if ( ! app.instance.hot) {
      // TODO: error 'hot module replacement is disabled.'
      console.error(`${ chalk.bgRed(' Error ') } Hot module replacement is disable `);
      return Promise.reject();
    }

    if (app.instance.hot.status() !== 'idle') {
      return Promise.resolve();
    }

    return app.instance.hot.check(true)
      .then((modules) => {
        if ( ! modules) {
          if (update) {
            console.info(`${ prefix } updated applied.`);
          }

          return;
        }

        if (modules.length === 0) {
          console.info(`${ prefix } nothing hot update.`);
        } else {
          console.info(`${ prefix } updated modules:`);
          modules.forEach(id => console.info(`${ prefix } - ${ id }`));

          checkForUpdate(app, true);
        }
      })
      .catch((error) => {
        if (['abort', 'fail'].includes(app.instance.hot.status())) {
          console.warn(`${ prefix } cannot apply update.`);
          delete require.cache[require.resolve(path.resolve(process.cwd(), './build/server/server'))];

          // eslint-disable-next-line global-require, no-param-reassign, import/no-dynamic-require
          app.instance = require(path.resolve(process.cwd(), './build/server/server')).default;
          console.warn(`${ prefix } app has been reloaded.`);
        } else {
          console.warn(`${ prefix } update failed: ${ error.stack || error.message }`);
        }
      });
  };

  compilers.server.plugin('compile', () => {
    if ( ! app.resolved) {
      return;
    }

    app.resolved = false;
    app.promise = new Promise((resolve) => {
      app.resolve = resolve;
    });
  });

  server.use((request, response) => {
    response.locals.webpackDevMiddleware = devMiddleware;
    app.promise
      .then(() => app.instance.handle(request, response))
      .catch(error => console.error(error));
  });

  compilers.server.watch(options, (error, stats) => {
    if (app.instance && ! error && ! stats.hasErrors()) {
      checkForUpdate(app.instance).then(() => {
        app.resolved = true;
        app.resolve();
      });
    }
  });

  try {
    await promises.client;
    await promises.server;

    // eslint-disable-next-line global-require, import/no-dynamic-require
    app.instance = require(path.resolve(process.cwd(), './build/server/server')).default;
    app.resolved = true;
    app.resolve();

    server.listen(config.secure.application.port, () => {
      console.info(` > Ready on port ${ config.secure.application.port }`);
    });

    return true;
  } catch (error) {
    console.error(`${ chalk.bgRed(' Error ') } Compilation failed`);
    console.error(error);

    return false;
  }
};


export default execute;
