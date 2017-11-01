import Auth from './Auth';

class AuthServiceProvider {
  constructor(request, options) {
    if ( ! options.adapter) {
      return null;
    }

    const AuthAdapter = options.adapter.default ? options.adapter.default : options.adapter;
    const adapter = new AuthAdapter(request, options.options);

    return new Auth(request, adapter);
  }
}

export default AuthServiceProvider;
