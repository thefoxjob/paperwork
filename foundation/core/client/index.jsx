/* eslint-env browser */
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';

import Environment from '../environment';
import RelayContext from '../../contexts/RelayContext';
import Root from './components/Root';
import config from '../../config';
import routes from '../../../src/routes';


import('../../../src/middleware/client')
  .then(() => {
    const environment = Environment.instance(config.get('graphql.endpoint'));

    ReactDOM.hydrate(
      (
        <RelayContext.Provider value={{ environment }}>
          <BrowserRouter>
            <Root environment={ environment } routes={ routes } />
          </BrowserRouter>
        </RelayContext.Provider>
      ),
      document.getElementById('root'),
    );
  });
