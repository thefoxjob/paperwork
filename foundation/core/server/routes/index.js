import configuration from './configuration';
import react from './react';


const routes = [configuration, react];

export default {
  routes,
  setup: app => routes.map(route => route(app)),
};
