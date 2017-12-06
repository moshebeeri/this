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

    replaceRoute(route) {
        this.props.navigation.navigate(route);
    }

    forgetPassword() {
        if (this.state.phoneNumber) {
            this.props.actions.forgetPassword(this.state.phoneNumber)
        }
        this.props.navigation.goBack();
    }

    render() {
        const {failedMessage} = this.props;
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
                            <Text style={styles.this}>strings.THIS</Text>
                        </View>
                        <View style={{
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}>

                            <View style={{height: 60, justifyContent: 'flex-end', width: width / 2 + 120}}>
                                <Text style={styles.SignUpText}>{strings.PasswordRecoverySMSNotificationMessage}</Text>
                            </View>

                            <Item style={styles.phoneTextInput} regular>
                                <Input focus={true} keyboardType='phone-pad' value={this.state.name}
                                       blurOnSubmit={true} returnKeyType='next'
                                       onSubmitEditing={this.forgetPassword.bind(this)}
                                       onChangeText={(phoneNumber) => this.setState({phoneNumber})}
                                       placeholder={strings.PhoneNumber}/>
                            </Item>


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
                                    }}>{strings.SendSMS}</Text>

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
        isAuthenticated: isAuthenticated(state),
    }),
    (dispatch) => ({
        actions: bindActionCreators(loginAction, dispatch)
    })
)(ForgetPassword);


