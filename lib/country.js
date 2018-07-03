import find from 'lodash/find';
import orderBy from 'lodash/orderBy';

import { getLocale } from '@bodhiveggie/countries';

let instance = null;

class Country {
  static getInstance() {
    if (!instance) {
      instance = new Country();
    }
    return instance;
  }

  constructor() {
    this.countryCodes = [];

    this.countriesData = null;
  }

  setCustomCountriesData(json) {
    this.countriesData = json;
  }

  addCountryCode(iso2, dialCode, priority) {
    if (!(dialCode in this.countryCodes)) {
      this.countryCodes[dialCode] = [];
    }

    const index = priority || 0;
    this.countryCodes[dialCode][index] = iso2;
  }

  getAll() {
    if (!this.countries) {
      this.countries = orderBy(
        this.countriesData || require('@bodhiveggie/countries/resources/countries.json'),
        ['name'],
        ['asc'],
      );
    }

    return this.countries;
  }

  getCountryCodes() {
    if (!this.countryCodes.length) {
      this.getAll().map((country) => {
        this.addCountryCode(country.iso2, country.dialCode, country.priority);
        if (country.areaCodes) {
          country.areaCodes.map((areaCode) => {
            this.addCountryCode(country.iso2, country.dialCode + areaCode);
          });
        }
      });
    }
    return this.countryCodes;
  }

  getCountryDataByCode(iso2) {
    return find(this.getAll(), country => country.iso2 === iso2);
  }

  getLocale(iso2) {
    return getLocale(iso2);
  }
}

const localesMap = (function () {
  let map = {};
  /** Copied from npm pkg: validor/lib/isMobilePhone */
  [
    'ar-AE', 'ar-DZ', 'ar-EG', 'ar-JO', 'ar-KW', 'ar-SA', 'ar-SY',
    'ar-TN', 'be-BY', 'bg-BG', 'cs-CZ', 'de-DE', 'da-DK', 'el-GR',
    'en-AU', 'en-CA', 'en-GB', 'en-HK', 'en-IN', 'en-KE', 'en-NG',
    'en-NZ', 'en-RW', 'en-SG', 'en-UG', 'en-US', 'en-TZ', 'en-ZA',
    'en-ZM', 'en-PK', 'es-ES', 'et-EE', 'fa-IR', 'fi-FI', 'fr-FR',
    'he-IL', 'hu-HU', 'it-IT', 'ja-JP', 'kk-KZ', 'ko-KR', 'lt-LT',
    'ms-MY', 'nb-NO', 'nn-NO', 'pl-PL', 'pt-PT', 'pt-BR', 'ro-RO',
    'ru-RU', 'sk-SK', 'sr-RS', 'sv-SE', 'th-TH', 'tr-TR', 'uk-UA',
    'vi-VN', 'zh-CN', 'zh-HK', 'zh-TW'
  ].forEach((l) => {
    let iso2 = l.substr(3);
    map[iso2] = l;
  });

  return map;

})();

export default Country.getInstance();
