# React Native Phone Input

Phone input box for React Native

| ![2560-02-07 01_32_33](https://cloud.githubusercontent.com/assets/21040043/22661097/aa41852e-ecd6-11e6-84da-375cbe05020f.gif) | ![2560-02-08 00_04_18](https://cloud.githubusercontent.com/assets/21040043/22702110/3758ecc0-ed92-11e6-9d2e-421b76d4e2b5.gif) |
| ----------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |


## Installation

```
npm i react-native-phone-input --save
```

## Basic Usage

```jsx
import PhoneInput from 'react-native-phone-input'

render(){
    return(
        <PhoneInput ref='phone'/>
    )
}
```

[see full basic example](https://github.com/thegamenicorus/react-native-phone-input/blob/master/examples/BasicExample/app.js)

## Custom Your Own Picker

| ![2560-02-08 01_10_22](https://cloud.githubusercontent.com/assets/21040043/22705440/0cc61896-ed9e-11e6-83d6-e4d98cf5c06f.gif) | ![2560-02-08 01_46_21](https://cloud.githubusercontent.com/assets/21040043/22706060/73b04994-eda0-11e6-8e86-3ae1a94d9bd3.gif) |
| ----------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |


1. in componentDidMount, keep this.phone.getPickerData() in state
2. create function for open your modal (onPressFlag in example)
3. \<PhoneInput onPressFlag={function in 2.} />
4. call this.phone.selectCountry for set country of \<PhoneInput />

```jsx
componentDidMount(){
    this.setState({
        pickerData: this.phone.getPickerData()
    })
}

onPressFlag(){
    this.myCountryPicker.open()
}

selectCountry(country){
    this.phone.selectCountry(country.iso2)
}

render(){
    return(
        <View style={styles.container}>
            <PhoneInput
                ref={(ref) => { this.phone = ref; }}
                onPressFlag={this.onPressFlag}
            />

            <ModalPickerImage
                ref={(ref) => { this.myCountryPicker = ref; }}
                data={this.state.pickerData}
                onChange={(country)=>{ this.selectCountry(country) }}
                cancelText='Cancel'
            />
        </View>
    )
}
```

[see full custom picker example](https://github.com/thegamenicorus/react-native-phone-input/blob/master/examples/CustomPicker/app.js)

## Custom Library Picker

use awesome [react-native-country-picker-modal](https://github.com/xcarpentier/react-native-country-picker-modal) to select country

| ![2560-02-08 02_26_20](https://cloud.githubusercontent.com/assets/21040043/22707625/fecc68d2-eda5-11e6-868c-42d3c544fcc8.gif) | ![2560-02-08 02_43_18](https://cloud.githubusercontent.com/assets/21040043/22708333/6d0938b4-eda8-11e6-9ca1-ae217536b4cc.gif) |
| ----------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |


```jsx
onPressFlag(){
    this.countryPicker.openModal()
}

selectCountry(country){
    this.phone.selectCountry(country.cca2.toLowerCase())
    this.setState({cca2: country.cca2})
}

render(){
    return(
        <View style={styles.container}>
            <PhoneInput
                ref={(ref) => { this.phone = ref; }}
                onPressFlag={this.onPressFlag}
            />

            <CountryPicker
                ref={(ref) => { this.countryPicker = ref; }}
                onChange={(value)=> this.selectCountry(value)}
                translation='eng'
                cca2={this.state.cca2}
            >
                <View></View>
            </CountryPicker>
        </View>
    )
}
```

[see full custom library picker example](https://github.com/thegamenicorus/react-native-phone-input/blob/master/examples/CustomLibraryPicker/app.js)

## Custom Countries

```jsx
<PhoneInput countriesList={require('./countries.json')} />
```

## Configuration

### Properties:

| Property Name             | Type             | Default   | Description                                                                    |
| ------------------------- | ---------------- | --------- | ------------------------------------------------------------------------------ |
| initialCountry            | string           | 'us'      | initial selected country                                                       |
| allowZeroAfterCountryCode | bool             | true      | allow user input 0 after country code                                          |
| disabled                  | bool             | false     | if true, disable all interaction of this component                             |
| value                     | string           | null      | initial phone number                                                           |
| style                     | object           | null      | custom styles to be applied if supplied                                        |
| flagStyle                 | object           | null      | custom styles for flag image eg. {{width: 50, height: 30, borderWidth:0}}      |
| textStyle                 | object           | null      | custom styles for phone number text input eg. {{fontSize: 14}}                 |
| textProps                 | object           | null      | properties for phone number text input eg. {{placeholder: 'Telephone number'}} |
| textComponent             | function         | TextField | the input component to use                                                     |
| offset                    | int              | 10        | distance between flag and phone number                                         |
| pickerButtonColor         | string           | '#007AFF' | set button color of country picker                                             |
| pickerBackgroundColor     | string           | 'white'   | set background color of country picker                                         |
| pickerItemStyle           | object           | null      | custom styles for text in country picker eg. {{fontSize: 14}}                  |
| cancelText                | string           | 'Cancel'  | cancel word                                                                    |
| confirmText               | string           | 'Confirm' | confirm word                                                                   |
| buttonTextStyle           | object           | null      | custom styles for country picker button                                        |
| onChangePhoneNumber       | function(number) | null      | function to be invoked when phone number is changed                            |
| onSelectCountry           | function(iso2)   | null      | function to be invoked when country picker is selected                         |
| onPressFlag               | function()       | null      | function to be invoked when press on flag image                                |
| countriesList             | array            | null      | custom countries list                                                          |
| autoFormat                | bool             | false     | automatically format phone number as it is entered                             |

### Functions:

| Function Name   | Return Type | Parameters  | Description                                       |
| --------------- | ----------- | ----------- | ------------------------------------------------- |
| isValidNumber   | boolean     | none        | return true if current phone number is valid      |
| getNumberType   | string      | none        | return true type of current phone number          |
| getValue        | string      | none        | return current phone number                       |
| getFlag         | object      | iso2:string | return flag image                                 |
| getAllCountries | object      | none        | return country object in country picker           |
| getPickerData   | object      | nont        | return country object with flag image             |
| focus           | void        | none        | focus the phone input                             |
| blur            | void        | none        | blur the phone input                              |
| selectCountry   | void        | iso2:string | set phone input to specific country               |
| getCountryCode  | string      | none        | return country dial code of current phone number  |
| getISOCode      | string      | none        | return country iso code of current phone number   |
| onPressCancel   | func        | none        | handler to be called when taps the cancel button  |
| onPressConfirm  | func        | none        | handler to be called when taps the confirm button |
