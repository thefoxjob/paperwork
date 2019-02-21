export default {
  setup: () => {
    try {
      // eslint-disable-next-line import/no-unresolved, global-require
      const routes = require('../../../src/routes');
      return routes.default ? routes.default : routes;
    } catch (error) {
      return [];
    }
  },
};
