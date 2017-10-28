class Translator {
  constructor(request, i18n) {
    this.i18n = i18n;
    this.request = request;
  }

  exists(keys, options) {
    return this.i18n.exists(keys, options);
  }

  t(keys, options) {
    return this.translate(keys, options);
  }

  translate(keys, options) {
    if (Array.isArray(keys) && keys.length > 0 && keys[0] !== null && typeof keys[0] === 'object') {
      let bestMatched = null;
      const country = this.request.country ? this.request.country.toLowerCase() : null;
      const language = this.request.language ? this.request.language.toLowerCase() : 'en';

      for (let i = 0; i < keys.length; i + 1) {
        const value = keys[i];

        if (value.locale === `${ language }-${ country }`) {
          return value.content;
        } else if (value.locale === language) {
          bestMatched = value.content;
        }
      }

      return bestMatched;
    }

    return this.i18n.t(keys, options);
  }
}

export default Translator;
