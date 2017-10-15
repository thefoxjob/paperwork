import react from './react';

const routes = [react];

export default {
  routes,
  setup: (app) => {
    routes.map(route => route(app));
  },
};
