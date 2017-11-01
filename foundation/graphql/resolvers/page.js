import Page from '../models/Page';


const resolvers = {
  Query: {
    page: async (root, args, context) => {
      const page = await Page.findOne({ uri: args.uri }).exec();

      if (page) {
        const meta = page.meta || {};

        return {
          uri: page.uri,
          name: context.translator.translate(page.name),
          meta: {
            title: context.translator.translate(meta.title),
            description: context.translator.translate(meta.description),
            keyword: context.translator.translate(meta.keyword),
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
