import chokidar from 'chokidar';
import config from 'config';
import fs from 'fs';
import path from 'path';
import { introspectionQuery } from 'graphql/utilities';
import { graphql } from 'graphql';
import { makeExecutableSchema } from 'graphql-tools';

import logger from '../logger';


const execute = async () => {
  const start = new Date();
  delete require.cache[require.resolve('../graphql/schemas')];

  // eslint-disable-next-line global-require, import/no-unresolved
  const schemas = require('../../../src/graphql/schema.js').default;
  const executableSchema = makeExecutableSchema({
    typeDefs: schemas,
  });

  const json = await graphql(executableSchema, introspectionQuery);

  if (! fs.existsSync(config.get('graphql.schema'))) {
    fs.mkdirSync(config.get('graphql.schema'));
  }

  fs.writeFileSync(config.get('graphql.schema'), JSON.stringify(json, null, 2));

  const end = new Date();
  const time = end.getTime() - start.getTime();

  logger.done(`GraphQL schemas compiled successfully in ${ time }ms`);
};

export default (options = { watch: false, verbose: true }) => {
  if (options.watch || process.argv.includes('--watch')) {
    chokidar.watch(path.resolve(__dirname, '../../../src/graphql/schemas.js'))
      .on('change', () => execute(options));
  }

  return execute(options);
};
