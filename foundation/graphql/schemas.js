import _ from 'lodash';

import page from './types/page';
import relay from './types/relay';


export default async () => {
  const types = [page, relay];

  try {
    _.concat(types, await import('application/graphql/types'));
  } catch (error) {
    // skip
  }

  const Schema = `
    type Query {
      ${ types.map(type => type.queries) }
    }

    type Mutation {
      ${ types.map(type => type.mutations) }
    }

    schema {
      query: Query
      mutation: Mutation
    }
  `;

  return [Schema, ...types.map(type => type.schemas)];
};
