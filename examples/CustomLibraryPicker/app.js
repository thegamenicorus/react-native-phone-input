import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';

import PhoneInput from 'react-native-phone-input';
import CountryPicker from 'react-native-country-picker-modal';

class App extends Component {
  constructor() {
    super();

    this.onPressFlag = this.onPressFlag.bind(this);
    this.selectCountry = this.selectCountry.bind(this);
    this.state = {
      cca2: 'US',
      isCountryModalOpen: false
    };
  }

  componentDidMount() {
    this.setState({
      pickerData: this.phone.getPickerData(),
    });
  }

  toggleCountryModal() {
    this.setState((state) => ({
      isCountryModalOpen: !state.isCountryModalOpen
    }))
  }

  onPressFlag() {
    this.toggleCountryModal()
  }

  selectCountry(country) {
    this.phone.selectCountry(country.cca2.toLowerCase());
    this.setState({ cca2: country.cca2 });
  }


  render() {
    return (
      <View style={styles.container}>
        <PhoneInput
          ref={(ref) => {
            this.phone = ref;
          }}
          onPressFlag={this.onPressFlag}
        />

        <CountryPicker
          onSelect={value => this.selectCountry(value)}
          translation="eng"
          countryCode={this.state.cca2}
          modalProps={{
            visible: this.state.isCountryModalOpen
          }}
          onClose={() => this.toggleCountryModal()}
        >
          <View />
        </CountryPicker>
      </View>
    );
  }
}

let styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
    paddingTop: 60,
  },
});

module.exports = App;
