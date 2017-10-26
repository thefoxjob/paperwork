import path from 'path';


export default {
  debug: ! process.env.NODE_ENV || process.argv.includes('--debug'),
  references: {
    countries: [],
    currencies: [],
    sites: [],
  },
  secure: {
    application: {
      port: 3000,
      public: path.resolve(process.cwd(), 'public'),
    },
    auth: {
      adapter: null,
      options: {
        service: {
          login: null,
          logout: null,
        },
      },
    },
    cache: {
      session: {
        driver: 'redis',
        option: {
        },
      },
    },
    database: {
      mongoose: {
        uri: 'mongodb://localhost:27017',
      },
    },
    server: {
    },
    service: {
      endpoints: {},
      services: {},
    },
    session: {
      secret: 'important_change_this',
      age: 720000,
      cache: 'session',
    },
    template: {
      engine: 'ejs',
      source: path.resolve(process.cwd(), 'templates'),
    },
  },
  services: {
    graphql: {
      endpoint: '/graphql',
    },
  },
};
