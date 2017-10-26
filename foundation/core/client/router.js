export default {
  setup: async () => {
    try {
      const routes = await import('routes');
      return routes.default ? routes.default : routes;
    } catch (error) {
      return [];
    }
  },
};
