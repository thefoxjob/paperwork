class CurrencyAdapter {
  constructor(request, options = {}) {
    this.request = request;
    this.options = options;
  }

  // eslint-disable-next-line class-methods-use-this, no-unused-vars
  rate(from, to) {
    throw new Error('Not yet implement');
  }
}

export default CurrencyAdapter;
