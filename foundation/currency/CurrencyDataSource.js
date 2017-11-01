class CurrencyDataSource {
  constructor(request, rates = {}) {
    this.request = request;
    this.rates = rates;
  }

  // eslint-disable-next-line class-methods-use-this, no-unused-vars
  rate(from, to) {
    throw new Error('Not yet implement');
  }

  // eslint-disable-next-line class-methods-use-this, no-unused-vars
  load() {
    throw new Error('Not yet implement');
  }
}

export default CurrencyDataSource;

