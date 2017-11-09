/* eslint-env browser */
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';

import Root from './components/Root';
import environment from '../environment';
import router from './router';


import('application/middleware/client')
  .then(() => {
    const routes = router.setup();
    ReactDOM.render(<BrowserRouter><Root environment={ environment } routes={ routes } /></BrowserRouter>, document.getElementById('root'));
  });
