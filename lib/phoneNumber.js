import _ from 'lodash'
import Country from './country'
import number_type from './resources/numberType.json'
let PNF = require('google-libphonenumber').PhoneNumberFormat;
let phoneUtil = require('google-libphonenumber').PhoneNumberUtil.getInstance();
let instance = null;
class PhoneNumber {

    static getInstance() {
        if (!instance) {
            instance = new PhoneNumber()
        }
        return instance
    }

    constructor() {
        
    }

    getAllCountries(){
        return Country.getAll()
    }

    getDialCode(number) {
        var dialCode = "";
        // only interested in international numbers (starting with a plus)
        if (number.charAt(0) == "+") {
            var numericChars = "";
            // iterate over chars
            for (var i = 0; i < number.length; i++) {
                var c = number.charAt(i);
                // if char is number
                if (this.isNumeric(c)) {
                    numericChars += c;
                    // if current numericChars make a valid dial code
                    //if (this.countryCodes[numericChars]) {
                    if(Country.getCountryCodes()[numericChars]){
                        // store the actual raw string (useful for matching later)
                        dialCode = number.substr(0, i + 1);
                    }
                    // longest dial code is 4 chars
                    if (numericChars.length == 4) {
                        break;
                    }
                }
            }
        }
        return dialCode;
    }

    getNumeric(str) {
        return str.replace(/\D/g, "");
    }

    isNumeric(n) {
        return !isNaN(parseFloat(n)) && isFinite(n);
    }

    getCountryCodeOfNumber(number){
        var dialCode = this.getDialCode(number)
        var numeric = this.getNumeric(dialCode)
        var countryCode = Country.getCountryCodes()[numeric]

        //countryCode[0] can be null -> get first element that is not null
        if(countryCode)
            return _.first(countryCode.filter(iso2 => iso2))
        else return ''
    }

    parse(number, iso2){
        try {
            return phoneUtil.parse(number, iso2);
        } catch (err) {
            console.log("Exception was thrown: " + err.toString());
            return null
        }
    }

    isValidNumber(number, iso2){
        var phoneInfo = this.parse(number, iso2)
        if(phoneInfo)
            return phoneUtil.isValidNumber(phoneInfo)
        else return false
    }

    getNumberType(number, iso2){
        var phoneInfo = this.parse(number, iso2)
        var type = -1
        if(phoneInfo)
            type = phoneUtil.getNumberType(phoneInfo)
        return _.findKey(number_type, noType => noType === type)
    }

    getCountryDataByCode(iso2){
        return Country.getCountryDataByCode(iso2)
    }
}

export default PhoneNumber.getInstance()