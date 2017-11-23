/* eslint-disable no-console */
import 'babel-register';
import chalk from 'chalk';
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { introspectionQuery } from 'graphql/utilities';
import { graphql } from 'graphql';
import { makeExecutableSchema } from 'graphql-tools';


const PATH = {
  BIN: path.resolve(process.cwd(), './node_modules/.bin'),
  SOURCE: path.resolve(process.cwd(), './application'),
  SCHEMAS: path.resolve(process.cwd(), './build/schemas.json'),
};

const execute = async () => {
  const files = [];
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

  try {
    const result = execSync(`${ PATH.BIN }/relay-compiler --src ${ PATH.SOURCE } --schema ${ PATH.SCHEMAS } --extensions js jsx`);

    Buffer.from(result).toString().split(/(?:\r\n|\r|\n)/g).forEach((line) => {
      if (/^ - /.test(line)) {
        files.push(line.replace(/^ - /, ''));
      }
    });

    const end = new Date();
    const time = end.getTime() - start.getTime();

    if (files && files.length > 0) {
      console.info(`${ chalk.bgGreen(' Done ') } GraphQL schemas compiled successfully in ${ time }ms, ${ files.length } graphql relay files has been generated`);
    } else {
      console.info(`${ chalk.bgGreen(' Done ') } GraphQL schemas compiled successfully in ${ time }ms`);
    }
  } catch (error) {
    let output = false;

    console.error(`${ chalk.bgRed(' Error ') } GraphQL errors:`);

    Buffer.from(error.stdout).toString().split(/(?:\r\n|\r|\n)/g).forEach((line) => {
      if ( ! output) {
        if (/^ERROR/.test(line)) {
          output = true;
        }
      } else if (line.length > 0) {
        console.error(` - ${ line }`);
      }
    });
  }
};

export default execute;
