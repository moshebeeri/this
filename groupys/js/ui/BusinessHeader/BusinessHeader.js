import React, {Component} from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import {Thumbnail,Button} from 'native-base';
import {connect} from 'react-redux';
import {bindActionCreators} from "redux";
import Icon from 'react-native-vector-icons/Ionicons';
import styles from './styles'
import { I18nManager } from 'react-native';
import {Menu, MenuOption, MenuOptions, MenuTrigger,} from 'react-native-popup-menu';
import * as businessActions from "../../actions/business";
import Icon2 from 'react-native-vector-icons/SimpleLineIcons';
import strings from "../../i18n/i18n"
class BusinessHeader extends Component {
    constructor(props) {
        super(props);
    }

    showBusiness() {
        const{navigation,business} = this.props;
        navigation.navigate("businessProfile", {businesses: business});
    }

    unFollowBusiness(){
        const {business}  = this.props;
        this.props.actions.unFollowBusiness(business._id);
    }

    createBusinessLog() {
        const {businessLogo,small,noProfile} = this.props;

        if (businessLogo) {
            if(noProfile){
                return <View style={{margin:5}} >
                    <View>
                        <Thumbnail square={true} size={40} source={{uri: businessLogo}}/>
                    </View>
                </View>
            }
            if(small){
                return <TouchableOpacity style={{margin:5}} onPress={this.showBusiness.bind(this)}>
                    <View>
                        <Thumbnail small square={true} size={40} source={{uri: businessLogo}}/>
                    </View>
                </TouchableOpacity>
            }
            return <TouchableOpacity style={{margin:5}} onPress={this.showBusiness.bind(this)}>
                <View>
                    <Thumbnail square={true} size={40} source={{uri: businessLogo}}/>
                </View>
            </TouchableOpacity>
        }
        return undefined;
    }

    assignQrCode(){
        const {business}  = this.props;
        this.props.navigation.navigate('ReadQrCode',{business:business})
    }
    back() {
        this.props.navigation.goBack();
    }
    render() {
        const {categoryTitle, color, businessName,showBack,noMargin,editButton,businessView} = this.props;
        let nameTextStyle = styles.businessNameText;
        if(color){
            nameTextStyle = styles.businessColorNameText;
        }

        let headerContainerStyle = styles.logo_view;
        if(noMargin){
            headerContainerStyle = styles.logo_view_no_margin;
        }
        let showEdit = false;
        if(editButton){
            showEdit = true;
        }
        let arrowName = I18nManager.isRTL ? "ios-arrow-forward" : "ios-arrow-back";

        let back = undefined;

        let menuAction = <Menu>
            <MenuTrigger placement="right">
                <Icon2 style={{fontSize: 25}} name="options-vertical"/>
            </MenuTrigger>
            <MenuOptions>

                <MenuOption onSelect={this.unFollowBusiness.bind(this)}>
                    <Text>{strings.UnFollow}</Text>
                </MenuOption>
            </MenuOptions>
        </Menu>

        if(businessView) {
            menuAction = <Menu>
                <MenuTrigger placement="right">
                    <Icon2 style={{fontSize: 25}} name="options-vertical"/>
                </MenuTrigger>
                <MenuOptions>

                    <MenuOption onSelect={this.assignQrCode.bind(this)}>
                        <Text>{strings.assignQrCode}</Text>
                    </MenuOption>
                </MenuOptions>
            </Menu>
        }
        if (showBack) {
            back = <TouchableOpacity transparent style={{alignItems:'flex-start',justifyContent:'flex-start',width:40,marginLeft:10,marginRight:10}} onPress={() => this.back()}>
                <Icon active  color={"#2db6c8"} size={30} name={arrowName}/>

            </TouchableOpacity>
        }
        return <View style={headerContainerStyle}>
            <View style={{alignItems:'center',justifyContent:'center'}}>
                {back}
            </View>


            {  this.createBusinessLog()}
            <View style={{flex: 1, flexDirection: 'column',justifyContent:'center'}}>
                <Text style={nameTextStyle} note>{businessName}</Text>
                {categoryTitle && <Text numberOfLines={1} style={styles.businessAddressText}
                      note>{categoryTitle}</Text>}
            </View>
            {   showEdit &&  <View style={{flex: 0.2, flexDirection: 'row', alignItems: 'center',}}>
                {editButton}
            </View> }
            <View style={{alignItems:'center',justifyContent:'center'}}>
                {menuAction}
            </View>
        </View>
    }
}

export default connect(
    state => ({
        businesses: state.businesses,
    }),
    dispatch => ({
        actions: bindActionCreators(businessActions, dispatch)
    })
)(BusinessHeader);


