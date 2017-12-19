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
import {Button, Icon, Input, Item, Text, View} from "native-base";
import {bindActionCreators} from "redux";
import * as loginAction from "../../actions/login";
import styles from "./styles";
import {isAuthenticated} from "../../selectors/appSelector";
import LinearGradient from "react-native-linear-gradient";
import strings from "../../i18n/i18n"

const {width, height} = Dimensions.get('window');
const thisLogo = require('../../../images/this-logo.png');

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
        this.refs[nextField]._root.focus()
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
        const {focusPassword, focusPhone, failedMessage, isAuthenticated, loginstate} = this.props;
        return (

            <LinearGradient


                colors={['#67ccf8', '#66cdcc']}
                style={styles.inputContainer}
            >
                <KeyboardAvoidingView behavior={'position'} style={styles.inputContainer}>


                    <View style={{
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}>


                        <View style={styles.thisContainer}>
                            <Image style={{position:'absolute',top:-175,width:150}} resizeMode='contain' source={thisLogo}/>
                            <Text style={styles.this}>THIS</Text>
                        </View>
                        <View style={{
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}>

                            <View style={{height: 60, justifyContent: 'flex-end', width: width / 2 + 120}}>
                                <Text style={styles.SignUpText}>{strings.SignIn}</Text>
                            </View>

                            <Item style={styles.phoneTextInput} regular>
                                <Input focus={focusPhone} keyboardType='phone-pad' value={this.state.name}
                                       blurOnSubmit={true} returnKeyType='next'
                                       onSubmitEditing={this.focusNextField.bind(this, "password")}
                                       onChangeText={(phoneNumber) => this.setState({phoneNumber})}
                                       placeholder={strings.PhoneNumber}/>
                            </Item>

                            <Item style={styles.passwordTextInput} regular>

                                <Input
                                    focus={focusPassword}
                                    ref='password'
                                    returnKeyType='done'
                                    placeholder={strings.Password}
                                    placeholderTextColor='#444'
                                    defaultValue=""
                                    secureTextEntry
                                    onChangeText={password => this.setState({password})}
                                    onSubmitEditing={this.login.bind(this)}
                                />
                            </Item>

                            <View style={styles.signup_container}>
                                <Text onPress={this.forgetPassword.bind(this)}
                                      style={styles.forgetText}>{strings.ForgotPassword}</Text>
                                <Text onPress={() => this.replaceRoute('Signup')}
                                      style={styles.signgupText}>{strings.SignUp}</Text>
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
                                    width: 100,
                                    height: 30,
                                    borderRadius: 10,
                                    backgroundColor: 'skyblue',
                                    margin: 3,
                                    flexDirection: 'row',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                }} regular>

                                    <Text style={{
                                        color: 'white',
                                        fontStyle: 'normal',
                                        fontSize: 15
                                    }}>{strings.Login.toUpperCase()}</Text>

                                </TouchableOpacity>
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
        focusPhone: state.loginForm.focusPhone,
        failedMessage: state.loginForm.failedMessage,
        loginstate: state.loginForm,
        isAuthenticated: isAuthenticated(state),
    }),
    (dispatch) => ({
        actions: bindActionCreators(loginAction, dispatch)
    })
)(Login);


