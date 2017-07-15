
import React, { Component } from 'react';
import { Image, Platform,TouchableHighlight} from 'react-native';

import { connect } from 'react-redux';
import { actions } from 'react-native-navigation-redux-helpers';
import { Container, Content, Text, InputGroup, Input, Button, Icon, View,Item } from 'native-base';
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
import { NavigationActions } from 'react-navigation'
const resetAction = NavigationActions.reset({
    index: 0,
    actions: [
        NavigationActions.navigate({ routeName: 'home'})
    ]
});
import LinearGradient from 'react-native-linear-gradient';


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

  }

    focusNextField(nextField) {

        this.refs[nextField]._root.focus()

    }



  ///sss
  async login() {

      this.setState ({error: ''});
      try {
          let phone = '+972' + this.state.phoneNumber;
          let response = await loginApi.login(phone, this.state.password);
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

                return resolve(true);
            }
            return resolve(true);

        })
    }

    componentWillMount() {

        this.calc_login_status();


    }
    componentDidMount() {

    }





    replaceRoute(route) {
        if(route == 'home'){
            this.props.navigation.dispatch(resetAction);
            return;
        }

        this.props.navigation.navigate(route);
    // this.props.replaceAt('login', { key: route }, this.props.navigation.key);
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

                           <Text onPress={() => this.login()} style={styles.signginText}>sign in</Text>

                           <Item style={styles.phoneTextInput} regular >
                               <Input  value={this.state.name} blurOnSubmit={true} returnKeyType='next' ref="1" onSubmitEditing={this.focusNextField.bind(this,"2")} onChangeText={(phoneNumber) => this.setState({phoneNumber})} placeholder='Phone Number' />
                           </Item>

                           <Item style={styles.passwordTextInput} regular >

                               <Input
                                   ref='2'
                                   returnKeyType='done'
                                   placeholder="Password"
                                   placeholderTextColor='#444'
                                   defaultValue="de123456"
                                   secureTextEntry
                                   onChangeText={password => this.setState({ password })}
                               />
                           </Item>

                            <View style={styles.signup_container}>
                               <Text style={styles.forgetText}>Forgot Password</Text>
                               <Text onPress={() => this.replaceRoute('Signup')} style={styles.signgupText} >Sign Up</Text>
                            </View>
                           <Text style={{padding: 10, fontSize: 16, color: 'red'}}>
                               {this.state.validationMessage}
                           </Text>
                           <View style={{ flexDirection: 'row',color: 'red', justifyContent: 'center',marginBottom:10 }}>
                               <Text> {this.state.error}</Text>
                           </View>

                           <View style={{ flexDirection: 'row', justifyContent: 'space-around', paddingVertical: 20 }}>
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


