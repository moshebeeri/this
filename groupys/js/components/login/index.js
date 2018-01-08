import React, {Component} from "react";
import {
    Dimensions,
    Image,
    KeyboardAvoidingView,
    Platform,
    TextInput,
    TouchableHighlight,
    TouchableOpacity
} from "react-native";
import {connect} from "react-redux";
import {actions} from "react-native-navigation-redux-helpers";
import {Button, Icon, Input, Item, Text, View,Spinner} from "native-base";
import {bindActionCreators} from "redux";
import * as loginAction from "../../actions/login";
import styles from "./styles";
import {isAuthenticated} from "../../selectors/appSelector";
import LinearGradient from "react-native-linear-gradient";
import strings from "../../i18n/i18n"

const {width, height} = Dimensions.get('window');
const thisLogo = require('../../../images/this-logo.png');
const bg = require('../../../images/bg.png');

class Login extends Component {
    static navigationOptions = {
        header: null
    };

    constructor(props) {
        super(props);
        this.state = {
            phone_number: '',
            password: '',
        };
    }

    focusNextField(nextField) {
        this.refs[nextField].focus()
    }

    async componentWillUpdate() {
        const isVerified = await this.props.isAuthenticated;
        if (isVerified) {
            this.replaceRoute('home');
        }
    }

    login() {
        this.props.actions.login(this.state.phoneNumber, this.state.password, this.props.navigation)
    }

    replaceRoute(route) {
        this.props.navigation.navigate(route);
    }

    forgetPassword() {
        this.replaceRoute('forgetPassword');
    }

    render() {
        const {focusPassword, focusPhone, failedMessage, doLogin} = this.props;
        return (

                <KeyboardAvoidingView behavior={'position'} style={styles.inputContainer}>

                    <View style={{position:'absolute',height:height,width:width}}>
                        <Image style={{position:'absolute',height:height,width:width}} resizeMode='cover' source={bg}/>

                    </View>
                    <View style={{
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}>


                        <View style={styles.thisContainer}>
                            <Image style={{position:'absolute',top:-175,width:140}} resizeMode='contain' source={thisLogo}/>
                            <Text style={styles.this}>THIS</Text>
                        </View>
                        <View style={{
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}>

                            <View style={{height: 5, justifyContent: 'flex-end', width: width / 2 + 120}}>

                            </View>

                            <View style={styles.phoneTextInput} regular>
                                <TextInput focus={focusPhone} keyboardType='phone-pad' value={this.state.name}
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
                                    focus={focusPassword}
                                    ref='password'
                                    underlineColorAndroid={'transparent'}
                                    returnKeyType='done'
                                    defaultValue=""
                                    placeholderTextColor={'white'}
                                    style={{width:width / 2 + 120,color:'white',borderColor:'white',height:50,fontSize:20,borderBottomWidth:1}}
                                    placeholder={strings.Password}
                                    secureTextEntry
                                    onChangeText={password => this.setState({password})}
                                    onSubmitEditing={this.login.bind(this)}
                                />
                            </View>


                            <Text style={{backgroundColor: 'transparent', padding: 10, fontSize: 16, color: 'red'}}>
                                {failedMessage}
                            </Text>

                            <View style={{
                                height: 40,
                                justifyContent: 'center',
                                alignItems: 'center',
                                width: width / 2 + 120
                            }}>

                                <TouchableOpacity onPress={() => this.login()} style={{
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
                                    }}>{strings.Login.toUpperCase()}</Text>

                                </TouchableOpacity>
                            </View>
                            {doLogin && <Spinner style={{position:'absolute',top:-15}}/>}
                            <View style={styles.signup_container}>
                                <View style={{flexDirection:'row'}}>
                                    <Text style={{backgroundColor:'transparent',color:'white'}}> Dosen't have an account? </Text>
                                <Text onPress={() => this.replaceRoute('Signup')}
                                      style={styles.signgupText}>{strings.SignUp}</Text>
                                </View>
                                <Text onPress={this.forgetPassword.bind(this)}
                                      style={styles.forgetText}>{strings.ForgotPassword}</Text>

                            </View>
                        </View>

                    </View>

                </KeyboardAvoidingView>


        );
    }
}

export default connect(
    state => ({
        focusPassword: state.loginForm.focusPassword,
        focusPhone: state.loginForm.focusPhone,
        failedMessage: state.loginForm.failedMessage,
        loginstate: state.loginForm,
        doLogin:state.loginForm.loginProcess,
        isAuthenticated: isAuthenticated(state),
    }),
    (dispatch) => ({
        actions: bindActionCreators(loginAction, dispatch)
    })
)(Login);


