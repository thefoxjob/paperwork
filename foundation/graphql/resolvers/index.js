import _ from 'lodash';

import page from './page';


export default async () => {
  const resolvers = {};

  _.merge(resolvers, page);

  try {
    const results = await import('application/graphql/resolvers');
    results.forEach(resolver => _.merge(resolvers, resolver));
  } catch (error) {
    // skip
  }

  return resolvers;
};
