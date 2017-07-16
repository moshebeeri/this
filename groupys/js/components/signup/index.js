import React, {Component} from 'react';
import {Image, Platform} from 'react-native';
import {connect} from 'react-redux';
import {actions} from 'react-native-navigation-redux-helpers';
import {Container, Content, Text, InputGroup, Input, Button, Icon, View,Item} from 'native-base';
import store from 'react-native-simple-store';

import styles from './styles';

import LinearGradient from 'react-native-linear-gradient';

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


        this.state = {
            email: '',
            name:'',
            password: '',
            phoneNumber: '',
            lastname:'',
            scroll: false,
            error: '',
            validationMessage: ''
        };
    }





    replaceRoute(route) {
        this.props.navigation.navigate(route);
    }

    signup() {
        this.setState({
            validationMessage: ''
        });
        if (this.state.phoneNumber) {
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
        let phoneNumber = '+972' + this.state.phoneNumber;
        let normalizedPhone = this.normalizePhoneNumber(phoneNumber,'+972');
        let cleanPhone = this.clean_phone_number(normalizedPhone);
        fetch(`${server_host}/api/users`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json;charset=utf-8',
            },
            body: JSON.stringify({
                country_code: '+972',
                phone_number: cleanPhone,
                email:  this.state.callingCode + cleanPhone + "@low.la",
                password: this.state.password,
                name: this.state.name + this.state.lastname,



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
            <LinearGradient


                colors={['#67ccf8', '#66cdcc']}
                style={styles.inputContainer}
            >


                <View style={styles.inputContainer}>

                    <View >
                        <View style={styles.thiscountsContainer}>
                            <Text style={styles.this}>This</Text>
                            <Text style={styles.thiscount}>Counts</Text>
                        </View>
                        <View>

                            <Text style={styles.signginText}>sign up</Text>
                            <View style={styles.nameContainer}>
                                <Item style={styles.nameTextInput} regular >
                                    <Input  value={this.state.name} blurOnSubmit={true} returnKeyType='next' ref="1" onSubmitEditing={this.focusNextField.bind(this,"2")} onChangeText={(name) => this.setState({name})} placeholder='Name' />
                                </Item>
                                <Item style={styles.lastnameTextInput} regular >
                                    <Input  value={this.state.lastname} blurOnSubmit={true} returnKeyType='next' ref="2" onSubmitEditing={this.focusNextField.bind(this,"3")} onChangeText={(lastname) => this.setState({lastname})} placeholder='Last Name' />
                                </Item>
                            </View>


                            <Item style={styles.phoneTextInput} regular >
                                <Input  keyboardType = 'numeric' value={this.state.phoneNumber} blurOnSubmit={true} returnKeyType='next' ref="3" onSubmitEditing={this.focusNextField.bind(this,"5")} onChangeText={(phoneNumber) => this.setState({phoneNumber})} placeholder='Phone Number' />
                            </Item>

                            <Item style={styles.passwordTextInput} regular >

                                <Input
                                    ref='5'
                                    returnKeyType='done'
                                    placeholder="Password"
                                    placeholderTextColor='#444'
                                    defaultValue=""
                                    secureTextEntry
                                    onChangeText={password => this.setState({ password })}
                                    onSubmitEditing={this.signup.bind(this)}
                                />
                            </Item>

                            <View style={styles.signup_container}>
                                <Text style={styles.forgetText}>or sign up using </Text>
                             </View>
                            <Text style={{padding: 10, fontSize: 16, color: 'red'}}>
                                {this.state.validationMessage}
                            </Text>
                            <View style={{ flexDirection: 'row',color: 'red', justifyContent: 'center',marginBottom:0 }}>
                                <Text> {this.state.error}</Text>
                            </View>

                            <View style={{ flexDirection: 'row', justifyContent: 'space-around', paddingVertical: 0 }}>
                                <Button style={styles.logoFacebook}>
                                    <Icon name="logo-facebook" />
                                </Button>
                                <Button style={styles.logoGoogle}>
                                    <Icon name="logo-google" />
                                </Button>
                            </View>
                        </View>

                    </View>







                </View>
            </LinearGradient>


        );
    }
}

