/* eslint-env browser */
import _ from 'lodash';


let config = null;

export const load = async () => {
  if (typeof (window) === 'undefined') {
    // eslint-disable-next-line global-require
    config = require('../config').default;
  } else {
    const response = await window.fetch('/configuration');
    config = await response.text();
    window.config = btoa(config);
  }
};

export const get = (key, fallback = null) => {
  if (typeof (window) !== 'undefined') {
    const configuration = JSON.parse(atob(window.config));
    return _.get(configuration || {}, key, fallback);
  }

  if ( ! config) {
    load();
  }

  return _.get(config || {}, key, fallback);
};

export default { get, load };
