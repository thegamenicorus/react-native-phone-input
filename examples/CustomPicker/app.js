import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';

import PhoneInput from 'react-native-phone-input';
import ModalPickerImage from './ModalPickerImage';

class App extends Component {
  constructor() {
    super();

    this.onPressFlag = this.onPressFlag.bind(this);
    this.selectCountry = this.selectCountry.bind(this);
    this.state = {
      pickerData: null,
    };
  }

  componentDidMount() {
    this.setState({
      pickerData: this.phone.getPickerData(),
    });
  }

  onPressFlag() {
    this.myCountryPicker.open();
  }

  selectCountry(country) {
    this.phone.selectCountry(country.iso2);
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

        <ModalPickerImage
          ref={(ref) => {
            this.myCountryPicker = ref;
          }}
          data={this.state.pickerData}
          onChange={(country) => {
            this.selectCountry(country);
          }}
          cancelText="Cancel"
        />
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
