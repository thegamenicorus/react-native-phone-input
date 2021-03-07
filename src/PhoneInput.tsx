import React from 'react';
import {
    Image, TextInput, TouchableWithoutFeedback, View
} from 'react-native';
import Country from './country';
import Flags from './resources/flags';
import PhoneNumber from './phoneNumber';
import styles from './styles';
import CountryPicker from './CountryPicker';
import { ReactNativePhoneInputProps } from './typings';

export default class PhoneInput<TextComponentType extends React.ComponentType = typeof TextInput>
    extends React.Component<ReactNativePhoneInputProps<TextComponentType>, any> {
    static setCustomCountriesData(json) {
        Country.setCustomCountriesData(json);
    }

    private picker: any;

    private inputPhone: any;

    constructor(props) {
        super(props);

        let {
            initialCountry, initialValue
        } = this.props;

        const {
            countriesList, disabled,
        } = this.props;

        if (countriesList) {
            Country.setCustomCountriesData(countriesList);
        }

        let displayValue = '';

        if (initialValue) {
            if (initialValue[0] !== '+') {
                initialValue = `+${initialValue}`;
            }

            initialCountry = PhoneNumber.getCountryCodeOfNumber(initialValue);
            displayValue = this.format(initialValue, initialCountry);
        } else {
            const countryData = PhoneNumber.getCountryDataByCode(initialCountry);
            initialValue = countryData ? `+${countryData.dialCode}` : '';
            displayValue = initialValue;
        }

        this.state = {
            disabled,
            iso2: initialCountry,
            displayValue,
            value: initialValue,
        };
    }

    componentDidUpdate() {
        const { disabled } = this.props;
        if (disabled !== this.state.disabled) {
            this.setState({ disabled }); // eslint-disable-line react/no-did-update-set-state
        }
    }

    onChangePhoneNumber = (number) => {
        const actionAfterSetState = this.props.onChangePhoneNumber
            ? (value: string, iso2: string) => {
                    this.props.onChangePhoneNumber?.(value, iso2);
            }
            : null;
        this.updateValue(number, actionAfterSetState);
    }

    onPressFlag = () => {
        if (this.props.onPressFlag) {
            this.props.onPressFlag();
        } else {
            if (this.state.iso2) this.picker.selectCountry(this.state.iso2);
            this.picker.show();
        }
    }

    // eslint-disable-next-line class-methods-use-this
    getPickerData() {
        return PhoneNumber.getAllCountries().map((country, index) => ({
            key: index,
            image: Flags.get(country.iso2),
            label: country.name,
            dialCode: `+${country.dialCode}`,
            iso2: country.iso2
        }));
    }

    getCountryCode() {
        const countryData = PhoneNumber.getCountryDataByCode(this.state.iso2);
        return countryData ? countryData.dialCode : null;
    }

    // eslint-disable-next-line class-methods-use-this
    getAllCountries() {
        return PhoneNumber.getAllCountries();
    }

    // eslint-disable-next-line class-methods-use-this
    getFlag = (iso2) => Flags.get(iso2);

    getDialCode() {
        return PhoneNumber.getDialCode(this.state.value);
    }

    getValue(text?) {
        return (text || this.state.displayValue)
            .replace(/[^0-9]/g, '');
    }

    getNumberType() {
        return PhoneNumber.getNumberType(
            this.state.value,
            this.state.iso2
        );
    }

    getISOCode = () => this.state.iso2;

    selectCountry = (iso2) => {
        if (this.state.iso2 !== iso2) {
            const countryData = PhoneNumber.getCountryDataByCode(iso2);
            if (countryData) {
                this.setState(
                    {
                        iso2,
                        displayValue: this.format(`+${countryData.dialCode}`),
                        value: `+${countryData.dialCode}`
                    },
                    () => {
                        if (this.props.onSelectCountry) this.props.onSelectCountry(iso2);
                    }
                );
            }
        }
    }

    setNumber = (number) => {
        if (this.state.value !== number) {
            this.updateValue(number);
        }
    }

    isValidNumber() {
        if (this.state.value.length < 4) return false;
        return PhoneNumber.isValidNumber(
            this.state.value,
            this.state.iso2
        );
    }

    format(text, iso2?) {
        return this.props.autoFormat
            ? PhoneNumber.format(text, iso2 || this.state.iso2)
            : text;
    }

    updateValue(number, actionAfterSetState: any = null) {
        let modifiedNumber = this.getValue(number);
        const { allowZeroAfterCountryCode } = this.props;

        if (modifiedNumber[0] !== '+' && number.length) {
            modifiedNumber = `+${modifiedNumber}`;
        }
        modifiedNumber = allowZeroAfterCountryCode
            ? modifiedNumber
            : this.possiblyEliminateZeroAfterCountryCode(modifiedNumber);
        const iso2: string = PhoneNumber.getCountryCodeOfNumber(modifiedNumber);

        this.setState({
            iso2,
            displayValue: this.format(modifiedNumber),
            value: modifiedNumber,
        }, () => actionAfterSetState(modifiedNumber, iso2));
    }

    // eslint-disable-next-line class-methods-use-this
    possiblyEliminateZeroAfterCountryCode(number) {
        const dialCode = PhoneNumber.getDialCode(number);
        return number.startsWith(`${dialCode}0`)
            ? dialCode + number.substr(dialCode.length + 1)
            : number;
    }

    focus() {
        this.inputPhone.focus();
    }

    blur() {
        this.inputPhone.blur();
    }

    render() {
        const { iso2, displayValue, disabled } = this.state;
        const TextComponent: any = this.props.textComponent || TextInput;
        return (
            <View style={[styles.container, this.props.style]}>
                <TouchableWithoutFeedback
                    onPress={this.onPressFlag}
                    disabled={disabled}
                >
                    <Image
                        source={Flags.get(iso2)}
                        style={[styles.flag, this.props.flagStyle]}
                    />
                </TouchableWithoutFeedback>
                <View style={{ flex: 1, marginLeft: this.props.offset || 10 }}>
                    <TextComponent
                        ref={(ref) => {
                            this.inputPhone = ref;
                        }}
                        editable={!disabled}
                        autoCorrect={false}
                        style={[styles.text, this.props.textStyle]}
                        onChangeText={(text) => {
                            this.onChangePhoneNumber(text);
                        }}
                        keyboardType="phone-pad"
                        underlineColorAndroid="rgba(0,0,0,0)"
                        value={displayValue}
                        {...this.props.textProps}
                    />
                </View>

                <CountryPicker
                    ref={(ref) => {
                        this.picker = ref;
                    }}
                    selectedCountry={iso2}
                    onSubmit={this.selectCountry}
                    buttonColor={this.props.pickerButtonColor}
                    cancelText={this.props.cancelText}
                    cancelTextStyle={this.props.cancelTextStyle}
                    confirmText={this.props.confirmText}
                    confirmTextStyle={this.props.confirmTextStyle}
                    pickerBackgroundColor={this.props.pickerBackgroundColor}
                    itemStyle={this.props.pickerItemStyle}
                    onPressCancel={this.props.onPressCancel}
                    onPressConfirm={this.props.onPressConfirm}
                />
            </View>
        );
    }
}
