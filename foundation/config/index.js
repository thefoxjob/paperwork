import fs from 'fs';
import merge from 'deepmerge';
import path from 'path';

import base from './base';


// eslint-disable-next-line import/no-mutable-exports
let config = Object.assign({}, base);

if (fs.existsSync(path.resolve(process.cwd(), './config/base.js'))) {
  // eslint-disable-next-line global-require, import/no-dynamic-require
  config = merge(config, require(path.resolve(process.cwd(), './config/base')));
}

if (process.env.NODE_ENV && fs.existsSync(path.resolve(process.cwd(), `./config/${ process.env.NODE_ENV.toLowerCase() }.js`))) {
  // eslint-disable-next-line global-require, import/no-dynamic-require
  config = merge(config, require(path.resolve(process.cwd(), `./config/${ process.env.NODE_ENV.toLowerCase() }`)));
}

export default config;
