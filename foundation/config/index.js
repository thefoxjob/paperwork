import fs from 'fs';
import merge from 'deepmerge';
import path from 'path';

import base from './base';


// eslint-disable-next-line import/no-mutable-exports
let config = Object.assign({}, base);

if (fs.existsSync(path.resolve(process.cwd(), './application/config/base.js'))) {
  try {
    // eslint-disable-next-line global-require, import/no-unresolved
    config = merge(config, require('../../application/config/base'));
  } catch (error) {
    // skip
  }

  try {
    // eslint-disable-next-line global-require, import/no-unresolved
    config = merge(config, require('../../../../../../application/config/base'));
  } catch (error) {
    // skip
  }
}

if (process.env.NODE_ENV && fs.existsSync(path.resolve(process.cwd(), `./application/config/${ process.env.NODE_ENV.toLowerCase() }.js`))) {
  try {
    // eslint-disable-next-line global-require, import/no-dynamic-require
    config = merge(config, require(`../../application/config/${ process.env.NODE_ENV.toLowerCase() }`));
  } catch (error) {
    // skip
  }

  try {
    // eslint-disable-next-line global-require, import/no-dynamic-require
    config = merge(config, require(`../../../../../../application/config/${ process.env.NODE_ENV.toLowerCase() }`));
  } catch (error) {
    // skip
  }
}

export default config;
