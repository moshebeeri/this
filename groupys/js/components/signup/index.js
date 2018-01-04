import React, {Component} from 'react';
import {Image, Platform, KeyboardAvoidingView, Dimensions, TouchableOpacity,TextInput,View,I18nManager} from 'react-native';
import {connect} from 'react-redux';
import {actions} from 'react-native-navigation-redux-helpers';
import {Container, Content, Text, InputGroup, Input, Button, Item} from 'native-base';

const {width, height} = Dimensions.get('window')
import styles from './styles';
import LinearGradient from 'react-native-linear-gradient';
import {bindActionCreators} from "redux";
import * as loginAction from "../../actions/login";
import strings from "../../i18n/i18n"
const thisLogo = require('../../../images/this-logo.png');
const bg = require('../../../images/bg.png');
import Icon from 'react-native-vector-icons/Ionicons';
class Signup extends Component {
    static navigationOptions = {
        header: null
    };

    constructor(props) {
        super(props);
        this.state = {
            email: '',
            name: '',
            password: '',
            phoneNumber: '',
            lastname: '',
            scroll: false,
            error: '',
            validationMessage: ''
        };
    }

    replaceRoute(route) {
        this.props.navigation.navigate(route);
    }

    signup() {
        this.props.actions.signup(this.state.phoneNumber, this.state.password, this.state.name, this.state.lastname, this.props.navigation)
    }
    back() {
        this.props.navigation.goBack();
    }

    focusNextField(nextField) {
        this.refs[nextField].focus()
    }

    render() {
        const {failedMessage, focusName, focusLastname} = this.props;
        const message = this.createMessage(failedMessage);

        let arrowName = I18nManager.isRTL ? "ios-arrow-forward" : "ios-arrow-back";
        let inputFieldSize = 120;
        if(Platform.OS){
            inputFieldSize = 150;
        }
        return (

                <View style={styles.inputContainer}>
                    <View style={{position:'absolute',height:height,width:width}}>
                        <Image style={{position:'absolute',height:height,width:width}} resizeMode='cover' source={bg}/>

                    </View>

                    <KeyboardAvoidingView behavior={'position'} style={styles.avoidView}>
                        <View style={{width:width,height:50,justifyContent:'center',backgroundColor:'transparent'}}>
                            <TouchableOpacity transparent style={{width:50,alignItems:'flex-start',justifyContent:'flex-start',marginTop:5,marginLeft: 10, marginRight: 5}} onPress={() => this.back()}>
                                <Icon active color={'white'} size={35} name={arrowName}/>

                            </TouchableOpacity>
                        </View>
                        <View style={styles.thisContainer}>
                            <Image style={{position:'absolute',top:-175,width:140}} resizeMode='contain' source={thisLogo}/>
                            <Text style={styles.this}>THIS</Text>
                        </View>
                        <View style={{
                            width: width,
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}>

                            <View style={styles.firstLastNameContainer}>
                                <View style={styles.nameTextInput} regular>
                                    <TextInput value={this.state.name} blurOnSubmit={true} returnKeyType='next' ref="1"
                                           onSubmitEditing={this.focusNextField.bind(this, "2")}
                                               style={{width:145,color:'white',borderColor:'white',height:50,fontSize:20,borderBottomWidth:1}}
                                               underlineColorAndroid={'transparent'}
                                               placeholderTextColor={'white'}
                                               onChangeText={(name) => this.setState({name})} placeholder={strings.FirstName}/>
                                </View>
                                <View style={styles.lastnameTextInput} regular>
                                    <TextInput value={this.state.lastname} blurOnSubmit={true} returnKeyType='next' ref="2"
                                           onSubmitEditing={this.focusNextField.bind(this, "name")}
                                               style={{width:145,color:'white',borderColor:'white',height:50,fontSize:20,borderBottomWidth:1}}
                                               underlineColorAndroid={'transparent'}
                                               placeholderTextColor={'white'}
                                               onChangeText={(lastname) => this.setState({lastname})}
                                           placeholder={strings.LastName}/>
                                </View>
                            </View>


                            <View style={styles.phoneTextInput} regular>
                                <TextInput  keyboardType='phone-pad' value={this.state.phoneNumber}
                                            ref='name'
                                           blurOnSubmit={true} returnKeyType='next'
                                           onSubmitEditing={this.focusNextField.bind(this, "password")}
                                           underlineColorAndroid={'transparent'}
                                           onChangeText={(phoneNumber) => this.setState({phoneNumber})}
                                           placeholderTextColor={'white'}
                                           style={{width:width / 2 + 120,color:'white',borderColor:'white',height:50,fontSize:20,borderBottomWidth:1}}
                                           placeholder={strings.PhoneNumber}/>
                            </View>

                            <View style={styles.passwordTextInput} regular>

                                <TextInput

                                    ref='password'
                                    underlineColorAndroid={'transparent'}
                                    returnKeyType='done'
                                    defaultValue=""
                                    value={this.state.password}
                                    placeholderTextColor={'white'}
                                    style={{width:width / 2 + 120,color:'white',borderColor:'white',height:50,fontSize:20,borderBottomWidth:1}}
                                    placeholder={strings.Password}
                                    secureTextEntry
                                    onChangeText={password => this.setState({password})}
                                    onSubmitEditing={this.signup.bind(this)}
                                />
                            </View>

                            {message}

                            <View style={{
                                height: 50,
                                marginTop:20,
                                justifyContent: 'center',
                                alignItems: 'center',
                                width: width / 2 + 120
                            }}>
                                <TouchableOpacity onPress={() => this.signup()} style={{
                                    width: width-90,
                                    height: 50,
                                    borderRadius: 30,
                                    backgroundColor: 'white',
                                    margin: 3,
                                    flexDirection: 'row',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                }} regular>

                                    <Text style={{
                                        color: 'skyblue',
                                        fontWeight:'bold',
                                        fontStyle: 'normal',
                                        fontSize: 20
                                    }}>{strings.SignUp.toUpperCase()}</Text>

                                </TouchableOpacity>

                            </View>

                        </View>

                    </KeyboardAvoidingView>


                </View>



        );
    }

    createMessage(message) {
        if (message) {
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
        focusPhone: state.signupForm.focusPhone,
        failedMessage: state.signupForm.failedMessage,
        focusLastname: state.signupForm.focusLastname,
        focusName: state.signupForm.focusName,
    }),
    (dispatch) => ({
        actions: bindActionCreators(loginAction, dispatch)
    })
)(Signup);


