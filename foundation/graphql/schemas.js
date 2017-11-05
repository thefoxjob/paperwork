import fs from 'fs';
import path from 'path';

import page from './types/page';
import relay from './types/relay';


export default async () => {
  const types = [page, relay];

  await fs.readdirSync(path.resolve(process.cwd(), 'application/graphql/types')).forEach(async (file) => {
    const type = await import(`application/graphql/types/${ file }`);

    types.push(type.default ? type.default : type);
  });

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
