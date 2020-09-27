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
    this.constructNumber = this.constructNumber.bind(this);
    this.prepareValue = this.prepareValue.bind(this);

    const { countriesList, disabled, initialCountry, value = '', } = this.props;
    const countryData = PhoneNumber.getCountryDataByCode(initialCountry);
    const dialCode = (countryData && countryData.dialCode) || '';

    if (countriesList) {
      Country.setCustomCountriesData(countriesList);
    }

    this.state = {
      iso2: initialCountry,
      dialCode,
      disabled,
      inputValue: this.constructNumber({
        iso2: initialCountry,
        dialCode,
        value: this.prepareValue({value, dialCode})
      }),
    };
  }

  componentDidMount() {
    if (this.props.value && this.props.value !== this.state.inputValue) {
      this.updateFlagAndFormatNumber(this.props.value);
    }
  }

  componentDidUpdate() {
    const { 
      value = '',
      disabled = null
    } = this.props;

    if (disabled) {
      this.setState({disabled});
    }

    if (value && value !== this.state.inputValue) {
      this.updateFlagAndFormatNumber(
        this.prepareValue({ dialCode: this.state.dialCode, value})
      );
    }
  }

  constructNumber({dialCode, value, iso2}) {
    const {useCountryCode, autoFormat} = this.props;
    const number = `+${dialCode}${value}`;
    if(autoFormat) {
      const formatted = this.format(number, iso2);
      return useCountryCode ? formatted : formatted.replace(`+${dialCode}`, "");
    }
    return useCountryCode ? number : value;
  }

  prepareValue({dialCode, value = ""}) {
    const clearedValue = value.replace(/\s/gm, '');
    return clearedValue.replace(`+${dialCode}`, '');
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
    return this.state.dialCode;
  }

  getAllCountries() {
    return PhoneNumber.getAllCountries();
  }

  getFlag(iso2) {
    return Flags.get(iso2);
  }

  getDialCode() {
    return this.state.dialCode;
  }

  getValue() {
    return this.state.inputValue;
  }

  getNumberType() {
    return PhoneNumber.getNumberType(
      this.state.inputValue,
      this.state.iso2
    );
  }

  getISOCode() {
    return this.state.iso2;
  }

  selectCountry(iso2) {
    if (this.state.iso2 !== iso2) {
      const countryData = PhoneNumber.getCountryDataByCode(iso2);
      const {inputValue, dialCode} = this.state;

      if (countryData) {
        this.setState(
          {
            iso2,
            dialCode: countryData.dialCode,
            inputValue: this.constructNumber({
              iso2,
              dialCode: countryData.dialCode,
              value: this.prepareValue({
                value: inputValue,
                dialCode,
              }) 
            })
          },
          () => {
            if (this.props.onSelectCountry) this.props.onSelectCountry(iso2);
          }
        );
      }
    }
  }

  isValidNumber() {
    const {inputValue, iso2} = this.state;
    if (inputValue < 3) return false;
    return PhoneNumber.isValidNumber(
      inputValue,
      iso2
    );
  }

  format(text, iso2) {
    return PhoneNumber.format(text, iso2);
  }

  updateFlagAndFormatNumber(number, actionAfterSetState = null) {
    const {useCountryCode, allowZeroAfterCountryCode} = this.props;
    const {dialCode, iso2} = this.state;

    let newInputValue = number;
    let newDialCode = dialCode;
    let newIso2 = iso2;

    if(useCountryCode) {
      const isoCode = PhoneNumber.getCountryCodeOfNumber(number);
      if(isoCode !== iso2) {
        if(isoCode) {
          newIso2 = isoCode;
          const countryData = PhoneNumber.getCountryDataByCode(newIso2);
          newDialCode = countryData ? countryData.dialCode : dialCode;
        } else {
          newIso2 = '';
          newDialCode = '';
        }
      }
      newInputValue = this.prepareValue({
        dialCode: newDialCode,
        value: number
      });
    }

    const formatted = this.constructNumber({
      dialCode: newDialCode, value: newInputValue, iso2: newIso2
    });
  
    const inputValue = allowZeroAfterCountryCode
      ? formatted
      : this.possiblyEliminateZeroAfterCountryCode(formatted);
  
    this.setState({ 
      inputValue,
      dialCode: newDialCode,
      iso2: newIso2
    }, actionAfterSetState);
  }

  possiblyEliminateZeroAfterCountryCode(number) {
    const {dialCode} = this.state;
    const formatted = this.prepareValue({value: number, dialCode});

    return formatted.startsWith('0')
      ? `+${dialCode}${formatted.replace(/0/gm, '')}`
      : number;
  }

  focus() {
    this.inputPhone.focus();
  }

  blur() {
    this.inputPhone.blur();
  }

  render() {
    const { iso2, disabled } = this.state;
    const TextComponent = this.props.textComponent || TextInput;
    return (
      <View style={[styles.container, this.props.style]}>
        {(this.props.shouldShowCountryPicker && this.props.useCountryCode) && (
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
        )}
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
            value={this.state.inputValue}
            {...this.props.textProps}
          />
        </View>

        {(this.props.shouldShowCountryPicker && this.props.useCountryCode) && (
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
        )}
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
  allowZeroAfterCountryCode: PropTypes.bool,
  shouldShowCountryPicker: PropTypes.bool,
  useCountryCode: PropTypes.bool,
  autoFormat: PropTypes.bool,
};

PhoneInput.defaultProps = {
  initialCountry: "us",
  disabled: false,
  allowZeroAfterCountryCode: true,
  shouldShowCountryPicker: true,
  useCountryCode: true,
  autoFormat: true
};
