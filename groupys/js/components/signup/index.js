import React, {Component} from 'react';
import {Image, Platform,KeyboardAvoidingView,Dimensions,TouchableOpacity} from 'react-native';
import {connect} from 'react-redux';
import {actions} from 'react-native-navigation-redux-helpers';
import {Container, Content, Text, InputGroup, Input, Button, Icon, View,Item} from 'native-base';

const {width, height} = Dimensions.get('window')
import styles from './styles';

import LinearGradient from 'react-native-linear-gradient';

import { bindActionCreators } from "redux";

import * as loginAction from "../../actions/login";
const logo = require('../../../images/logo.png');

 class Signup extends Component {

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

     signup(){
         this.props.actions.signup(this.state.phoneNumber,this.state.password,this.state.name,this.state.lastname,this.props.navigation)

     }

    focusNextField(nextField) {

        this.refs[nextField]._root.focus()

    }


    render() {
        const { failedMessage,focusName,focusLastname } = this.props;
        const message= this.createMessage(failedMessage);

        return (
            <LinearGradient


                colors={['#67ccf8', '#66cdcc']}
                style={styles.inputContainer}
            >


                <View style={styles.inputContainer}>

                    <KeyboardAvoidingView behavior={'position'} style={styles.avoidView}>
                        <View style={styles.thiscountsContainer}>
                            <Text style={styles.this}>This</Text>
                            <Text style={styles.thiscount}>Counts</Text>
                        </View>
                        <View style={{width:width,


                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',}} >
                            <View style={{height:50,justifyContent: 'flex-end',width:width/2 + 120}}>

                                <Text style={styles.signginText}>sign up</Text>
                            </View>
                            <View style={styles.nameContainer}>
                                <Item style={styles.nameTextInput} regular >
                                    <Input  value={this.state.name} blurOnSubmit={true} returnKeyType='next' ref="1" onSubmitEditing={this.focusNextField.bind(this,"2")} onChangeText={(name) => this.setState({name})} placeholder='Name' />
                                </Item>
                                <Item style={styles.lastnameTextInput} regular >
                                    <Input value={this.state.lastname} blurOnSubmit={true} returnKeyType='next' ref="2" onSubmitEditing={this.focusNextField.bind(this,"3")} onChangeText={(lastname) => this.setState({lastname})} placeholder='Last Name' />
                                </Item>
                            </View>


                            <Item style={styles.phoneTextInput} regular >
                                <Input   keyboardType = 'numeric' value={this.state.phoneNumber} blurOnSubmit={true} returnKeyType='next' ref="3" onSubmitEditing={this.focusNextField.bind(this,"5")} onChangeText={(phoneNumber) => this.setState({phoneNumber})} placeholder='Phone Number' />
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
                            {message}

                            <View style={{height:40,justifyContent: 'center', alignItems: 'center',width:width/2 + 120}}>

                                <TouchableOpacity  onPress={() => this.signup()}  style={{ width:100,height:30,borderRadius:10,backgroundColor:'skyblue',margin:3, flexDirection: 'row',  justifyContent: 'center',alignItems: 'center', } } regular>

                                    <Text style={{ color:'white',fontStyle: 'normal',fontSize:15 }}>SINGUP</Text>

                                </TouchableOpacity>
                            </View>
                            <View style={{ backgroundColor:'transparent',width:width/2 + 120, flexDirection: 'row', justifyContent: 'space-between' }}>
                                <Button style={styles.logoFacebook}>
                                    <Icon name="logo-facebook" />
                                </Button>
                                <Button style={styles.logoGoogle}>
                                    <Icon name="logo-google" />
                                </Button>
                            </View>
                        </View>

                    </KeyboardAvoidingView>







                </View>
            </LinearGradient>


        );
    }

    createMessage(message) {
        if(message){
            return <Text style={{backgroundColor: 'transparent', padding: 10, fontSize: 16, color: 'red'}}>
                {message}
            </Text>
        }

        return undefined;
    }
}


export default connect(
    state => ({
        focusPassword: state.signupForm.focusPassword,
        focusPhone:state.signupForm.focusPhone,
        failedMessage:state.signupForm.failedMessage,
        focusLastname:state.signupForm.focusLastname,
        focusName:state.signupForm.focusName,
    }),
    (dispatch) => ({
        actions: bindActionCreators(loginAction, dispatch)
    })
)(Signup);


