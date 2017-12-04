import React, {Component} from 'react';
import {Image, Platform, TouchableOpacity, KeyboardAvoidingView, Dimensions} from 'react-native';
import {connect} from 'react-redux';
import {actions} from 'react-native-navigation-redux-helpers';
import {Container, Content, Text, InputGroup, Input, Button, Icon, View, Item} from 'native-base';

const {width, height} = Dimensions.get('window')
import LinearGradient from 'react-native-linear-gradient';
import styles from './styles';

const logo = require('../../../images/logo.png');
import {NavigationActions} from 'react-navigation'
import {bindActionCreators} from "redux";
import * as loginAction from "../../actions/login";
import strings from "../../i18n/i18n"
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

    validateCode() {
        this.props.actions.verifyCode(this.state.code, this.props.navigation, resetAction)
    }

    render() {
        const {message} = this.props;
        const errorMessage = this.createMessage(message);
        return (
            <LinearGradient


                colors={['#67ccf8', '#66cdcc']}
                style={styles.inputContainer}
            >


                <View style={styles.inputContainer}>
                    <KeyboardAvoidingView behavior={'position'} style={styles.avoidView}>

                        <View>
                            <View style={styles.thisContainer}>
                                <Text style={styles.this}>{strings.THIS}</Text>

                            </View>
                            <View style={styles.mainContainer}>

                                <Text style={styles.signInText}>{strings.SmsMessagePart1}</Text>
                                <Text style={styles.decritpionLine2}>{strings.SmsMessagePart2}</Text>
                                <Item style={styles.nameTextInput} regular>
                                    <Input value={this.state.name} blurOnSubmit={true} returnKeyType='done' ref="1"
                                           onSubmitEditing={this.validateCode.bind(this)}
                                           onChangeText={(code) => this.setState({code})}
                                           placeholder={strings.ValidationCode}/>
                                </Item>

                                {errorMessage}
                                <View style={{
                                    height: 40,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    width: width / 2 + 120
                                }}>

                                    <TouchableOpacity onPress={() => this.validateCode()} style={{
                                        width: 100,
                                        height: 30,
                                        borderRadius: 10,
                                        backgroundColor: 'skyblue',
                                        margin: 3,
                                        flexDirection: 'row',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                    }} regular>

                                        <Text
                                            style={{color: 'white', fontStyle: 'normal', fontSize: 15}}>{strings.Validate}.toUpperCase()</Text>

                                    </TouchableOpacity>
                                </View>

                            </View>

                        </View>
                    </KeyboardAvoidingView>


                </View>
            </LinearGradient>

        );
    }

    createMessage(message) {
        if (message) {
            return <Text style={{backgroundColor: 'transparent', padding: 10, fontSize: 16, color: 'red'}}>
                {this.state.validationMessage}
            </Text>
        }
        return undefined;
    }
}

export default connect(
    state => ({
        message: state.registerForm.message,
    }),
    (dispatch) => ({
        actions: bindActionCreators(loginAction, dispatch)
    })
)(Register);
