import geoip from 'geoip-lite-country';
import getSymbolFromCurrency from 'currency-symbol-map';
import { countries } from 'country-data';

import logger from '../log';

class Currency {
  constructor(request, service) {
    this.request = request;
    this.service = service;
    this.rates = {};
  }

  default() {
    if ( ! this.request.session.currency) {
      const geolocation = geoip.lookup(this.request.headers['x-forwarded-for'] || this.request.ip);

      if (geolocation && geolocation.country && countries[geolocation.country]) {
        const currencies = Object.values(config.references.currencies);

        this.request.session.currency = countries[geolocation.country].currencies.find(currency => currencies.indexOf(currency) >= 0);
      }

      if ( ! this.request.session.currency) {
        this.request.session.currency = config.default.currency || 'USD';
      }
    }

    return this.request.session.currency;
  }

  display(_price, _code, fraction = 0) {
    const code = _code.toUpperCase();
    const price = parseFloat(_price);
    const currency = getSymbolFromCurrency(_code);

    return `${ currency || code }${ price.toFixed(fraction) }`;
  }

  async exchange(_price, _from, _to, _givenRate, display = false, round = true) {
    const price = parseFloat(_price) || 0;
    const givenRate = parseFloat(_givenRate) || 1;
    const from = _from.toUpperCase();
    const to = _to.toUpperCase();

    if (from === to) {
      return price;
    }

    if ( ! this.rates[to]) {
      try {
        /*this.rates[to] = await cache.wrap(`currencies.${ to }`, async () => {
          const response = await this.service.execute('currency', { params: { currency: to } });
          const data = response.body(false);

          if (data.result === 'success') {
            const rates = data[to];
            rates[to] = 1;

            return rates;
          }

          throw new Error(`Unable to get currency ${ to }.`);
        });*/
        this.rates[to] = givenRate;
      } catch (error) {
        logger.error(`Problem occur while trying to get current ${ to } from exchange server.`);
        console.trace(error.stack);

        return null;
      }

    }

    if ( ! this.rates[to][from]) {
      logger.warn(`Rate ${ to } is not found from the conversion rate table.`);
      return price;
    }

    let converted = 0.00;
    const rate = this.rates[to][from];

    if (round) {
      converted = Math.round(price / rate);
    } else {
      converted = Math.round((price / rate) * 100) / 100;
    }

    if (display) {
      return this.display(converted, to);
    }

    return converted.toFixed(2);
  }

  /*
  toCurrency(_price, round = true) {
    const price = parseFloat(_price);

    if (round) {
      return Math.round(price);
    }

    return (Math.round(price * 100) / 100).toFixed(2);
  }
  */
}

export default Currency;
