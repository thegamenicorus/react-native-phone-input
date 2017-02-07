import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity
} from 'react-native';

import PhoneInput from 'react-native-phone-input'
import CountryPicker from 'react-native-country-picker-modal'

class App extends Component{

    constructor(){
        super()

        this.onPressFlag = this.onPressFlag.bind(this)
        this.selectCountry = this.selectCountry.bind(this)
        this.state = {
            cca2: 'US'
        };
    }

    componentDidMount(){
        this.setState({
            pickerData: this.refs.phone.getPickerData()
        })
    }

    onPressFlag(){
        this.refs.countryPicker.openModal()
    }

    selectCountry(country){
        this.refs.phone.selectCountry(country.cca2.toLowerCase())
        this.setState({cca2: country.cca2})
    }

    render(){
        return(
            <View style={styles.container}>
                <PhoneInput 
                    ref='phone' 
                    onPressFlag={this.onPressFlag}
                />
                <CountryPicker
                    ref='countryPicker'
                    onChange={(value)=> this.selectCountry(value)}
                    translation='eng'
                    cca2={this.state.cca2}
                >
                    <View></View>
                </CountryPicker>
            </View>
        )
    }
}

let styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        padding: 20,
        paddingTop: 60
    },
})

module.exports = App

