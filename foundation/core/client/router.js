export default {
  setup: () => {
    try {
      // eslint-disable-next-line import/no-unresolved, global-require
      const routes = require('../../../../../../../application/routes').default;
      return routes.default ? routes.default : routes;
    } catch (error) {
      try {
        // eslint-disable-next-line import/no-unresolved, global-require
        const routes = require('../../../application/routes').default;
        return routes.default ? routes.default : routes;
      } catch (innerError) {
        return [];
      }
    }
  },
};
