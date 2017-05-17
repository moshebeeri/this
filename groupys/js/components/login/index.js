
import React, { Component } from 'react';
import { Image, Platform} from 'react-native';

import { connect } from 'react-redux';
import { actions } from 'react-native-navigation-redux-helpers';
import { Container, Content, Text, InputGroup, Input, Button, Icon, View } from 'native-base';
import PhoneInput from 'react-native-phone-input'
import CountryPicker from 'react-native-country-picker-modal'

import store from 'react-native-simple-store';


const logo = require('../../../images/logo.png');
import login from './login-theme';
import styles from './styles';
import LoginApi from '../../api/login'
import ContactApi from '../../api/contacts'
import LoginUtils from '../../utils/login_utils'
import UserApi from '../../api/user'
let loginApi = new LoginApi();
let userApi = new UserApi();
let contactApi = new ContactApi();

let lu = new LoginUtils();

const global = require('../../conf/global');
let calc_login = true;
export default  class Login extends Component {
    static navigationOptions = {
        header:null
    };

  constructor(props) {
    super(props);

      this.state = {
        phone_number: '',
      password: '',
      token: false,
      scroll: false,
        cca2: 'ISR',
        callingCode: "",
        validationMessage: '',
      error:''
    };
      this.onPressFlag = this.onPressFlag.bind(this);
      this.selectCountry = this.selectCountry.bind(this);

  }

    focusNextField(nextField) {

        this.refs[nextField]._root.focus()

    }



  ///sss
  async login() {

      this.setState ({error: ''});
      try {
          let response = await loginApi.login(this.refs.phone.getValue(), this.state.password);
          if(response.token ){
              await userApi.getUser();
              contactApi.syncContacts();
              this.replaceRoute('home');
          }

      }catch (error){
          this.setState({
              error: error.error
          })
      }

  }
    onPressFlag() {
        this.refs.countryPicker.openModal();
        this.setState({
            phone_number: this.refs.phone.getPickerData()
        })
    }

    calc_login_status() {
        return new Promise(async(resolve, reject) => {
            await userApi.getUser();
            const _id = await store.get('user_id');
            if (!_id) {

                this.replaceRoute('Login');
                return resolve(true);
            }
            try {
                const token = await lu.getToken();
                if (token) {
                    contactApi.syncContacts();
                    await userApi.getUser();
                    this.replaceRoute('home');
                    return resolve(true);
                }
            }catch(error){
                if(error === 'login'){
                    this.state.fingerprint_login = false;
                    this.state.recover_account = true;
                }
                else{

                }
                return resolve(true);
            }
            return resolve(true);

        })
    }

    componentWillMount() {
        if(calc_login){

            this.calc_login_status();
            calc_login = false;
        }
    }
    componentDidMount() {
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
    // this.props.replaceAt('login', { key: route }, this.props.navigation.key);
}

    render() {

        return (
            <Container>
              <Content theme={login} style={{ backgroundColor: login.backgroundColor }} >
                <Image source={logo} style={styles.shadow} />
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


                  <View style={{ marginBottom: 20 }}>
                    <InputGroup >
                      <Icon name="ios-unlock-outline" style={{color:"#00f"}}/>
                      <Input
                          ref='password'
                          returnKeyType='done'
                          placeholder="Password"
                          placeholderTextColor='#444'
                          defaultValue="de123456"
                          secureTextEntry
                          onChangeText={password => this.setState({ password })}
                      />
                    </InputGroup>
                  </View>
                  <View style={{ flexDirection: 'row', justifyContent: 'center',marginBottom:10 }}>
                    <Text> {this.state.error}</Text>
                  </View>


                  <Button transparent style={styles.forgotButton}>
                    <Text style={styles.forgotText}>Forgot Login details?</Text>
                  </Button>
                  <Button style={styles.login} onPress={this.login.bind(this) }>
                    <Text>Login</Text>
                  </Button>
                </View>

                <View style={{ flexDirection: 'row', justifyContent: 'space-around', paddingVertical: 20 }}>
                  <Button style={styles.logoFacebook}>
                    <Icon name="logo-facebook" />
                  </Button>
                  <Button style={styles.logoGoogle}>
                    <Icon name="logo-google" />
                  </Button>
                </View>

                <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                  <Text>Do not have an account? </Text>
                  <Button
                      transparent
                      style={styles.transparentButton}
                      textStyle={{ lineHeight: (Platform.OS === 'ios') ? 15 : 18, textDecorationLine: 'underline' }}
                      onPress={() =>  this.replaceRoute('Signup')}
                  >
                    <Text style={styles.signUpHereText}>Sign up here</Text>
                  </Button>
                </View>
              </Content>
            </Container>
        );
    }

}


