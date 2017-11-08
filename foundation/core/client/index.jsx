/* eslint-env browser */
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';

import Application from './components/Application';
import environment from '../environment';


import('application/middleware/client')
  .then(() => {
    ReactDOM.render(<BrowserRouter><Application environment={ environment } /></BrowserRouter>, document.getElementById('root'));
  });
