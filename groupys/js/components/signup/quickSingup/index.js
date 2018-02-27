import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Dimensions, I18nManager, Image, Keyboard, ScrollView, ScrollViwe, TouchableOpacity, View,TextInput} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import * as loginAction from "../../../actions/login";
import {bindActionCreators} from "redux";
import {QrScanner, } from '../../../ui/index'
import strings from "../../../i18n/i18n"
import StyleUtils from "../../../utils/styleUtils";
import styles from './styles';

const {width, height} = Dimensions.get('window')
const bg = require('../../../../images/bg.png');

class QuickSignup extends Component {
    static navigationOptions = ({navigation}) => ({
        header: null
    });

    constructor(props) {
        super(props);
        this.state = {
            phoneNumber: '',
        }
    }

    back() {
        this.props.navigation.goBack();
    }

    componentWillMount() {
        const {actions} = this.props;
    }

    hideKeyboard() {
        Keyboard.dismiss();
    }

    render() {
        const {navigation} = this.props;
        let arrowName = I18nManager.isRTL ? "ios-arrow-forward" : "ios-arrow-back";
        return <ScrollView>
            <View style={{flex: 1, backgroundColor: '#b7b7b7'}}>
                <View style={{
                    backgroundColor: 'white',
                    position: 'absolute',
                    height: height,
                    width: StyleUtils.getWidth()
                }}>
                    <Image style={{position: 'absolute', height: height, width: StyleUtils.getWidth()}}
                           resizeMode='cover' source={bg}/>

                </View>

                <View style={{ width:  StyleUtils.getWidth(), alignItems: 'center', justifyContent: 'center'}}>
                    <View style={{
                        width: StyleUtils.getWidth(),
                        height: 30,
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
                            <Icon active color={'white'} size={35} name={arrowName}/>

                        </TouchableOpacity>
                    </View>
                    <View  style={[styles.phoneTextInput, {marginBottom:20,height:50,width: StyleUtils.getWidth()}]} regular >

                        <TextInput keyboardType='numeric' value={this.state.phoneNumber}
                                   blurOnSubmit={true} returnKeyType='done'

                                   underlineColorAndroid={'transparent'}
                                   onChangeText={(phoneNumber) => this.setState({phoneNumber})}
                                   placeholderTextColor={'white'}
                                   style={{width:StyleUtils.getWidth() / 2 + 120,color:'white',borderColor:'white',height:50,fontSize:20,borderBottomWidth:1}}
                                   placeholder={strings.PhoneNumber}/>
                    </View>

                    <QrScanner navigation={navigation}/>
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




