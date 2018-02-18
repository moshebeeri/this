import React, {Component} from 'react';
import {connect} from 'react-redux';
import {ScrollView, View,Keyboard} from 'react-native';
import * as loginAction from "../../../actions/login";
import {bindActionCreators} from "redux";
import {FormHeader, QrScanner,TextInput} from '../../../ui/index'
import strings from "../../../i18n/i18n"

class QuickSignup extends Component {
    static navigationOptions = ({navigation}) => ({
        header: null
    });

    constructor(props) {
        super(props);
        this.state ={
            phoneNumber:'',
        }
    }

    componentWillMount() {
        const {actions} = this.props;
    }
    hideKeyboard(){
        Keyboard.dismiss();
    }

    render() {
        const {navigation} = this.props;
        return <ScrollView>
            <View style={{flex: 1, backgroundColor: '#b7b7b7'}}>
                <View style={{flex: 2, marginBottom: 10}}>
                    <FormHeader showBack navigation={navigation}
                                title={strings.SignUpQuick} bgc="#2db6c8"/>
                </View>
                <View style={{flex: 5, alignItems: 'center', justifyContent: 'center'}}>
                    <TextInput keyboardType='phone-pad' value={this.state.phoneNumber}
                               ref='name'
                               blurOnSubmit={true} returnKeyType='done'
                               onSubmitEditing={this.hideKeyboard.bind(this)}
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
                    <QrScanner  navigation={navigation}/>
                </View>
            </View>
        </ScrollView>
    }
}

export default connect(
    state => ({
        scanQrcodeForm: state.scanQrcodeForm,
        currentScreen: state.render.currentScreen,
    }),
    (dispatch) => ({
        actions: bindActionCreators(loginAction, dispatch)
    })
)(QuickSignup);




