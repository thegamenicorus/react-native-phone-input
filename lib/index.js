import React, { Component } from "react";
import { Image, TextInput, TouchableWithoutFeedback, View } from "react-native";
import PropTypes from "prop-types";

import Country from "./country";
import Flags from "./resources/flags";
import PhoneNumber from "./phoneNumber";
import styles from "./styles";
import CountryPicker from "./countryPicker";

export default class PhoneInput extends Component {
  static setCustomCountriesData(json) {
    Country.setCustomCountriesData(json);
  }

  constructor(props, context) {
    super(props, context);

    this.onChangePhoneNumber = this.onChangePhoneNumber.bind(this);
    this.onPressFlag = this.onPressFlag.bind(this);
    this.selectCountry = this.selectCountry.bind(this);
    this.getFlag = this.getFlag.bind(this);
    this.getISOCode = this.getISOCode.bind(this);

    const { countriesList, disabled, initialCountry } = this.props;

    if (countriesList) {
      Country.setCustomCountriesData(countriesList);
    }
    const countryData = PhoneNumber.getCountryDataByCode(initialCountry);

    this.state = {
      iso2: initialCountry,
      disabled,
      formattedNumber: countryData ? `+${countryData.dialCode}` : "",
      value: null,
      inputValue: "",
    };
  }

  componentWillMount() {
    if (this.props.value) {
      this.updateFlagAndFormatNumber(this.props.value);
    }
  }

  componentWillReceiveProps(nextProps) {
    const { value, disabled } = nextProps;
    this.setState({ disabled });

    if (value && value !== this.state.value) {
      this.setState({ value });
      this.updateFlagAndFormatNumber(value);
    }
  }

  onChangePhoneNumber(number) {
    const actionAfterSetState = this.props.onChangePhoneNumber
      ? () => {
          this.props.onChangePhoneNumber(number);
        }
      : null;
    this.updateFlagAndFormatNumber(number, actionAfterSetState);
  }

  onPressFlag() {
    if (this.props.onPressFlag) {
      this.props.onPressFlag();
    } else {
      if (this.state.iso2) this.picker.selectCountry(this.state.iso2);
      this.picker.show();
    }
  }

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

  getAllCountries() {
    return PhoneNumber.getAllCountries();
  }

  getFlag(iso2) {
    return Flags.get(iso2);
  }

  getDialCode() {
    return PhoneNumber.getDialCode(this.state.formattedNumber);
  }

  getValue() {
    return this.state.formattedNumber.replace(/\s/g,'');
  }

  getNumberType() {
    return PhoneNumber.getNumberType(
      this.state.formattedNumber,
      this.state.iso2
    );
  }

  getISOCode() {
    return this.state.iso2;
  }

  selectCountry(iso2) {
    if (this.state.iso2 !== iso2) {
      const countryData = PhoneNumber.getCountryDataByCode(iso2);
      if (countryData) {
        this.setState(
          {
            iso2,
            formattedNumber: `+${countryData.dialCode}`
          },
          () => {
            this.updateFlagAndFormatNumber(this.state.inputValue)
            if (this.props.onSelectCountry) this.props.onSelectCountry(iso2);
          }
        );
      }
    }
  }

  isValidNumber() {
    if (this.state.inputValue.length < 3) return false;
    return PhoneNumber.isValidNumber(
      this.state.formattedNumber,
      this.state.iso2
    );
  }

  format(text) {
    return this.props.autoFormat
      ? PhoneNumber.format(text, this.state.iso2)
      : text;
  }

  updateFlagAndFormatNumber(number, actionAfterSetState = null) {
    const { allowZeroAfterCountryCode, initialCountry } = this.props;
    let iso2 = this.getISOCode() || initialCountry;
    let formattedPhoneNumber = number;
    if (number) {
      const countryCode = this.getCountryCode();
      if (formattedPhoneNumber[0] !== "+" && countryCode !== null) {
        formattedPhoneNumber = '+' + countryCode.toString() + formattedPhoneNumber.toString();
      }
      formattedPhoneNumber = allowZeroAfterCountryCode
        ? formattedPhoneNumber
        : this.possiblyEliminateZeroAfterCountryCode(formattedPhoneNumber);
      iso2 = PhoneNumber.getCountryCodeOfNumber(formattedPhoneNumber);
    }
    this.setState({ iso2, formattedNumber: formattedPhoneNumber, inputValue: number }, actionAfterSetState);
  }

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
    const { iso2, inputValue, disabled } = this.state;
    const TextComponent = this.props.textComponent || TextInput;
    return (
      <View style={[styles.container, this.props.style]}>
        <TouchableWithoutFeedback
          onPress={this.onPressFlag}
          disabled={disabled}
        >
          <Image
            source={Flags.get(iso2)}
            style={[styles.flag, this.props.flagStyle]}
            onPress={this.onPressFlag}
          />
        </TouchableWithoutFeedback>
        <View style={{ flex: 1, marginLeft: this.props.offset || 10 }}>
          <TextComponent
            ref={ref => {
              this.inputPhone = ref;
            }}
            editable={!disabled}
            autoCorrect={false}
            style={[styles.text, this.props.textStyle]}
            onChangeText={text => {
              this.onChangePhoneNumber(text);
            }}
            keyboardType="phone-pad"
            underlineColorAndroid="rgba(0,0,0,0)"
            value={inputValue}
            {...this.props.textProps}
          />
        </View>

        <CountryPicker
          ref={ref => {
            this.picker = ref;
          }}
          selectedCountry={iso2}
          onSubmit={this.selectCountry}
          buttonColor={this.props.pickerButtonColor}
          buttonTextStyle={this.props.pickerButtonTextStyle}
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

const styleType = PropTypes.oneOfType([PropTypes.object, PropTypes.number]);

PhoneInput.propTypes = {
  textComponent: PropTypes.func,
  initialCountry: PropTypes.string,
  onChangePhoneNumber: PropTypes.func,
  value: PropTypes.string,
  style: styleType,
  flagStyle: styleType,
  textStyle: styleType,
  offset: PropTypes.number,
  textProps: PropTypes.object,
  onSelectCountry: PropTypes.func,
  onPressCancel: PropTypes.func,
  onPressConfirm: PropTypes.func,
  pickerButtonColor: PropTypes.string,
  pickerBackgroundColor: PropTypes.string,
  pickerItemStyle: styleType,
  countriesList: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      iso2: PropTypes.string,
      dialCode: PropTypes.string,
      priority: PropTypes.number,
      areaCodes: PropTypes.arrayOf(PropTypes.string)
    })
  ),
  cancelText: PropTypes.string,
  cancelTextStyle: styleType,
  confirmText: PropTypes.string,
  confirmTextTextStyle: styleType,
  disabled: PropTypes.bool,
  allowZeroAfterCountryCode: PropTypes.bool
};

PhoneInput.defaultProps = {
  initialCountry: "us",
  disabled: false,
  allowZeroAfterCountryCode: true
};
