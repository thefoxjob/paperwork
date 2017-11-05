import _ from 'lodash';
import fs from 'fs';
import path from 'path';

import page from './page';


export default async () => {
  const resolvers = {};

  _.merge(resolvers, page);

  await fs.readdirSync(path.resolve(process.cwd(), 'application/graphql/resolvers')).forEach(async (file) => {
    const resolver = await import(`application/graphql/resolvers/${ file }`);

    _.merge(resolvers, resolver);
  });

  return resolvers;
};
