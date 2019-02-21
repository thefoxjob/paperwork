import chokidar from 'chokidar';
import config from 'config';
import path from 'path';
import { execSync } from 'child_process';

import logger from '../logger';


const BIN_DIR = path.resolve(__dirname, '../../../node_modules/.bin');
const SRC_DIR = path.resolve(__dirname, '../../../src');


const execute = async (options) => {
  try {
    execSync(`${ BIN_DIR }/relay-compiler --src ${ SRC_DIR } --schema ${ config.get('graphql.schema') } --extensions js jsx`);

    if (options.verbose) {
      logger.done('relay compiler has been executed successfully.');
    }
  } catch (error) {
    let output = false;

    if (options.verbose) {
      logger.error('relay-compiler errors:');

      Buffer.from(error.stdout).toString().split(/(?:\r\n|\r|\n)/g).forEach((line) => {
        if (! output) {
          if (/^ERROR/.test(line)) {
            output = true;
          }
        } else if (line.length > 0) {
          logger.log(` - ${ line }`);
        }
      });
    } else {
      throw new Error(error.stdout);
    }
  }
};

export default (options = { watch: false, verbose: true }) => {
  if (options.watch || process.argv.includes('--watch')) {
    chokidar.watch([SRC_DIR, config.get('graphql.schema')], { ignored: /(\/graphql\/|\/middleware\/|\/__generated__\/)/ })
      .on('change', () => execute(options));
  }

  return execute(options);
};
