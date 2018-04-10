import React, {Component} from "react";
import {Dimensions, Image, KeyboardAvoidingView, ScrollView, TextInput, TouchableOpacity} from "react-native";
import {connect} from "react-redux";
import {actions} from "react-native-navigation-redux-helpers";
import {Button, Icon, Input, Item, Spinner, View} from "native-base";
import {bindActionCreators} from "redux";
import * as loginAction from "../../actions/login";
import styles from "./styles";
import {isAuthenticated} from "../../selectors/appSelector";
import strings from "../../i18n/i18n"
import StyleUtils from "../../utils/styleUtils";
import {ThisText} from '../../ui/index';
import navigationUtils from '../../utils/navigationUtils'

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

    login() {
        this.props.actions.login(this.state.phoneNumber, this.state.password, this.props.navigation)
    }

    replaceRoute(route) {
        navigationUtils.doNavigation(this.props.navigation, route);
    }

    forgetPassword() {
        this.replaceRoute('forgetPassword');
    }

    render() {
        const {focusPassword, focusPhone, failedMessage, doLogin} = this.props;
        return (
            <ScrollView keyboardShouldPersistTaps={true}>
                <View style={{
                    backgroundColor: 'white',
                    position: 'absolute',
                    height: height,
                    width: StyleUtils.getWidth()
                }}>
                    <Image style={{position: 'absolute', height: height, width: StyleUtils.getWidth()}}
                           resizeMode='cover' source={bg}/>

                </View>

                <KeyboardAvoidingView behavior={'position'}
                                      style={[styles.inputContainer, {width: StyleUtils.getWidth()}]}>


                    <View style={[styles.thisContainer, {width: StyleUtils.getWidth()}]}>
                        <Image style={{position: 'absolute', top: -175, width: 120}} resizeMode='contain'
                               source={thisLogo}/>
                        <ThisText style={styles.this}>THIS</ThisText>
                    </View>
                    <View style={{
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}>


                        <View style={[styles.phoneTextInput, {width: StyleUtils.getWidth()}]} regular>

                            <TextInput focus={focusPhone} keyboardType='phone-pad' value={this.state.name}
                                       blurOnSubmit={true} returnKeyType='next'
                                       onSubmitEditing={this.focusNextField.bind(this, "password")}
                                       underlineColorAndroid={'transparent'}
                                       onChangeText={(phoneNumber) => this.setState({phoneNumber})}
                                       placeholderTextColor={'white'}
                                       style={{
                                           width: StyleUtils.getWidth() / 2 + StyleUtils.scale(120),
                                           color: 'white',
                                           borderColor: 'white',
                                           height: StyleUtils.scale(40),
                                           fontSize: StyleUtils.scale(20),
                                           borderBottomWidth: 1
                                       }}
                                       placeholder={strings.PhoneNumber}/>
                        </View>

                        <View style={[styles.passwordTextInput, {width: StyleUtils.getWidth()}]} regular>


                            <TextInput
                                focus={focusPassword}
                                ref='password'
                                underlineColorAndroid={'transparent'}
                                returnKeyType='done'
                                defaultValue=""
                                placeholderTextColor={'white'}
                                style={{
                                    width: StyleUtils.getWidth() / 2 + StyleUtils.scale(120),
                                    color: 'white',
                                    borderColor: 'white',
                                    height: StyleUtils.scale(40),
                                    fontSize: StyleUtils.scale(20),
                                    borderBottomWidth: 1
                                }}
                                placeholder={strings.Password}
                                secureTextEntry
                                onChangeText={password => this.setState({password})}
                                onSubmitEditing={this.login.bind(this)}
                            />
                        </View>


                        <ThisText style={{backgroundColor: 'transparent', padding: 10, fontSize: 16, color: 'red'}}>
                            {failedMessage}
                        </ThisText>

                        <View style={{
                            justifyContent: 'center',
                            alignItems: 'center',
                            width: StyleUtils.getWidth() / 2 + StyleUtils.scale(180)
                        }}>

                            <TouchableOpacity onPress={() => this.login()} style={{
                                width: StyleUtils.getWidth() - StyleUtils.scale(180),
                                height: 50,
                                borderRadius: 30,
                                backgroundColor: 'white',
                                margin: 3,
                                flexDirection: 'row',
                                justifyContent: 'center',
                                alignItems: 'center',
                            }} regular>

                                <ThisText style={{
                                    color: 'skyblue',
                                    fontWeight: 'bold',
                                    fontStyle: 'normal',
                                    fontSize: StyleUtils.scale(20)
                                }}>{strings.Login.toUpperCase()}</ThisText>

                            </TouchableOpacity>
                        </View>
                        {doLogin && <Spinner style={{position: 'absolute', top: -15}}/>}
                        <View style={styles.signup_container}>
                            <View style={{flexDirection: 'row'}}>
                                <ThisText style={{
                                    backgroundColor: 'transparent',
                                    color: 'white',
                                    marginTop: StyleUtils.scale(2),
                                    fontSize: StyleUtils.scale(14)
                                }}>{strings.NoAccountMessage}</ThisText>
                                <ThisText onPress={() => this.replaceRoute('Signup')}
                                          style={styles.signgupText}>{strings.SignUp}</ThisText>


                            </View>

                            <ThisText onPress={this.forgetPassword.bind(this)}
                                      style={styles.forgetText}>{strings.ForgotPassword}</ThisText>

                        </View>
                    </View>


                </KeyboardAvoidingView>
            </ScrollView>

        );
    }
}

export default connect(
    state => ({
        focusPassword: state.loginForm.focusPassword,
        focusPhone: state.loginForm.focusPhone,
        failedMessage: state.loginForm.failedMessage,
        loginstate: state.loginForm,
        doLogin: state.loginForm.loginProcess,
        isAuthenticated: isAuthenticated(state),
        network: state.network,
    }),
    (dispatch) => ({
        actions: bindActionCreators(loginAction, dispatch)
    })
)(Login);


