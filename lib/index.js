import React, { Component } from 'react';
import { Image, TextInput, TouchableWithoutFeedback, View } from 'react-native';

import PropTypes from 'prop-types';

import Flags from './resources/flags';
import PhoneNumber from './phoneNumber';
import styles from './styles';
import CountryPicker from './countryPicker';

export default class PhoneInput extends Component {
  constructor(props, context) {
    super(props, context);

    this.onChangePhoneNumber = this.onChangePhoneNumber.bind(this);
    this.onPressFlag = this.onPressFlag.bind(this);
    this.selectCountry = this.selectCountry.bind(this);
    this.getFlag = this.getFlag.bind(this);

    const iso2 = this.props.initialCountry;
    const countryData = PhoneNumber.getCountryDataByCode(iso2);

    this.state = {
      iso2,
      formattedNumber: countryData ? `+${countryData.dialCode}` : '',
      value: null,
    };
  }

  componentWillMount() {
    if (this.props.value) this.updateFlagAndFormatNumber(this.props.value);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.value !== this.state.value) {
      this.setState({ value: nextProps.value });
      this.updateFlagAndFormatNumber(nextProps.value);
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
    if (this.props.onPressFlag) this.props.onPressFlag();
    else {
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
      iso2: country.iso2,
    }));
  }

  getCountryCode() {
    const countryData = PhoneNumber.getCountryDataByCode(this.state.iso2);
    return countryData.dialCode;
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
    return this.state.formattedNumber;
  }

  getNumberType() {
    return PhoneNumber.getNumberType(this.state.formattedNumber, this.state.iso2);
  }

  selectCountry(iso2) {
    if (this.state.iso2 !== iso2) {
      const countryData = PhoneNumber.getCountryDataByCode(iso2);
      if (countryData) {
        this.setState(
          {
            iso2,
            formattedNumber: `+${countryData.dialCode}`,
          },
          () => {
            if (this.props.onSelectCountry) this.props.onSelectCountry(iso2);
          },
        );
      }
    }
  }

  isValidNumber() {
    return PhoneNumber.isValidNumber(this.state.formattedNumber, this.state.iso2);
  }

  updateFlagAndFormatNumber(number, actionAfterSetState = null) {
    let iso2 = this.props.initialCountry || 'us';
    let phoneNumber = number;
    if (number) {
      if (phoneNumber[0] !== '+') phoneNumber = `+${phoneNumber}`;
      phoneNumber = this.possiblyEliminateZeroAfterCountryCode(phoneNumber);
      iso2 = PhoneNumber.getCountryCodeOfNumber(phoneNumber);
    }
    this.setState({ iso2, formattedNumber: phoneNumber }, actionAfterSetState);

    console.log('====================================');
    console.log('Fixing flag bug:', {
      iso2,
      number,
      formattedNumber: phoneNumber,
    });
    console.log('====================================');
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

  render() {
    const TextComponent = this.props.textComponent || TextInput;
    return (
      <View style={[styles.container, this.props.style]}>
        <TouchableWithoutFeedback onPress={this.onPressFlag}>
          <Image
            source={Flags.get(this.state.iso2)}
            style={[styles.flag, this.props.flagStyle]}
            onPress={this.onPressFlag}
          />
        </TouchableWithoutFeedback>
        <View style={{ flex: 1, marginLeft: this.props.offset || 10 }}>
          <TextComponent
            ref={(ref) => {
              this.inputPhone = ref;
            }}
            autoCorrect={false}
            style={[styles.text, this.props.textStyle]}
            onChangeText={text => this.onChangePhoneNumber(text)}
            keyboardType="phone-pad"
            underlineColorAndroid="rgba(0,0,0,0)"
            value={this.state.formattedNumber}
            {...this.props.textProps}
          />
        </View>

        <CountryPicker
          ref={(ref) => {
            this.picker = ref;
          }}
          selectedCountry={this.state.iso2}
          onSubmit={this.selectCountry}
          buttonColor={this.props.pickerButtonColor}
          buttonTextStyle={this.props.pickerButtonTextStyle}
          itemStyle={this.props.itemStyle}
          cancelText={this.props.cancelText}
          cancelTextStyle={this.props.cancelTextStyle}
          confirmText={this.props.confirmText}
          confirmTextStyle={this.props.confirmTextStyle}
          pickerBackgroundColor={this.props.pickerBackgroundColor}
          itemStyle={this.props.pickerItemStyle}
        />
      </View>
    );
  }
}

PhoneInput.propTypes = {
  textComponent: PropTypes.func,
  initialCountry: PropTypes.string,
  onChangePhoneNumber: PropTypes.func,
  value: PropTypes.string,
  style: PropTypes.object,
  flagStyle: PropTypes.object,
  textStyle: PropTypes.object,
  offset: PropTypes.number,
  textProps: PropTypes.object,
  onSelectCountry: PropTypes.func,
  pickerButtonColor: PropTypes.string,
  pickerBackgroundColor: PropTypes.string,
  pickerItemStyle: PropTypes.object,
  cancelText: PropTypes.string,
  cancelTextStyle: PropTypes.object,
  confirmText: PropTypes.string,
  confirmTextTextStyle: PropTypes.object,
};
