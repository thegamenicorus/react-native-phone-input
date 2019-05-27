import _ from 'lodash';

import Country from './country';
import numberType from './resources/numberType.json';

const libPhoneNumber = require('google-libphonenumber');
const phoneUtil = libPhoneNumber.PhoneNumberUtil.getInstance();
const asYouTypeFormatter = libPhoneNumber.AsYouTypeFormatter;

let instance = null;

class PhoneNumber {
  static getInstance() {
    if (!instance) {
      instance = new PhoneNumber();
    }
    return instance;
  }

  getAllCountries() {
    return Country.getAll();
  }

  getDialCode(number) {
    let dialCode = '';
    // only interested in international numbers (starting with a plus)
    if (number.charAt(0) === '+') {
      let numericChars = '';
      // iterate over chars
      for (let i = 0; i < number.length; i++) {
        const c = number.charAt(i);
        // if char is number
        if (this.isNumeric(c)) {
          numericChars += c;
          // if current numericChars make a valid dial code
          // if (this.countryCodes[numericChars]) {
          if (Country.getCountryCodes()[numericChars]) {
            // store the actual raw string (useful for matching later)
            dialCode = number.substr(0, i + 1);
          }
          // longest dial code is 4 chars
          if (numericChars.length === 4) {
            break;
          }
        }
      }
    }
    return dialCode;
  }

  getNumeric(str) {
    return str.replace(/\D/g, '');
  }

  isNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
  }

  getCountryCodeOfNumber(number) {
    const dialCode = this.getDialCode(number);
    const numeric = this.getNumeric(dialCode);
    const countryCode = Country.getCountryCodes()[numeric];

    // countryCode[0] can be null -> get first element that is not null
    if (countryCode) {
      return _.first(countryCode.filter(iso2 => iso2));
    }

    return '';
  }

  parse(number, iso2) {
    try {
      return phoneUtil.parse(number, iso2);
    } catch (err) {
      console.log(`Exception was thrown: ${err.toString()}`);
      return null;
    }
  }

  isValidNumber(number, iso2) {
    const phoneInfo = this.parse(number, iso2);

    if (phoneInfo) {
      return phoneUtil.isValidNumber(phoneInfo);
    }

    return false;
  }

  format(number, iso2) {
    const formatter = new asYouTypeFormatter(iso2)
    let formatted;

    number.replace(/-/g, '')
      .replace(/ /g, '')
      .split('')
      .forEach(n => formatted = formatter.inputDigit(n));

    return formatted;
  }

  getNumberType(number, iso2) {
    const phoneInfo = this.parse(number, iso2);
    const type = phoneInfo ? phoneUtil.getNumberType(phoneInfo) : -1;
    return _.findKey(numberType, noType => noType === type);
  }

  getCountryDataByCode(iso2) {
    return Country.getCountryDataByCode(iso2);
  }
}

export default PhoneNumber.getInstance();
