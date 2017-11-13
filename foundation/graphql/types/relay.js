const queries = `
  node(id: ID!): Node
`;

const schemas = `
  interface Node {
    id: ID!
  }

  type PageInfo {
    startCursor: String
    endCursor: String
    hasNextPage: Boolean
    hasPreviousPage: Boolean
  }

  type Paginate {
    totalItemCount: Int
    currentPageNumber: Int
    totalPageNumber: Int
  }
`;

export default { schemas };
