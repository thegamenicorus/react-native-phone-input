import React, { Component,  PropTypes } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Image,
  TextInput,
  Text,
  TouchableWithoutFeedback,
  View
} from 'react-native';

import Flags from './resources/flags'
import PhoneNumber from './phoneNumber'
import styles from './styles';
import CountryPicker from './countryPicker'

export default class PhoneInput extends Component {

    constructor(props, context){
        super(props, context)

        this.onChangePhoneNumber = this.onChangePhoneNumber.bind(this)
        this.onPressFlag = this.onPressFlag.bind(this)
        this.selectCountry = this.selectCountry.bind(this)
        this.getFlag = this.getFlag.bind(this)

        var iso2 = this.props.initialCountry || 'us'
        var countryData = PhoneNumber.getCountryDataByCode(iso2)
        this.state = {
            iso2,
            formattedNumber: countryData?`+${countryData.dialCode}`:''
        }
    }

    componentWillReceiveProps(nextProps){
        
    }
    
    componentWillMount(){
        if(this.props.value)
            this.updateFlagAndFormatNumber(this.props.value)
    }

    updateFlagAndFormatNumber(number, actionAfterSetState = null){
        var iso2 = this.props.initialCountry || 'us'
        var phoneNumber = number
        if(number){
            if(phoneNumber[0] != '+')
                phoneNumber = `+${phoneNumber}`
            iso2 = PhoneNumber.getCountryCodeOfNumber(phoneNumber)
        }
        this.setState({iso2, formattedNumber: phoneNumber}, actionAfterSetState)
    }

    onChangePhoneNumber(number){      
        var actionAfterSetState = this.props.onChangePhoneNumber?() => {this.props.onChangePhoneNumber(number)}:null
        this.updateFlagAndFormatNumber(number, actionAfterSetState)
    }

    isValidNumber(){
        return PhoneNumber.isValidNumber(this.state.formattedNumber, this.state.iso2)
    }

    getNumberType(){
        return PhoneNumber.getNumberType(this.state.formattedNumber, this.state.iso2)
    }

    getValue(){
        return this.state.formattedNumber
    }

    getFlag(iso2){
        return Flags.get(iso2)
    }

    getAllCountries(){
        return PhoneNumber.getAllCountries()
    }

    selectCountry(iso2){
        if(this.state.iso2 != iso2){
            var countryData = PhoneNumber.getCountryDataByCode(iso2)
            if(countryData){
                this.setState({
                    iso2,
                    formattedNumber: `+${countryData.dialCode}`
                }, ()=>{
                    if(this.props.onSelectCountry)
                        this.props.onSelectCountry(iso2)
                })
            }
        }
    }

    onPressFlag(){
        if(this.props.onPressFlag)
            this.props.onPressFlag()
        else{
            if(this.state.iso2)
                this.refs.picker.selectCountry(this.state.iso2)
            this.refs.picker.show()
        }
    }

    render(){
        
        return (
            <View style={[styles.container, this.props.style]}>
                <TouchableWithoutFeedback onPress={this.onPressFlag}>
                    <Image source={Flags.get(this.state.iso2)} 
                        resizeMode='stretch' 
                        style={[styles.flag, this.props.flagStyle]}
                        onPress={this.onPressFlag}
                    />
                </TouchableWithoutFeedback>
                <View style={{flex:1, marginLeft:this.props.offset || 10}}>
                    <TextInput 
                            autoCorrect={false}
                            style={[styles.text, this.props.textStyle]}
                            onChangeText={(text) => this.onChangePhoneNumber(text)}
                            keyboardType='phone-pad'
                            underlineColorAndroid='rgba(0,0,0,0)'
                            value={this.state.formattedNumber}
                            {...this.props.textProps}
                        />
                </View>

                <CountryPicker
                    ref={'picker'}
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
            
        )
    }
}

PhoneInput.propTypes = {
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
}