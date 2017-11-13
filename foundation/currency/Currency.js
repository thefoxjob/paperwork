import { currencies } from 'country-data';


class Currency {
  constructor(adapter) {
    this.adapter = adapter;
  }

  async exchange(price: Number, to: String, from: String, round: Boolean = true) {
    if (from === to) {
      return price;
    }

    const rate = await this.adapter.rate(from.toUpperCase(), to.toUpperCase());

    if (round) {
      return Math.round(price / rate).toFixed(2);
    }

    return (Math.round((price / rate) * 100) / 100).toFixed(2);
  }

  async format(price: Number, to: String, from: String = null, round: Boolean = true) {
    const { symbol } = currencies[to.toUpperCase()];

    return `${ symbol || to.toUpperCase() }${ from ? this.exchange(price, to, from, round) : price }`;
  }
}

export default Currency;