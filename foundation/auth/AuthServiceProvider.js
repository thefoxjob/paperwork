import ServiceProvider from '@thefoxjob/js-service-provider';

import Auth from './Auth';


class AuthServiceProvider extends ServiceProvider {
  register() {
    this.ioc.bind('Auth', (ioc, params: Object) => {
      const config = ioc.make('config');
      const options = config.secure.modules.auth;
      const Adapter = ioc.make('AuthAdapter');
      const adapter = new Adapter(params.request, options);

      return new Auth(params.request, adapter);
    });

    this.ioc.alias('Auth', 'auth');
  }
}

export default AuthServiceProvider;
