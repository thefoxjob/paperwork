import Page from '../models/Page';


const resolvers = {
  Query: {
    page: async (root, args, context) => {
      const { i18n } = context;
      const page = await Page.findOne({ path: args.path }).exec();

      if (page) {
        const meta = page.meta || {};

        return {
          path: page.path,
          name: i18n.translate(page.name),
          meta: {
            title: i18n.translate(meta.title),
            description: i18n.translate(meta.description),
            keyword: i18n.translate(meta.keyword),
            image: meta.image,
            type: meta.type,
          },
          custom: page.custom,
        };
      }

      return null;
    },
  },
  Page: {
    directories: () => {},
  },
};

export default resolvers;
