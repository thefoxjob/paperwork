import React from 'react';
import ReactDOM from 'react-dom/server';
import { StaticRouter } from 'react-router';

import Application from '../../client/components/Application';
import template from '../../../templates';


export default (app) => {
  app.use('*', (request, response, next) => {
    const context = {};

    const html = ReactDOM.server.renderToString(
      <StaticRouter
        location={ request.url }
        context={ context }
      >
        <Application />
      </StaticRouter>
    );

    return response.status(200).render('index');
  });
};
