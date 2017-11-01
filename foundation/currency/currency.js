import symbol from 'currency-symbol-map';

class Currency {
  constructor(source) {
    this.source = source;
  }

  static display(_price, code, fraction = 0) {
    const price = parseFloat(_price);
    const currency = symbol(code);

    return `${ currency }${ price.toFixed(fraction) }`;
  }

  convert(_price, _from, _to, display = false, round = false, fraction = 0) {
    this.source.load();
    const price = parseFloat(_price) || 0;
    const from = _from.toUpperCase();
    const to = _to.toUpperCase();
    const rate = this.source.rate(from, to) || 1;

    if (from === to) {
      return price;
    }

    let converted = 0.00;

    if (round) {
      converted = Math.round(price * rate);
    } else {
      converted = price * rate;
    }

    if (display) {
      return this.display(converted, to);
    }

    return converted.toFixed(fraction);
  }
}

export default Currency;
