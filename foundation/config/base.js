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
      options: {},
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
    notification: {
      adapters: {
        email: {
          // eslint-disable-next-line global-require
          adapter: require('../notification/adapters/EmailNotificationAdapter'),
          options: {
            sender: null,
          },
        },
        slack: {
          // eslint-disable-next-line global-require
          adapter: require('../notification/adapters/SlackNotificationAdapter'),
          options: {
            token: 'xoxp-2509138989-249078960512-259985951266-f426e3fd5cb32658185c15733df7b2f5',
          },
        },
      },
      default: 'slack',
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
