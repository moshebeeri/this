import React, {Component} from "react";
import {
    Dimensions,
    I18nManager,
    Image,
    KeyboardAvoidingView,
    ScrollView,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";
import {connect} from "react-redux";
import {actions} from "react-native-navigation-redux-helpers";
import {Button, Input, Item} from "native-base";
import {bindActionCreators} from "redux";
import * as loginAction from "../../actions/login";
import styles from "./styles";
import {isAuthenticated} from "../../selectors/appSelector";
import strings from "../../i18n/i18n"
import Icon from 'react-native-vector-icons/Ionicons';
import StyleUtils from "../../utils/styleUtils";
import {ThisText} from '../../ui/index';
import navigationUtils from '../../utils/navigationUtils'

const thisLogo = require('../../../images/this-logo.png');
const bg = require('../../../images/bg.png');
const {width, height} = Dimensions.get('window');

class ForgetPassword extends Component {
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

    back() {
        this.props.navigation.goBack();
    }

    replaceRoute(route) {
        navigationUtils.doNavigation(this.props.navigation, route);
    }

    forgetPassword() {
        if (this.state.phoneNumber) {
            this.props.actions.forgetPassword(this.state.phoneNumber)
        }
        this.props.navigation.goBack();
    }

    shouldComponentUpdate() {
        if (this.props.currentScreen === 'forgetPassword') {
            return true;
        }
        return false;
    }

    render() {
        const {failedMessage} = this.props;
        let arrowName = I18nManager.isRTL ? "ios-arrow-forward" : "ios-arrow-back";
        return (
            <ScrollView keyboardShouldPersistTaps={true}>
                <KeyboardAvoidingView behavior={'position'}
                                      style={[styles.inputContainer, {width: StyleUtils.getWidth()}]}>

                    <View style={{
                        backgroundColor: 'white',
                        position: 'absolute',
                        height: height,
                        width: StyleUtils.getWidth()
                    }}>
                        <Image style={{position: 'absolute', height: height, width: StyleUtils.getWidth()}}
                               resizeMode='cover' source={bg}/>

                    </View>
                    <View style={{
                        width: StyleUtils.getWidth(),
                        height: 60,
                        justifyContent: 'center',
                        backgroundColor: 'transparent'
                    }}>
                        <TouchableOpacity transparent style={{
                            width: 50,
                            alignItems: 'flex-start',
                            justifyContent: 'flex-start',
                            marginTop: 5,
                            marginLeft: 10,
                            marginRight: 5
                        }} onPress={() => this.back()}>
                            <Icon active color={'white'} size={StyleUtils.scale(35)} name={arrowName}/>

                        </TouchableOpacity>
                    </View>
                    <View style={{
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}>
                        <View style={[styles.thisContainer, {width: StyleUtils.getWidth()}]}>

                            <Image style={{position: 'absolute', top: -200, width: 110}} resizeMode='contain'
                                   source={thisLogo}/>
                            <ThisText style={styles.this}>THIS</ThisText>
                        </View>
                        <View style={{
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}>

                            <View regular style={[styles.phoneTextInput, {width: StyleUtils.getWidth()}]}>

                                <TextInput keyboardType='phone-pad' value={this.state.name}
                                           blurOnSubmit={true} returnKeyType='next'
                                           onSubmitEditing={this.forgetPassword.bind(this)}
                                           underlineColorAndroid={'transparent'}
                                           onChangeText={(phoneNumber) => this.setState({phoneNumber})}
                                           placeholderTextColor={'white'}
                                           style={{
                                               width: StyleUtils.getWidth() / 2 + StyleUtils.scale(120),
                                               color: 'white',
                                               height: StyleUtils.scale(40),
                                               fontSize: StyleUtils.scale(20),
                                               borderBottomWidth: 1,
                                               borderColor: 'white',
                                           }}
                                           placeholder={strings.PhoneNumber}/>
                            </View>
                            <View style={{
                                height: 60, marginTop: 10, justifyContent: 'center',
                                alignItems: 'center', width: width / 2 + 120
                            }}>
                                <ThisText
                                    style={styles.SignUpText}>{strings.PasswordRecoverySMSNotificationMessage}</ThisText>
                            </View>

                            <ThisText style={{backgroundColor: 'transparent', padding: 10, fontSize: 16, color: 'red'}}>
                                {failedMessage}
                            </ThisText>

                            <View style={{
                                height: 40,
                                justifyContent: 'center',
                                alignItems: 'center',
                                width: width / 2 + 120
                            }}>


                                <TouchableOpacity onPress={() => this.forgetPassword()} style={{
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
                                    }}>{strings.SendSMS.toUpperCase()}</ThisText>

                                </TouchableOpacity>
                            </View>

                        </View>

                    </View>


                </KeyboardAvoidingView>
            </ScrollView>

        );
    }
}

export default connect(
    state => ({
        isAuthenticated: isAuthenticated(state),
        currentScreen: state.render.currentScreen,
        network: state.network,
    }),
    (dispatch) => ({
        actions: bindActionCreators(loginAction, dispatch)
    })
)(ForgetPassword);


