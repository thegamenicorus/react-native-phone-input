import _ from 'lodash';
import libPhoneNumber from 'google-libphonenumber';

import Country from './country';
import countries from './resources/countries.json'; // eslint-disable-line @typescript-eslint/no-unused-vars
import numberType from './resources/numberType.json'; // eslint-disable-line @typescript-eslint/no-unused-vars

const phoneUtil = libPhoneNumber.PhoneNumberUtil.getInstance();
const asYouTypeFormatter = libPhoneNumber.AsYouTypeFormatter;

class PhoneNumber {
    // eslint-disable-next-line class-methods-use-this
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

    // eslint-disable-next-line class-methods-use-this
    getNumeric(str) {
        return str.replace(/\D/g, '');
    }

    // eslint-disable-next-line class-methods-use-this
    isNumeric(n) {
        return !Number.isNaN(parseFloat(n)) && Number.isFinite(Number(n));
    }

    getCountryCodeOfNumber(number) {
        const dialCode = this.getDialCode(number);
        const numeric = this.getNumeric(dialCode);
        const countryCode = Country.getCountryCodes()[numeric];

        // countryCode[0] can be null -> get first element that is not null
        if (countryCode) {
            return _.first(countryCode.filter((iso2: any) => iso2));
        }

        return '';
    }

    // eslint-disable-next-line class-methods-use-this
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

    // eslint-disable-next-line class-methods-use-this
    format(number, iso2) {
        const formatter = new asYouTypeFormatter(iso2); // eslint-disable-line new-cap
        let formatted;

        number.replace(/-/g, '')
            .replace(/ /g, '')
            .replace(/\(/g, '')
            .replace(/\)/g, '')
            .split('')
            .forEach((n: any) => {
                formatted = formatter.inputDigit(n);
            });

        return formatted;
    }

    getNumberType(number, iso2) {
        const phoneInfo = this.parse(number, iso2);
        const type = phoneInfo ? phoneUtil.getNumberType(phoneInfo) : -1;
        return _.findKey((numType, noType) => noType === type);
    }

    // eslint-disable-next-line class-methods-use-this
    getCountryDataByCode(iso2) {
        return Country.getCountryDataByCode(iso2);
    }
}

export default new PhoneNumber();
