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
    cache: {
      session: {
        driver: 'redis',
        option: {
        },
      },
    },
    modules: {
      auth: {
      },
      mongoose: {
        url: 'mongodb://localhost:27017',
        options: {},
      },
      notification: {
        adapters: {
          email: {
            options: {
              sender: null,
            },
          },
          slack: {
            options: {
              token: null,
            },
          },
        },
        default: 'slack',
      },
      restful: {
        endpoints: {},
        services: {},
      },
    },
    session: {
      secret: 'important_change_this',
      age: 720000,
      cache: 'session',
    },
    template: {
      engine: 'ejs',
      source: path.resolve(process.cwd(), './application/templates'),
    },
  },
  services: {
    graphql: {
      endpoint: '/graphql',
    },
  },
};
