const path = require('path');

module.exports = {
  application: {
    port: 3000,
    public: path.resolve(__dirname, '../public'),
  },
  debug: ! process.argv.includes('--release'),
  graphql: {
    schema: path.resolve(__dirname, './build/schema.json'),
    use: false,
  },
  public: {
    graphql: {
      endpoint: 'http://localhost:8000/graphql',
    },
  },
  template: {
    engine: 'ejs',
    source: path.resolve(__dirname, '../templates'),
  },
};
