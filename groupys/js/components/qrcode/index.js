import React, {Component} from 'react';
import {connect} from 'react-redux';
import {View} from 'react-native';
import {Button, Container, Content, Footer, Header, Icon, Input, InputGroup} from 'native-base';
import * as promotionAction from "../../actions/promotions";
import {bindActionCreators} from "redux";
import {QrScanner,FormHeader} from '../../ui/index'

class Qrcode extends Component {
    static navigationOptions = ({navigation}) => ({
        header: null
    });

    constructor(props) {
        super(props);

    }

    componentWillMount() {
        const {actions} = this.props;
        actions.clearRealizationForm();
    }





    render() {
        const {navigation} = this.props;
        let group
        if(navigation.state.params && navigation.state.params.group){
            group = navigation.state.params.group;
        }
        return <View style={{flex: 1, backgroundColor:'#b7b7b7'}}>
            <View style={{flex:2,marginBottom:10}}>
            <FormHeader showBack navigation={navigation}
                        title={"QR Scanner"} bgc="#2db6c8"/>
            </View>
            <View style={{flex:5,alignItems:'center',justifyContent:'center'}}>
            <QrScanner group={group} navigation={navigation}/>
            </View>
        </View>
    }
}

export default connect(
    state => ({
        scanQrcodeForm: state.scanQrcodeForm,
    }),
    (dispatch) => ({
        actions: bindActionCreators(promotionAction, dispatch)
    })
)(Qrcode);




