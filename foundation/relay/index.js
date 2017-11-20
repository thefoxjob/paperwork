import { cursorToOffset, fromGlobalId, offsetToCursor, toGlobalId } from 'graphql-relay';


export { cursorToOffset, fromGlobalId, offsetToCursor, toGlobalId };

export const makeConnection = (name, fields = null) => `
  type ${ name }Edge {
    cursor: String
    node: ${ name }
  }

  type ${ name }Connection {
    ${ fields || '' }
    edges: [${ name }Edge]
    pageInfo: PageInfo
    next: String
  }
`;

export const mutationWithClientMutationId = (name, options = {}) => `
  input ${ name }Input {
    clientMutationId: String
    ${ options.inputFields || '' }
  }

  type ${ name }Payload {
    clientMutationId: String
    ${ options.outputFields || '' }
  }
`;

export const connectionArguments = 'first: Int, last: Int, before: String, after: String';

export const connectionFromArray = (data, args, meta = {}) => {
  const offset = typeof args.after !== 'string' ? - 1 : cursorToOffset(args.after);
  const first = Number.isNaN(args.first) ? data.length : args.first;

  const startOffset = offset + 1;
  const endOffset = startOffset + ((first > data.length) ? first : data.length);

  const slice = data.slice(0, first > data.length ? first : data.length);
  const edges = slice.map((value, index) => ({
    cursor: offsetToCursor(startOffset + index),
    node: value,
  }));

  let { totalPageNumber } = meta;

  if ( ! totalPageNumber && (meta.totalItemCount && meta.limit)) {
    totalPageNumber = Math.ceil(meta.totalItemCount / meta.limit);
  }

  return {
    edges,
    pageInfo: {
      startCursor: edges[0] ? edges[0].cursor : null,
      endCursor: edges.length > 0 ? edges[edges.length - 1].cursor : null,
      hasPreviousPage: startOffset > 0,
      hasNextPage: meta.count ? meta.count > endOffset : false,
    },
    paginate: {
      totalItemCount: meta.totalItemCount || 0,
      currentPageNumber: meta.currentPageNumber || null,
      totalPageNumber,
    },
  };
};

export const mutateAndGetPayload = (input, payload) => Object.assign({ clientMutationId: input.clientMutationId }, payload);

export const globalIdFieldResolver = (root, _args, _context, info) => toGlobalId(info.parentType, root.id);

export default { connectionArguments, connectionFromArray, fromGlobalId, globalIdFieldResolver, makeConnection, mutateAndGetPayload, mutationWithClientMutationId };
