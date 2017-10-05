import path from 'path';


export default {
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
    cache: {
      session: {
        driver: 'redis',
        option: {
        },
      },
    },
    server: {
    },
    session: {
      secret: 'notsosecretsecret',
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
