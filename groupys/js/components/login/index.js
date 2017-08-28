
import React, { Component } from 'react';
import { Image, Platform,TouchableHighlight,KeyboardAvoidingView,Dimensions,TouchableOpacity} from 'react-native';

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
const {width, height} = Dimensions.get('window')
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
          let phone = this.state.phoneNumber;
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
    forgetPassowrd(){
      loginApi.recoverPassword(this.state.phoneNumber,'')
    }

    render() {

        return (

                  <LinearGradient


                      colors={['#67ccf8', '#66cdcc']}
                      style={styles.inputContainer}
                     >
                      <KeyboardAvoidingView behavior={'position'} style={styles.inputContainer}>



                   <View style={{
                       flexDirection: 'column',
                       justifyContent: 'center',
                       alignItems: 'center',}} >

                       <View style={styles.thiscountsContainer}>
                            <Text style={styles.this}>This</Text>
                           <Text style={styles.thiscount}>Counts</Text>
                       </View>
                       <View style={{
                           flexDirection: 'column',
                           justifyContent: 'center',
                           alignItems: 'center',}} >

                           <View style={{height:60,justifyContent: 'flex-end',width:width/2 + 120}}>
                               <Text style={styles.signginText}>sign in</Text>
                           </View>

                           <Item style={styles.phoneTextInput} regular >
                               <Input  keyboardType = 'numeric' value={this.state.name} blurOnSubmit={true} returnKeyType='next' ref="1" onSubmitEditing={this.focusNextField.bind(this,"2")} onChangeText={(phoneNumber) => this.setState({phoneNumber})} placeholder='Phone Number' />
                           </Item>

                           <Item style={styles.passwordTextInput} regular >

                               <Input
                                   ref='2'
                                   returnKeyType='done'
                                   placeholder="Password"
                                   placeholderTextColor='#444'
                                   defaultValue=""
                                   secureTextEntry
                                   onChangeText={password => this.setState({ password })}
                                   onSubmitEditing={this.login.bind(this)}
                               />
                           </Item>

                            <View style={styles.signup_container}>
                               <Text onPress={this.forgetPassowrd.bind(this)}  style={styles.forgetText}>Forgot Password</Text>
                               <Text onPress={() => this.replaceRoute('Signup')} style={styles.signgupText} >Sign Up</Text>
                            </View>
                           <Text style={{backgroundColor:'transparent',padding: 10, fontSize: 16, color: 'red'}}>
                               {this.state.validationMessage}
                           </Text>
                           <View style={{ backgroundColor:'transparent',flexDirection: 'row',color: 'red', justifyContent: 'center',marginBottom:10 }}>
                               <Text> {this.state.error}</Text>
                           </View>
                           <View style={{height:40,justifyContent: 'center', alignItems: 'center',width:width/2 + 120}}>

                               <TouchableOpacity  onPress={() => this.login()}  style={{ width:100,height:30,borderRadius:10,backgroundColor:'skyblue',margin:3, flexDirection: 'row',  justifyContent: 'center',alignItems: 'center', } } regular>

                                   <Text style={{ color:'white',fontStyle: 'normal',fontSize:15 }}>LOGIN</Text>

                               </TouchableOpacity>
                           </View>
                           <View style={{ backgroundColor:'transparent',width:width/2 + 120, flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 20 }}>
                               <Button style={styles.logoFacebook}>
                                   <Icon name="logo-facebook" />
                               </Button>
                               <Button style={styles.logoGoogle}>
                                   <Icon name="logo-google" />
                               </Button>
                           </View>
                       </View>

                    </View>







                </KeyboardAvoidingView>
                  </LinearGradient>

        );
    }

}


