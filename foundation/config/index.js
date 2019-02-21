/* eslint-env browser */
import { pathOr } from 'ramda';

export default {
  get: (key, fallback = null) => {
    if (typeof (window) !== 'undefined') {
      const config = JSON.parse(atob(window.config));

      return pathOr(fallback, key.split('.'), config);
    }

    // eslint-disable-next-line global-require
    const config = require('config');

    return config.get(`public.${ key }`, fallback);
  },
};
