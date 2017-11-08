/* eslint-disable no-console */
import chalk from 'chalk';
import fs from 'fs';
import path from 'path';
import { graphql } from 'graphql';
import { makeExecutableSchema } from 'graphql-tools';
import { introspectionQuery } from 'graphql/utilities';


const execute = async () => {
  const start = new Date();
  delete require.cache[require.resolve('../graphql/schemas')];

  // eslint-disable-next-line global-require
  const schemas = require('../graphql/schemas').default;
  const executableSchema = makeExecutableSchema({
    typeDefs: schemas,
  });

  const json = await graphql(executableSchema, introspectionQuery);

  if ( ! fs.existsSync(path.resolve(process.cwd(), './build'))) {
    fs.mkdirSync(path.resolve(process.cwd(), './build'));
  }

  fs.writeFileSync(path.resolve(process.cwd(), './build/schemas.json'), JSON.stringify(json, null, 2));

  const end = new Date();
  const time = end.getTime() - start.getTime();

  console.info(`${ chalk.bgGreen(' Done ') } GraphQL schemas compiled successfully in ${ time }ms`);
};

export default execute;
