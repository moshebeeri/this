
import React, { Component } from 'react';
import { Image, Platform,TouchableHighlight,KeyboardAvoidingView,TextInput,Dimensions,TouchableOpacity} from 'react-native';

import { connect } from 'react-redux';
import { actions } from 'react-native-navigation-redux-helpers';
import { Container, Content, Text, InputGroup, Input, Button, Icon, View,Item } from 'native-base';

import { bindActionCreators } from "redux";
import * as loginAction from "../../actions/login";

const logo = require('../../../images/logo.png');

import styles from './styles';

import { isAuthenticated } from '../app/appSelector'

const global = require('../../conf/global');

const {width, height} = Dimensions.get('window')
import LinearGradient from 'react-native-linear-gradient';


 class Login extends Component {
    static navigationOptions = {
        header:null
    };

  constructor(props) {
    super(props);

      this.state = {
        phone_number: '',
        password: '',

    };

  }

     focusNextField(nextField) {

         this.refs[nextField]._root.focus()

     }

     componentWillUpdate() {
         const { isAuthenticated } = this.props;

         if (isAuthenticated){
             this.replaceRoute('home');
         }
     }

     ///sss
   login() {
      this.props.actions.login(this.state.phoneNumber,this.state.password,this.props.navigation)

  }






    replaceRoute(route) {
        this.props.navigation.navigate(route);

    }
    forgetPassowrd(){
        this.props.actions.forgetPassword(this.state.password)

    }

    render() {
        const { focusPassword,focusPhone,failedMessage,isAuthenticated ,allstate} = this.props;


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
                               <Input  focus={focusPhone}keyboardType = 'phone-pad' value={this.state.name} blurOnSubmit={true} returnKeyType='next'  onSubmitEditing={this.focusNextField.bind(this,"password")} onChangeText={(phoneNumber) => this.setState({phoneNumber})} placeholder='Phone Number' />
                           </Item>

                           <Item style={styles.passwordTextInput} regular >

                               <Input
                                   focus={focusPassword}
                                   ref='password'
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
                               {failedMessage}
                           </Text>

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

export default connect(
    state => ({
        focusPassword: state.loginForm.focusPassword,
        focusPhone:state.loginForm.focusPhone,
        failedMessage:state.loginForm.failedMessage,
        allstate:state,
        isAuthenticated: isAuthenticated(state),
    }),
    (dispatch) => ({
        actions: bindActionCreators(loginAction, dispatch)
    })
)(Login);


