import ServiceProvider from '@thefoxjob/js-service-provider';

import Currency from './Currency';


class CurrencyServiceProvider extends ServiceProvider {
  register() {
    this.ioc.bind('Currency', (ioc, params) => {
      const config = ioc.make('config');
      const options = config.secure.modules.currency;
      const adapter = ioc.make('CurrencyAdapter', { request: params.request, options });

      return new Currency(adapter, options);
    });

    this.ioc.alias('Currency', 'currency');
  }
}

export default CurrencyServiceProvider;
