import React, {Component} from 'react';
import {
    Dimensions,
    I18nManager,
    Image,
    Keyboard,
    KeyboardAvoidingView,
    ScrollView,
    TextInput,
    TouchableOpacity,
    View,

} from 'react-native';
import {connect} from 'react-redux';
import {actions} from 'react-native-navigation-redux-helpers';
import {Button, Container, Content, Input, InputGroup, Item, Spinner} from 'native-base';
import styles from './styles';
import {bindActionCreators} from "redux";
import * as loginAction from "../../actions/login";
import strings from "../../i18n/i18n"
import Icon from 'react-native-vector-icons/Ionicons';
import StyleUtils from "../../utils/styleUtils";
import {TermsOfUse, ThisText} from "../../ui/index"
import navigationUtils from '../../utils/navigationUtils'
import CallingCodeUtils from '../../utils/LocalToCallingCode'

const {width, height} = Dimensions.get('window')
const thisLogo = require('../../../images/this-logo.png');
const bg = require('../../../images/bg.png');

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
            validationMessage: '',
            verifyPassword: '',
            badPassword: false,
            showPopup: true,
            callingCode: ''
        };
    }

    replaceRoute(route) {
        navigationUtils.doNavigation(this.props.navigation, route);
    }
    async componentWillMount(){
        let callingCode = await CallingCodeUtils.getCallingCode();
        this.setState({callingCode: '+' + callingCode})
    }
    signup() {
        if (this.state.password && this.state.phoneNumber) {
            if (this.state.password === this.state.verifyPassword) {
                this.setState({
                    badPassword: false
                })
                Keyboard.dismiss();
                this.props.actions.signup(this.state.phoneNumber, this.state.password, this.state.name, this.state.lastname, this.props.navigation,this.state.callingCode)
            } else {
                this.setState({
                    badPassword: true
                })
            }
        }
    }

    back() {
        this.props.navigation.goBack();
    }

    focusNextField(nextField) {
        this.refs[nextField].focus()
    }

    render() {
        const {failedMessage, signupProcess} = this.props;
        const message = this.createMessage(failedMessage);
        let arrowName = I18nManager.isRTL ? "ios-arrow-forward" : "ios-arrow-back";
        let passwordBorder = 'white';
        if (this.state.badPassword) {
            passwordBorder = 'red';
        }
        return (

            <ScrollView keyboardShouldPersistTaps={true}>
                <View style={[styles.inputContainer, {width: StyleUtils.getWidth()}]}>
                    <View style={{
                        backgroundColor: 'white',
                        position: 'absolute',
                        height: height,
                        width: StyleUtils.getWidth()
                    }}>
                        <Image style={{position: 'absolute', height: height, width: StyleUtils.getWidth()}}
                               resizeMode='cover' source={bg}/>

                    </View>
                    {this.state.showPopup && <View style={{
                        top: 0,
                        height: height,
                        position: 'absolute',
                        opacity: 0.8,
                        alignItems: 'center',
                        backgroundColor: 'white',
                        width: StyleUtils.getWidth()
                    }}>

                    </View>}
                    <View style={{
                        width: StyleUtils.getWidth(),
                        justifyContent: 'center',
                        backgroundColor: 'transparent'
                    }}>
                        <TouchableOpacity transparent style={{
                            width: 50,
                            alignItems: 'flex-start',
                            justifyContent: 'flex-start',
                            marginLeft: 10,
                            marginRight: 5
                        }} onPress={() => this.back()}>
                            <Icon active color={'white'} size={StyleUtils.scale(35)} name={arrowName}/>

                        </TouchableOpacity>
                    </View>

                    <View
                                          style={[styles.avoidView, {width: StyleUtils.getWidth()}]}>
                        <View style={{marginBottom: 20, height: height, justifyContent: 'center'}}>


                            <View style={styles.thisContainer}>
                                <Image style={{position: 'absolute', top: -200, width: 110}} resizeMode='contain'
                                       source={thisLogo}/>
                                <ThisText style={styles.this}>THIS</ThisText>
                            </View>
                            <View style={{
                                width: StyleUtils.getWidth(),
                                flexDirection: 'column',
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}>

                                <View style={styles.firstLastNameContainer}>
                                    <View style={styles.nameTextInput} regular>
                                        <TextInput value={this.state.name} blurOnSubmit={true} returnKeyType='next'
                                                   ref="1"
                                                   onSubmitEditing={this.focusNextField.bind(this, "lastName")}
                                                   style={{
                                                       width: StyleUtils.scale(130),
                                                       color: 'white',
                                                       height: StyleUtils.scale(40),
                                                       fontSize: StyleUtils.scale(20),
                                                       borderBottomWidth: 1,
                                                       borderColor: 'white',
                                                   }}
                                                   underlineColorAndroid={'transparent'}
                                                   selectionColor={'black'}
                                                   placeholderTextColor={'white'}
                                                   onChangeText={(name) => this.setState({name})}
                                                   placeholder={strings.FirstName}/>
                                    </View>
                                    <View style={styles.lastnameTextInput} regular>
                                        <TextInput value={this.state.lastname} blurOnSubmit={true} returnKeyType='next'
                                                   ref="lastName"
                                                   onSubmitEditing={this.focusNextField.bind(this, "phone")}
                                                   style={{
                                                       width: StyleUtils.scale(130),
                                                       color: 'white',
                                                       height: StyleUtils.scale(40),
                                                       fontSize: StyleUtils.scale(20),
                                                       borderBottomWidth: 1,
                                                       borderColor: 'white',
                                                   }}
                                                   underlineColorAndroid={'transparent'}
                                                   selectionColor={'black'}
                                                   placeholderTextColor={'white'}
                                                   onChangeText={(lastname) => this.setState({lastname})}
                                                   placeholder={strings.LastName}/>
                                    </View>
                                </View>

                                <KeyboardAvoidingView style={{alignItems:'center',justifyContent:'center'}}   behavior={'position'}>

                                   <View style={{alignItems:'center',justifyContent:'center'}}>
                                    <View style={[styles.phoneTextInput, {justifyContent:'space-between',flexDirection:'row'}]} regular>
                                        {!I18nManager.isRTL &&  <TextInput focus={false} keyboardType='phone-pad' value={this.state.callingCode}
                                                   blurOnSubmit={true} returnKeyType='next'
                                                   onSubmitEditing={this.focusNextField.bind(this, "phone")}
                                                   underlineColorAndroid={'transparent'}
                                                   onChangeText={(callingCode) => this.setState({callingCode})}
                                                   placeholderTextColor={'white'}
                                                   selectionColor={'black'}
                                                   style={{
                                                       width:  StyleUtils.scale(60),
                                                       color: 'white',
                                                       borderColor: 'white',
                                                       height: StyleUtils.scale(40),
                                                       fontSize: StyleUtils.scale(20),
                                                       borderBottomWidth: 1
                                                   }}
                                        />}
                                        <TextInput focus={true} keyboardType='phone-pad' value={this.state.phoneNumber}
                                                   blurOnSubmit={true} returnKeyType='next'
                                                   ref='phone'
                                                   onSubmitEditing={this.focusNextField.bind(this, "password")}
                                                   underlineColorAndroid={'transparent'}
                                                   onChangeText={(phoneNumber) => this.setState({phoneNumber})}
                                                   placeholderTextColor={'white'}
                                                   selectionColor={'black'}
                                                   style={{
                                                       width: StyleUtils.scale(200),
                                                       color: 'white',
                                                       borderColor: 'white',
                                                       height: StyleUtils.scale(40),
                                                       fontSize: StyleUtils.scale(20),
                                                       borderBottomWidth: 1
                                                   }}
                                                   placeholder={strings.PhoneNumber}/>
                                        {I18nManager.isRTL &&  <TextInput focus={false} keyboardType='phone-pad' value={this.state.callingCode}
                                                                           blurOnSubmit={true} returnKeyType='next'
                                                                           onSubmitEditing={this.focusNextField.bind(this, "phone")}
                                                                           underlineColorAndroid={'transparent'}
                                                                           onChangeText={(callingCode) => this.setState({callingCode})}
                                                                           placeholderTextColor={'white'}
                                                                           selectionColor={'black'}
                                                                           style={{
                                                                               width:  StyleUtils.scale(60),
                                                                               color: 'white',
                                                                               borderColor: 'white',
                                                                               height: StyleUtils.scale(40),
                                                                               fontSize: StyleUtils.scale(20),
                                                                               borderBottomWidth: 1
                                                                           }}
                                        />}

                                    </View>

                                </View>
                                <View style={[styles.passwordTextInput, {width: StyleUtils.getWidth() - StyleUtils.scale(60)}]} regular>

                                    <TextInput

                                        ref='password'
                                        underlineColorAndroid={'transparent'}
                                        returnKeyType='next'
                                        defaultValue=""
                                        value={this.state.password}
                                        placeholderTextColor={'white'}
                                        style={{
                                            width: StyleUtils.getWidth() / 2 + StyleUtils.scale(120),
                                            color: 'white',
                                            height: StyleUtils.scale(40),
                                            fontSize: StyleUtils.scale(20),
                                            borderBottomWidth: 1,
                                            borderColor: passwordBorder,
                                        }}
                                        placeholder={strings.Password}
                                        selectionColor={'black'}
                                        secureTextEntry
                                        onChangeText={password => this.setState({password})}
                                        onSubmitEditing={this.focusNextField.bind(this, "verifyPassword")}
                                    />
                                </View>
                                <View style={[styles.passwordTextInput, {width: StyleUtils.getWidth() - StyleUtils.scale(60)}]} regular>

                                    <TextInput

                                        ref='verifyPassword'
                                        underlineColorAndroid={'transparent'}
                                        returnKeyType='done'
                                        selectionColor={'black'}
                                        defaultValue=""
                                        value={this.state.verifyPassword}
                                        placeholderTextColor={'white'}
                                        style={{
                                            width: StyleUtils.getWidth() / 2 + StyleUtils.scale(120),
                                            color: 'white',
                                            height: StyleUtils.scale(40),
                                            fontSize: StyleUtils.scale(20),
                                            borderBottomWidth: 1,
                                            borderColor: passwordBorder,
                                        }}
                                        placeholder={strings.VerifyPassword}
                                        secureTextEntry
                                        onChangeText={verifyPassword => this.setState({verifyPassword})}
                                        onSubmitEditing={this.signup.bind(this)}
                                    />
                                </View>
                                </KeyboardAvoidingView>
                                {signupProcess && <Spinner style={{position: 'absolute', top: -15}}/>}

                                {message}

                                <View style={{
                                    height: 50,
                                    marginTop: 20,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    width: width / 2 + 120
                                }}>
                                    <TouchableOpacity onPress={() => this.signup()} style={{
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
                                        }}>{strings.SignUp.toUpperCase()}</ThisText>

                                    </TouchableOpacity>

                                </View>


                            </View>


                        </View>
                    </View>

                    {this.state.showPopup &&
                    <TermsOfUse declineTerms={this.back.bind(this)} acceptTerms={this.closePopup.bind(this)}/>}

                </View>
            </ScrollView>


        );
    }

    createMessage(message) {
        if (message) {
            return <ThisText style={{backgroundColor: 'transparent', padding: 10, fontSize: 16, color: 'red'}}>
                {message}
            </ThisText>
        }
        return undefined;
    }

    closePopup() {
        this.setState({
            showPopup: false
        })
    }
}

export default connect(
    state => ({
        focusPassword: state.signupForm.focusPassword,
        focusPhone: state.signupForm.focusPhone,
        failedMessage: state.signupForm.failedMessage,
        focusLastname: state.signupForm.focusLastname,
        signupProcess: state.signupForm.signupProcess,
        focusName: state.signupForm.focusName,
        network: state.network,
    }),
    (dispatch) => ({
        actions: bindActionCreators(loginAction, dispatch)
    })
)(Signup);


