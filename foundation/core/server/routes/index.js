import react from './react.jsx';

const routes = [react];

export default {
  routes,
  setup: (app) => {
    routes.map(route => route(app));
  },
};
