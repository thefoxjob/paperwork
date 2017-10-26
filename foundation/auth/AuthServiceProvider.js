import Auth from './Auth';

class AuthServiceProvider {
  constructor(request, options) {
    const AuthAdapter = options.adapter.default;
    const adapter = new AuthAdapter(request, options.options);

    return new Auth(request, adapter);
  }
}

export default AuthServiceProvider;
