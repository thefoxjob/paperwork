import _ from 'lodash';
import fs from 'fs';
import path from 'path';

import page from './page';


const resolvers = {};

_.merge(resolvers, page);

if (fs.existsSync(path.resolve(process.cwd(), 'application/graphql/resolvers'))) {
  fs.readdirSync(path.resolve(process.cwd(), 'application/graphql/resolvers')).forEach((file) => {
    if (/.js$/.test(file)) {
      try {
        // eslint-disable-next-line global-require, import/no-dynamic-require
        const resolver = require(`application/graphql/resolvers/${ file }`);
        _.merge(resolvers, resolver.default ? resolver.default : resolver);
      } catch (error) {
        // skip
      }
    }
  });
}

export default resolvers;
