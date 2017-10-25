/* eslint-env browser */
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';

import Application from './components/Application';


import('middleware/client')
  .then(() => {
    ReactDOM.render(<BrowserRouter><Application /></BrowserRouter>, document.getElementById('root'));
  });
