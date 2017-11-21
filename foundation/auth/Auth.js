class Auth {
  constructor(request, adapter) {
    this.adapter = adapter;
    this.request = request;
  }

  async attempt(credential) {
    if ( ! this.request.session) {
      this.request.session = {};
    }

    const auth = await this.adapter.attempt(credential);

    if (auth) {
      this.request.session.auth = auth;
      return true;
    }

    return false;
  }

  check() {
    return this.request.session.auth || this.request.auth;
  }

  async force(payloads) {
    const auth = await this.adapter.force(payloads);

    if (auth) {
      this.request.session.auth = auth;
      return true;
    }

    return false;
  }

  logout() {
    return new Promise((resolve, reject) => this.request.session.destroy((error) => {
      if (error) {
        return reject(error);
      }

      return resolve();
    }));
  }

  user(refresh) {
    return this.adapter.user(refresh);
  }
}

export default Auth;
