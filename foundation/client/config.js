/* eslint-env browser */
import _ from 'lodash';


let config = null;

export const load = async () => {
  if (typeof (window) === 'undefined') {
    // eslint-disable-next-line global-require
    //config = require('../config/safe').default;
  } else {
    const response = await window.fetch('/configuration');
    config = JSON.parse(Buffer.from(await response.text(), 'base64').toString());
    window.config = config;
  }
};

export const get = (key, fallback = null) => {
  if (typeof (window) !== 'undefined') {
    return _.get(window.config || {}, key, fallback);
  }

  if ( ! config) {
    load();
  }

  return _.get(config || {}, key, fallback);
};

export default { get, load };
