import config from 'config';
import webpack from 'webpack';

import graphql from './graphql';
import relay from './relay';
import webpackConfig from '../../webpack.config';


const createCompilationPromise = compiler => new Promise((resolve, reject) => {
  compiler.run((error, stats) => {
    if (error) {
      reject(error);
    } else if (stats.hasErrors()) {
      reject(stats.compilation.errors);
    } else {
      resolve();
    }
  });
});

export default async () => {
  if (config.get('graphql.use')) {
    await graphql({ watch: false, verbose: false });
  }

  await relay({ watch: false, verbose: false });

  const compilers = { client: null, server: null };
  const promises = { client: null, server: null };

  const compile = webpack([webpackConfig.client, webpackConfig.server]);
  compilers.client = compile.compilers.find(compiler => compiler.name === 'client');
  compilers.server = compile.compilers.find(compiler => compiler.name === 'server');

  promises.client = createCompilationPromise(compilers.client);
  promises.server = createCompilationPromise(compilers.server);

  await Promise.all([promises.client, promises.server]);

  return true;
};
