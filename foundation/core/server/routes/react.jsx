import Helmet from 'react-helmet';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import fs from 'fs';
import path from 'path';
import { StaticRouter } from 'react-router';
import { fetchQuery } from 'react-relay';
import { matchRoutes } from 'react-router-config';

import Application from '../../client/components/Application';
import config from '../../../config';
import getEnvironment from '../../environment';
import router from '../../client/router';


export default (app) => {
  app.use('*', async (request, response) => {
    let stats = null;
    const assets = { scripts: [], stylesheets: [] };
    const context = {};

    const promises = [];
    const routes = router.setup();
    const branch = matchRoutes(routes, request.path);
    const environment = getEnvironment(`${ request.protocol }://${ request.hostname }${ config.secure.application.port !== 80 ? `:${ config.secure.application.port }` : '' }`);

    branch.forEach(({ route, match }) => {
      if (route.query) {
        promises.push(fetchQuery(environment, route.query, typeof (route.variables) === 'function' ? route.variables(match.params) : route.variables));
      }
    });

    try {
      await Promise.all(promises);
    } catch (error) {
      // TODO: log
    }

    const body = ReactDOMServer.renderToString((
      <StaticRouter
        location={ request.baseUrl }
        context={ context }
      >
        <Application branch={ branch } environment={ environment } />
      </StaticRouter>
    ));

    const helmet = Helmet.renderStatic();

    if (response.locals.webpackDevMiddleware) {
      stats = JSON.parse(response.locals.webpackDevMiddleware.fileSystem.readFileSync(path.resolve(config.secure.application.public, './build/stats.json')).toString());
    } else if (fs.existsSync(path.resolve(config.secure.application.public, './build/stats.json'))) {
      stats = JSON.parse(fs.readyFileSync(path.resolve(config.secure.application.public, './build/stats.json')).toString());
    }

    stats.chunks.forEach(chunk => chunk.files.forEach((file) => {
      if (/.css($|\?)/.test(file)) {
        assets.stylesheets.push(path.join(stats.publicPath, file));
      } else if (/.js($|\?)/.test(file)) {
        if (chunk.entry) {
          assets.scripts.unshift(path.join(stats.publicPath, file));
        } else {
          assets.scripts.push(path.join(stats.publicPath, file));
        }
      }
    }));

    const configuration = Object.assign({}, config);
    delete configuration.secure;

    return response.status(200).render('index', { assets, body, config: configuration, helmet });
  });
};
