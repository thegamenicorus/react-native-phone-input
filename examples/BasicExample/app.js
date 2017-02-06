import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity
} from 'react-native';

import PhoneInput from 'react-native-phone-input'

class App extends Component{

    constructor(){
        super()
        this.state = {
            valid: '',
            type: '',
            value: ''
        }

        this.updateInfo = this.updateInfo.bind(this)
        this.renderInfo = this.renderInfo.bind(this)
    }

    updateInfo(){
        this.setState({
            valid: this.refs.phone.isValidNumber(),
            type: this.refs.phone.getNumberType(),
            value: this.refs.phone.getValue()
        })
    }

    renderInfo(){
        if(this.state.value)
        return (
            <View style={styles.info}>
                    <Text>Is Valid: <Text style={{fontWeight:'bold'}}>{this.state.valid.toString()}</Text></Text>
                    <Text>Type: <Text style={{fontWeight:'bold'}}>{this.state.type}</Text></Text>
                    <Text>Value: <Text style={{fontWeight:'bold'}}>{this.state.value}</Text></Text>
            </View>
        )
    }

    render(){
        return(
            <View style={styles.container}>
                <PhoneInput ref='phone'/>
                
                <TouchableOpacity onPress={this.updateInfo} style={styles.button}>
                    <Text>Get Info</Text>
                </TouchableOpacity>

                {this.renderInfo()}
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
    info: {
        //width: 200,
        borderRadius: 5,
        backgroundColor: '#f0f0f0',
        padding:10,
        marginTop: 20,
    },
    button:{
        marginTop: 20,
        padding: 10,
    }
})

module.exports = App

