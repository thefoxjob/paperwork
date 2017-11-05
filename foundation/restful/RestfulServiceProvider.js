import ServiceProvider from '@thefoxjob/js-service-provider';

import Restful from './Restful';


class RestfulServiceProvider extends ServiceProvider {
  register() {
    this.ioc.bind('Restful', (ioc, params) => {
      const config = ioc.make('config');

      return new Restful(params.request, config.secure.modules.restful.endpoints, config.secure.modules.restful.services);
    });

    this.ioc.alias('Restful', 'restful');
  }
}

export default RestfulServiceProvider;
