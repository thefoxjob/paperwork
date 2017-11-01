export default {
  setup: async () => {
    try {
      const routes = await import('application/routes');
      return routes.default ? routes.default : routes;
    } catch (error) {
      return [];
    }
  },
};
