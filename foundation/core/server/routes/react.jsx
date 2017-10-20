import React from 'react';
import ReactDOMServer from 'react-dom/server';
import fs from 'fs';
import path from 'path';
import { StaticRouter } from 'react-router';

import Application from '../../client/components/Application';
import config from '../../../config';


export default (app) => {
  app.use('*', (request, response) => {
    let stats = null;
    const assets = { scripts: [], stylesheets: [] };
    const context = {};

    const body = ReactDOMServer.renderToString((
      <StaticRouter
        location={ request.url }
        context={ context }
      >
        <Application />
      </StaticRouter>
    ));

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

    return response.status(200).render('index', { assets, body, config });
  });
};
