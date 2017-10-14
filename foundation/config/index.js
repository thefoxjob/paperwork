import fs from 'fs';
import merge from 'deepmerge';
import path from 'path';

import base from './base';


let config = Object.assign({}, base);

if (fs.existsSync(path.resolve(process.cwd(), './config/base.js'))) {
  config = merge(config, require(path.resolve(process.cwd(), './config/base')));
}

if (process.env.NODE_ENV && fs.existsSync(path.resolve(process.cwd(), `./config/${ process.env.NODE_ENV.toLowerCase() }.js`))) {
  config = merge(config, require(path.resolve(process.cwd(), `./config/${ process.env.NODE_ENV.toLowerCase() }`)));
}

export default config;
