/**
 * A light-weight alternative to the google-libphonenumber
 */

import isMobilePhone from 'validator/lib/isMobilePhone';
import numberType from './resources/numberType.json';
import Country from './country';

const phoneUtil = {
  parse: function (number, iso2) {
    return {
      iso2,
      number
    };
  },
  isValidNumber: function (phoneInfo) {
    if (phoneInfo) {
      const { number, iso2 } = phoneInfo;
      if (number && iso2) {
        return isMobilePhone(number, Country.getLocale(iso2));
      }
    }

    return false;
  },
  /** Only supports mobile type for now */
  getNumberType: function (phoneInfo) {
    return numberType.MOBILE;
  }
};

export default phoneUtil;

