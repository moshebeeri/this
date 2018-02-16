import React, {Component} from 'react';
import {
    Dimensions,
    I18nManager,
    Image,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import {connect} from 'react-redux';
import {actions} from 'react-native-navigation-redux-helpers';
import {Button, Container, Content, Input, InputGroup, Item, Spinner, Text} from 'native-base';
import styles from './styles';
import {NavigationActions} from 'react-navigation'
import {bindActionCreators} from "redux";
import * as loginAction from "../../actions/login";
import strings from "../../i18n/i18n"
import Icon from 'react-native-vector-icons/Ionicons';
import StyleUtils from "../../utils/styleUtils";
import {ThisText} from '../../ui/index';

const {width, height} = Dimensions.get('window')
const logo = require('../../../images/logo.png')
const thisLogo = require('../../../images/this-logo.png');
const bg = require('../../../images/bg.png');
const resetAction = NavigationActions.reset({
    index: 0,
    actions: [
        NavigationActions.navigate({routeName: 'home'})
    ]
});

class Register extends Component {
    static navigationOptions = {
        header: null
    };

    constructor(props) {
        super(props);
        this.state = {
            code: "",
        };
    }

    back() {
        this.props.navigation.goBack();
    }

    validateCode() {
        this.props.actions.verifyCode(this.state.code, this.props.navigation, resetAction)
    }

    render() {
        const {message, doRegister} = this.props;
        const errorMessage = this.createMessage(message);
        let arrowName = I18nManager.isRTL ? "ios-arrow-forward" : "ios-arrow-back";
        return (
            <ScrollView keyboardShouldPersistTaps={true} >

                <View style={styles.inputContainer}>
                    <View style={{
                        backgroundColor: 'white',
                        position: 'absolute',
                        height: height,
                        width: StyleUtils.getWidth()
                    }}>
                        <Image style={{position: 'absolute', height: height, width: StyleUtils.getWidth()}}
                               resizeMode='cover' source={bg}/>

                    </View>
                    <View style={{width: width, height: 60, justifyContent: 'center', backgroundColor: 'transparent'}}>
                        <TouchableOpacity transparent style={{
                            width: 50,
                            alignItems: 'flex-start',
                            justifyContent: 'flex-start',
                            marginTop: 5,
                            marginLeft: 10,
                            marginRight: 5
                        }} onPress={() => this.back()}>
                            <Icon active color={'white'} size={35} name={arrowName}/>

                        </TouchableOpacity>
                    </View>
                    <KeyboardAvoidingView behavior={'position'}
                                          style={[styles.avoidView, {width: StyleUtils.getWidth()}]}>

                        <View>
                            <View style={styles.thisContainer}>
                                <Image style={{position: 'absolute', top: -175, width: 140}} resizeMode='contain'
                                       source={thisLogo}/>
                                <ThisText style={styles.this}>THIS</ThisText>
                            </View>
                            <View style={styles.mainContainer}>

                                <ThisText style={styles.SignUpText}>{strings.SmsMessagePart1}</ThisText>
                                <ThisText style={styles.decritpionLine2}>{strings.SmsMessagePart2}</ThisText>


                                <View style={styles.nameTextInput} regular>
                                    <TextInput keyboardType='phone-pad' value={this.state.code}
                                               blurOnSubmit={true} returnKeyType='done'
                                               onSubmitEditing={this.validateCode.bind(this)}
                                               underlineColorAndroid={'transparent'}
                                               onChangeText={(code) => this.setState({code})}
                                               placeholderTextColor={'white'}
                                               style={{
                                                   width: width / 2 + 120,
                                                   color: 'white',
                                                   borderColor: 'white',
                                                   height: 50,
                                                   fontSize: 20,
                                                   borderBottomWidth: 1
                                               }}
                                               placeholder={strings.ValidationCode}/>
                                </View>

                                {errorMessage}
                                <View style={{
                                    height: 50,
                                    marginTop: 20,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    width: width / 2 + 120
                                }}>


                                    <TouchableOpacity onPress={() => this.validateCode()} style={{
                                        width: width - 90,
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
                                            fontSize: 20
                                        }}>{strings.Validate.toUpperCase()}</ThisText>

                                    </TouchableOpacity>
                                </View>
                                {doRegister && <Spinner style={{position: 'absolute', top: 40}}/>}

                            </View>

                        </View>
                    </KeyboardAvoidingView>


                </View>
            </ScrollView>

        );
    }

    createMessage(message) {
        if (message) {
            return <ThisText style={{backgroundColor: 'transparent', padding: 10, fontSize: 16, color: 'red'}}>
                {this.state.validationMessage}
            </ThisText>
        }
        return undefined;
    }
}

export default connect(
    state => ({
        message: state.registerForm.message,
        network: state.network,
        doRegister: state.registerForm.registerProcess,
    }),
    (dispatch) => ({
        actions: bindActionCreators(loginAction, dispatch)
    })
)(Register);
