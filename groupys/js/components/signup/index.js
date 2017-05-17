import React, {Component} from 'react';
import {Image, Platform} from 'react-native';
import {connect} from 'react-redux';
import {actions} from 'react-native-navigation-redux-helpers';
import {Container, Content, Text, InputGroup, Input, Button, Icon, View} from 'native-base';
import store from 'react-native-simple-store';


import PhoneInput from 'react-native-phone-input'
import CountryPicker from 'react-native-country-picker-modal'
import login from './signup-theme';
import styles from './styles';
//import AlertContainer from 'react-alert';
const {
    replaceAt,
} = actions;

const logo = require('../../../images/logo.png');

export default class Signup extends Component {

    static navigationOptions = {
        header:null
    };
    constructor(props) {
        super(props);
        this.onPressFlag = this.onPressFlag.bind(this);
        this.selectCountry = this.selectCountry.bind(this);

        this.state = {
            email: '',
            password: '',
            phone_number: '',
            scroll: false,
            cca2: 'ISR',
            callingCode: "",
            error: '',
            validationMessage: ''
        };
    }

    componentDidMount() {
        this.setState({
            phone_number: this.refs.phone.getPickerData()
        })
    }

    onPressFlag() {
        this.refs.countryPicker.openModal();
        this.setState({
            phone_number: this.refs.phone.getPickerData()
        })
    }

    selectCountry(country) {
        this.refs.phone.selectCountry(country.cca2.toLowerCase());
        this.setState({
            callingCode: country.callingCode
        });

        this.setState({cca2: country.cca2})
    }

    replaceRoute(route) {
        this.props.navigation.navigate(route);
    }

    signup() {
        this.setState({
            validationMessage: ''
        });
        if (this.refs.phone.isValidNumber()) {
            this.callServerSignupAndRedirect();
            return;
        }

        this.setState({
            validationMessage: 'Invalid Number'
        })
    }

    normalizePhoneNumber(phone,countryCode){

        let newPhone = phone.toString().substring(phone.indexOf(countryCode.toString()) + countryCode.toString().length);
        return newPhone;
    }
    clean_phone_number(number){
        // remove all non digits, and then remove 0 if it is the first digit
        return number.replace(/\D/g, '').replace(/^0/,'')
    };

    async callServerSignupAndRedirect() {
        let phoneNumber = this.refs.phone.getValue();
        let normalizedPhone = this.normalizePhoneNumber(phoneNumber,this.state.callingCode);
        let cleanPhone = this.clean_phone_number(normalizedPhone);
        fetch(`${server_host}/api/users`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json;charset=utf-8',
            },
            body: JSON.stringify({
                country_code: this.state.callingCode,
                phone_number: cleanPhone,
                email:  this.state.callingCode + cleanPhone + "@low.la",
                password: this.state.password,


            })
        }).then((response) => response.json())
            .then((responseData) => {
                if (responseData.token) {
                    store.save('token', responseData.token);
                    this.replaceRoute('Register');
                } else {
                    this.replaceRoute('Login');
                }

            }).catch(function (error) {

            console.log('There has been a problem with your fetch operation: ' + error.message);
            this.replaceRoute('Login');
        });
    }
    focusNextField(nextField) {

        this.refs[nextField]._root.focus()

    }


    render() {
        return (
            <Container>
                <Content theme={login} style={{backgroundColor: login.backgroundColor}}>
                    <Image source={logo} style={styles.shadow}/>
                    <View style={styles.inputContainer}>
                        <View style={{marginBottom: 20}}>
                            <InputGroup>
                                <Icon name="ios-phone-portrait-outline" style={{color:"#00f"}}/>
                                <PhoneInput
                                    ref='phone'
                                    onPressFlag={this.onPressFlag}
                                    onChange={(value)=> this.componentDidMount(value)}
                                    blurOnSubmit={true}
                                    returnKeyType='next'
                                    onSubmitEditing={this.focusNextField.bind(this,"password")}
                                    autoFocus = {true}
                                />
                                <CountryPicker
                                    ref='countryPicker'
                                    onChange={(value)=> this.selectCountry(value)}
                                    translation='eng'
                                    cca2={this.state.cca2}
                                >
                                    <View/>
                                </CountryPicker>

                                <Text style={{padding: 10, fontSize: 16, color: 'red'}}>
                                    {this.state.validationMessage}
                                </Text>
                            </InputGroup>
                        </View>


                        <View style={{marginBottom: 20}}>
                            <InputGroup >
                                <Icon name="ios-unlock-outline" style={{color:"#00F"}}/>
                                <Input
                                    returnKeyType='done'
                                    ref='password'
                                    placeholder="Password"
                                    secureTextEntry
                                    placeholderTextColor='#444'
                                    onChangeText={password => this.setState({password})}
                                />
                            </InputGroup>
                        </View>


                        <Button style={styles.login} onPress={() => this.signup({
                            phone_number: this.state.phone_number,
                            password: this.state.password
                        }) }>
                            <Text> Signup </Text>
                        </Button>
                        <Text>
                            {this.state.error}
                        </Text>
                    </View>


                </Content>
            </Container>
        );
    }
}

