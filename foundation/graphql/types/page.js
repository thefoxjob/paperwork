const queries = `
  page(path: String!): Page
`;

const schemas = `
  type PageMeta {
    title: String
    description: String
    keyword: String
    image: String
    type: String
  }

  type PageDirectory {
    name: String
    path: String
  }

  type PageCustom {
    script: String
    stylesheet: String
  }

  type Page {
    uri: String
    name: String
    meta: PageMeta
    directories: [PageDirectory]
    custom: PageCustom
  }
`;

export default { queries, schemas };
