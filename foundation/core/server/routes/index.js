import configuration from './configuration';
import graphql from './graphql';
import react from './react';

const routes = [configuration, graphql, react];

export default {
  routes,
  setup: (app) => {
    routes.map(route => route(app));
  },
};
