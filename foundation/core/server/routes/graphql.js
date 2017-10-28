import parser from 'body-parser';
import { graphqlExpress, graphiqlExpress } from 'graphql-server-express';
import { makeExecutableSchema } from 'graphql-tools';

import schemas from '../../../graphql/schemas';
import resolvers from '../../../graphql/resolvers';


export default (app) => {
  const executableSchema = makeExecutableSchema({
    typeDefs: [schemas],
    resolvers,
  });

  const graphqlServer = graphqlExpress((request) => {
    const context = { request, modules: request.modules };

    return {
      schema: executableSchema,
      context,
    };
  });

  app.use('/graphql', parser.json(), graphqlServer);
  app.use('/graphiql', graphiqlExpress({ endpointURL: '/graphql' }));
};
