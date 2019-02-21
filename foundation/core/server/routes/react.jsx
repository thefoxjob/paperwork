import Helmet from 'react-helmet';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import config from 'config';
import fs from 'fs';
import path from 'path';
import { StaticRouter } from 'react-router';
import { fetchQuery } from 'relay-runtime';
import { matchRoutes } from 'react-router-config';

import Environment from '../../environment';
import RelayContext from '../../../contexts/RelayContext';
import Root from '../../client/components/Root';
import routes from '../../../../src/routes';


export default (app) => {
  app.get('*', async (request, response) => {
    const assets = { scripts: [], stylesheets: [] };
    const context = {};

    const promises = [];
    const branch = matchRoutes(routes, request.path);
    const environment = Environment.instance(config.get('public.graphql.endpoint'));
    const location = { pathname: request.path, query: request.query };

    branch.forEach(({ route, match }) => {
      if (route.query) {
        promises.push(fetchQuery(
          environment,
          route.query,
          typeof (route.variables) === 'function' ? route.variables({ params: match.params, ...location }) : route.variables,
        ));
      }
    });

    try {
      await Promise.all(promises);
    } catch (error) {
      console.error(error);
    }

    const body = ReactDOMServer.renderToString((
      <RelayContext.Provider value={{ environment }}>
        <StaticRouter
          location={ request.baseUrl }
          context={ context }
        >
          <Root environment={ environment } routes={ routes } />
        </StaticRouter>
      </RelayContext.Provider>
    ));

    const helmet = Helmet.renderStatic();
    const chunks = JSON.parse(fs.readFileSync(path.resolve(config.get('application.public'), './build/chunk-manifest.json')).toString());

    Object.values(chunks).forEach(chunk => chunk.forEach((asset) => {
      if (/.css($|\?)/.test(asset)) {
        assets.stylesheets.push(asset);
      } else if (/.js($|\?)/.test(asset)) {
        assets.scripts.push(asset);
      }
    }));

    const configuration = Object.assign({}, config.get('public'));

    return response
      .status(context.status ? context.status : 200)
      .render('index', { assets, body, config: configuration, helmet });
  });
};
