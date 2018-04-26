import React, {Component} from 'react';
import {
    Dimensions,
    I18nManager,
    Image,
    KeyboardAvoidingView,
    ScrollView,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import {connect} from 'react-redux';
import {actions} from 'react-native-navigation-redux-helpers';
import {Button, Container, Content, Input, InputGroup, Item, Spinner} from 'native-base';
import styles from './styles';
import {NavigationActions} from 'react-navigation'
import {bindActionCreators} from "redux";
import * as loginAction from "../../actions/login";
import strings from "../../i18n/i18n"
import Icon from 'react-native-vector-icons/Ionicons';
import StyleUtils from "../../utils/styleUtils";
import {ThisText} from '../../ui/index';
import withPreventDoubleClick from '../../ui/TochButton/TouchButton';

const TouchableOpacityFix = withPreventDoubleClick(TouchableOpacity);
const {width, height} = Dimensions.get('window');
const logo = require('../../../images/logo.png');
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
            <ScrollView keyboardShouldPersistTaps={true}>

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
                    <View style={{width: width,  height: StyleUtils.scale(50), justifyContent: 'center', backgroundColor: 'transparent'}}>
                        <TouchableOpacityFix transparent style={{
                            width: 50,
                            alignItems: 'flex-start',
                            justifyContent: 'flex-start',
                            marginTop: 5,
                            marginLeft: 10,
                            marginRight: 5
                        }} onPress={() => this.back()}>
                            <Icon active color={'white'} size={StyleUtils.scale(35)} name={arrowName}/>

                        </TouchableOpacityFix>
                    </View>
                    <KeyboardAvoidingView behavior={'position'}
                                          style={[styles.avoidView, {width: StyleUtils.getWidth()}]}>

                        <View>
                            <View style={styles.thisContainer}>
                                <Image style={{position: 'absolute', top: -175, width: 110}} resizeMode='contain'
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
                                               selectionColor={'black'}
                                               placeholderTextColor={'white'}
                                               style={{
                                                   width: StyleUtils.getWidth() / 2 + StyleUtils.scale(120),
                                                   color: 'white',
                                                   height: StyleUtils.scale(40),
                                                   fontSize: StyleUtils.scale(20),
                                                   borderBottomWidth: 1,
                                                   borderColor: 'white',
                                               }}
                                               placeholder={strings.ValidationCode}/>
                                </View>

                                {errorMessage}
                                <View style={{
                                    height: StyleUtils.scale(50),
                                    marginTop: 20,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    width: width / 2 + 120
                                }}>


                                    <TouchableOpacityFix onPress={() => this.validateCode()} style={{
                                        width: StyleUtils.getWidth() - StyleUtils.scale(180),
                                        height: StyleUtils.scale(50),
                                        borderRadius: 30,
                                        backgroundColor: 'white',

                                        flexDirection: 'row',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                    }} regular>

                                        <ThisText style={{
                                            color: 'skyblue',
                                            fontWeight: 'bold',
                                            fontStyle: 'normal',
                                            fontSize: StyleUtils.scale(20)
                                        }}>{strings.Validate.toUpperCase()}</ThisText>

                                    </TouchableOpacityFix>
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