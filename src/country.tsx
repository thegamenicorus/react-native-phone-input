import { find, orderBy } from 'lodash';

class Country {
    private countryCodes: any[];

    private countriesData: any;

    private countries: any;

    constructor() {
        this.countryCodes = [];

        this.countriesData = null;
    }

    setCustomCountriesData(json) {
        this.countriesData = json;
    }

    addCountryCode(iso2, dialCode: string, priority?) {
        if (!(dialCode in this.countryCodes)) {
            this.countryCodes[dialCode] = [];
        }

        const index = priority || 0;
        this.countryCodes[dialCode][index] = iso2;
    }

    getAll() {
        if (!this.countries) {
            this.countries = orderBy(
                this.countriesData || require('./resources/countries.json'), // eslint-disable-line global-require
                ['name'],
                ['asc'],
            );
        }

        return this.countries;
    }

    getCountryCodes() {
        if (!this.countryCodes.length) {
            this.getAll().forEach((country) => {
                this.addCountryCode(country.iso2, country.dialCode, country.priority);
                if (country.areaCodes) {
                    country.areaCodes.forEach((areaCode) => {
                        this.addCountryCode(country.iso2, country.dialCode + areaCode);
                    });
                }
            });
        }
        return this.countryCodes;
    }

    getCountryDataByCode(iso2) {
        return find(this.getAll(), (country) => country.iso2 === iso2);
    }
}

export default new Country();
