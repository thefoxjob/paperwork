import CurrencyAdapter from '../CurrencyAdapter';


class SimpleCurrencyAdapter extends CurrencyAdapter {
  constructor(request, options = {}) {
    super(request, options);

    this.rates = {};
  }

  async rate(from, to) {
    if (this.rates[from] && this.rates[from][to]) {
      return this.rates[from][to];
    }

    return 1;
  }
}

export default SimpleCurrencyAdapter;
