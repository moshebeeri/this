import React, {Component} from 'react';
import {connect} from 'react-redux';
import {View,ScrollView,InteractionManager} from 'react-native';
import {Button, Container, Content, Footer, Header, Icon, Input, InputGrou} from 'native-base';
import * as promotionAction from "../../actions/promotions";
import {bindActionCreators} from "redux";
import {FormHeader, QrScanner} from '../../ui/index'
import strings from "../../i18n/i18n"

class Qrcode extends Component {
    static navigationOptions = ({navigation}) => ({
        header: null
    });

    constructor(props) {
        super(props);
    }

    componentWillMount() {
        const {actions} = this.props;
        InteractionManager.runAfterInteractions(() => {
        actions.clearRealizationForm()});
    }

    render() {
        const {navigation} = this.props;
        let group
        if (navigation.state.params && navigation.state.params.group) {
            group = navigation.state.params.group;
        }
        let business
        if (navigation.state.params && navigation.state.params.business) {
            business = navigation.state.params.business;
        }
        return <ScrollView>
            <View style={{flex: 1, backgroundColor: '#b7b7b7'}}>
                <View style={{flex: 2, marginBottom: 10}}>
                    <FormHeader showBack navigation={navigation}
                                title={strings.QrScanner} bgc="#2db6c8"/>
                </View>
                <View style={{flex: 5, alignItems: 'center', justifyContent: 'center'}}>
                    <QrScanner business={business} group={group} navigation={navigation}/>
                </View>
            </View>
        </ScrollView>
    }

    shouldComponentUpdate() {
        if (this.props.currentScreen === 'ReadQrCode') {
            return true;
        }
        return false;
    }
}

export default connect(
    state => ({
        scanQrcodeForm: state.scanQrcodeForm,
        currentScreen: state.render.currentScreen,
    }),
    (dispatch) => ({
        actions: bindActionCreators(promotionAction, dispatch)
    })
)(Qrcode);




