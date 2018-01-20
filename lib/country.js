import { find, orderBy } from 'lodash';
import countryData from './resources/countries.json';

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
      this.countries = orderBy(countryData, ['name'], ['asc']);
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
}

export default Country.getInstance();
