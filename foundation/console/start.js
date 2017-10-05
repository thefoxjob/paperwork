/* eslint-disable no-console */
import chalk from 'chalk';
import express from 'express';
import path from 'path';
import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';

import webpackConfig from '../webpack.config';


const createCompilationPromise = (name, compiler, config) => new Promise((resolve, reject) => {
  let start = new Date();

  compiler.plugin('compile', () => {
    start = new Date();
  });

  compiler.plugin('done', (stats) => {
    const end = new Date();
    const time = end.getTime() - start.getTime();

    if (stats.hasErrors()) {
      console.error(chalk.bgRed(`Failed to compile '${ name } after ${ time }ms`));

      return reject(new Error('Compilation failed'));
    }

    console.info(chalk.bgGreen(`'${ name } compiled successfully at ${ time }ms`));

    return resolve(stats);
  });
});

let server = null;

const execute = () => {
  if (server) {
    return server;
  }

  const compilers = { client: null, server: null };
  const promises = { client: null, server: null };

  server = express();
  server.use(express.static(path.resolve(__dirname, '../../public')));

  const compile = webpack([webpackConfig.client, webpackConfig.server]);
  compilers.client = compile.compilers.find(compiler => compiler.name === 'client');
  compilers.server = compile.compilers.find(compiler => compiler.name === 'server');

  promises.client = createCompilationPromise('client', compilers.client, webpackConfig.client);
  promises.server = createCompilationPromise('server', compilers.server, webpackConfig.server);

  server.use(webpackDevMiddleware(compilers.client, {
    publicPath: webpackConfig.client.output.publicPath,
    quiet: true,
  }));

  server.use(webpackHotMiddleware(compilers.client, { log: false }));

  compilers.server.plugin('compile', () => {
    if ( ! app.resolved) {
      return;
    }
  });
};

export default execute;
