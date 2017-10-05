import fs from 'fs';
import merge from 'deepmerge';
import path from 'path';

import base from './base';


let config = Object.assign({}, base);

if (fs.existsSync(path.resolve(__dirname, '../../../config/base.js'))) {
  config = merge(config, require('../../../config/base'));
}

if (process.env.NODE_ENV && fs.existsSync(path.resolve(__dirname, `../../../config/${ process.env.NODE_ENV }.js`))) {
  config = merge(config, require(`../../../config/${ process.env.NODE_ENV }`));
}

export default config;
