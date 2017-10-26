class AuthProvider {
  constructor(request, options = {}) {
    this.request = request;
    this.options = options;
  }

  // eslint-disable-next-line class-methods-use-this, no-unused-vars
  async attempt(credential) {
    throw new Error('Not yet implement');
  }

  // eslint-disable-next-line class-methods-use-this, no-unused-vars
  async force(payloads) {
    throw new Error('Not yet implement');
  }

  // eslint-disable-next-line class-methods-use-this
  async user() {
    throw new Error('Not yet implement');
  }
}

export default AuthProvider;
