import React, {Component} from "react";
import {
    Dimensions,
    Image,
    KeyboardAvoidingView,
    Platform,
    TextInput,
    TouchableHighlight,
    TouchableOpacity,
    I18nManager,
    View
} from "react-native";
import {connect} from "react-redux";
import {actions} from "react-native-navigation-redux-helpers";
import {Button, Input, Item, Text} from "native-base";
import {bindActionCreators} from "redux";
import * as loginAction from "../../actions/login";
import styles from "./styles";
import {isAuthenticated} from "../../selectors/appSelector";
import strings from "../../i18n/i18n"
import Icon from 'react-native-vector-icons/Ionicons';
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
        this.props.navigation.navigate(route);
    }

    forgetPassword() {
        if (this.state.phoneNumber) {
            this.props.actions.forgetPassword(this.state.phoneNumber)
        }
        this.props.navigation.goBack();
    }

    shouldComponentUpdate(){
        if(this.props.currentScreen ==='forgetPassword' ){
            return true;
        }
        return false;
    }
    render() {
        const {failedMessage} = this.props;

        let arrowName = I18nManager.isRTL ? "ios-arrow-forward" : "ios-arrow-back";



        return (

            <KeyboardAvoidingView behavior={'position'} style={styles.inputContainer}>

                <View style={{position: 'absolute', height: height, width: width}}>
                    <Image style={{position: 'absolute', height: height, width: width}} resizeMode='cover'
                           source={bg}/>

                </View>
                <View style={{width:width,height:60,justifyContent:'center',backgroundColor:'transparent'}}>
                <TouchableOpacity transparent style={{width:50,alignItems:'flex-start',justifyContent:'flex-start',marginTop:5,marginLeft: 10, marginRight: 5}} onPress={() => this.back()}>
                    <Icon active color={'white'} size={35} name={arrowName}/>

                </TouchableOpacity>
                </View>
                <View style={{
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}>

                    <View style={styles.thisContainer}>
                        <Image style={{position: 'absolute', top: -175, width: 140}} resizeMode='contain'
                               source={thisLogo}/>
                        <Text style={styles.this}>THIS</Text>
                    </View>
                    <View style={{
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}>




                        <View style={styles.phoneTextInput} regular>
                            <TextInput keyboardType='phone-pad' value={this.state.name}
                                       blurOnSubmit={true} returnKeyType='next'
                                       onSubmitEditing={this.forgetPassword.bind(this)}
                                       underlineColorAndroid={'transparent'}
                                       onChangeText={(phoneNumber) => this.setState({phoneNumber})}
                                       placeholderTextColor={'white'}
                                       style={{
                                           width: width / 2 + 120,
                                           color: 'white',
                                           borderColor: 'white',
                                           height: 50,
                                           fontSize: 20,
                                           borderBottomWidth: 1
                                       }}
                                       placeholder={strings.PhoneNumber}/>
                        </View>
                        <View style={{height: 60, marginTop:10, justifyContent: 'center',
                            alignItems:'center', width: width / 2 + 120}}>
                            <Text style={styles.SignUpText}>{strings.PasswordRecoverySMSNotificationMessage}</Text>
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


                            <TouchableOpacity onPress={() => this.forgetPassword()} style={{
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
                                }}>{strings.SendSMS.toUpperCase()}</Text>

                            </TouchableOpacity>
                        </View>

                    </View>

                </View>


            </KeyboardAvoidingView>


        );
    }
}

export default connect(
    state => ({
        isAuthenticated: isAuthenticated(state),
        currentScreen:state.render.currentScreen,
    }),
    (dispatch) => ({
        actions: bindActionCreators(loginAction, dispatch)
    })
)(ForgetPassword);


