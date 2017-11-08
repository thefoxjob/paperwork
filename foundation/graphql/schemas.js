import fs from 'fs';
import path from 'path';

import page from './types/page';
import relay from './types/relay';


const types = [page, relay];

if (fs.existsSync(path.resolve(process.cwd(), 'application/graphql/types'))) {
  fs.readdirSync(path.resolve(process.cwd(), 'application/graphql/types')).forEach((file) => {
    if (/.js$/.test(file)) {
      try {
        // eslint-disable-next-line global-require, import/no-dynamic-require
        const type = require(`application/graphql/types/${ file }`);
        types.push(type.default ? type.default : type);
      } catch (error) {
        // skip
      }
    }
  });
}

const queries = types.map(type => type.queries).filter(query => query);
const mutations = types.map(type => type.mutations).filter(mutation => mutation);

const Schema = `
  ${ queries.length > 0 ? `
    type Query {
      ${ types.map(type => type.queries).filter(query => query) }
    }
  ` : '' }

  ${ mutations.length > 0 ? `
    type Mutation {
      ${ mutations }
    }
  ` : '' }

  schema {
    ${ queries.length > 0 ? 'query: Query' : '' }
    ${ mutations.length > 0 ? 'mutation: Mutation' : '' }
  }
`;

export default [Schema, ...types.map(type => type.schemas)];
