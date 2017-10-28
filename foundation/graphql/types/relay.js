const schemas = `
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
