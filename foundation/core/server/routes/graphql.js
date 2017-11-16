import parser from 'body-parser';
import { graphqlExpress, graphiqlExpress } from 'graphql-server-express';
import { makeExecutableSchema } from 'graphql-tools';

import schemas from '../../../graphql/schemas';
import resolvers from '../../../graphql/resolvers';


export default async (app) => {
  const executableSchema = makeExecutableSchema({
    typeDefs: schemas,
    resolvers,
  });

  const graphqlServer = graphqlExpress((request) => {
    const context = {
      auth: app.service.make('auth', { request }),
      i18n: app.service.make('i18n', { request }),
      request,
    };

    return {
      schema: executableSchema,
      rootValue: { service: app.service },
      context,
    };
  });

  app.use('/graphql', parser.json(), graphqlServer);
  app.use('/graphiql', graphiqlExpress({ endpointURL: '/graphql' }));
};
