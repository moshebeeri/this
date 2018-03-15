import React, {Component} from 'react';
import {I18nManager, Text, TouchableOpacity, View} from 'react-native';
import {Button, Thumbnail} from 'native-base';
import {connect} from 'react-redux';
import {bindActionCreators} from "redux";
import Icon from 'react-native-vector-icons/Ionicons';
import styles from './styles'
import {Menu, MenuOption, MenuOptions, MenuTrigger,} from 'react-native-popup-menu';
import * as businessActions from "../../actions/business";
import Icon2 from 'react-native-vector-icons/SimpleLineIcons';
import strings from "../../i18n/i18n"
import {ImageController,ThisText} from '../index'
import StyleUtils from "../../utils/styleUtils";

class BusinessHeader extends Component {
    constructor(props) {
        super(props);
    }

    showBusiness() {
        const {navigation, business,businessView} = this.props;
        navigation.navigate("businessProfile", {businesses: business,fromBusiness:businessView});
    }

    showBusinessAccountDetails() {
        const {navigation, business} = this.props;
        navigation.navigate("businessAccount", {businesses: business});
    }

    onBoardingPromotion() {
        const {navigation, business} = this.props;
        navigation.navigate("addPromotions", {business: business, onBoardType: 'BUSINESS'});
    }

    unFollowBusiness() {
        const {business} = this.props;
        this.props.actions.unFollowBusiness(business._id);
    }

    createBusinessLog() {
        const {businessLogo, small, noProfile,size} = this.props;

        let defaultSize = 40;
        if(size){
            defaultSize = size;
        }
        if (businessLogo) {
            if (noProfile) {
                return <View style={{margin: 10}}>
                    <View>
                        <ImageController  thumbnail  size={40} source={{uri: businessLogo}}/>
                    </View>
                </View>
            }
            if (small) {
                return <TouchableOpacity style={{margin: 10}} onPress={this.showBusiness.bind(this)}>
                    <View>
                        <ImageController  square thumbnail  size={36} source={{uri: businessLogo}}/>
                    </View>
                </TouchableOpacity>
            }
            return <TouchableOpacity style={{margin: 10}} onPress={this.showBusiness.bind(this)}>
                <View>
                    <ImageController  thumbnail  size={defaultSize} source={{uri: businessLogo}}/>
                </View>
            </TouchableOpacity>
        }
        return undefined;
    }

    showFeedBack() {
        const {showActions, id} = this.props;
        showActions(true, id);
    }

    assignQrCode() {
        const {business} = this.props;
        this.props.navigation.navigate('ReadQrCode', {business: business})
    }

    back() {
        const {backAction} = this.props;
        if (backAction) {
            backAction();
        }
        this.props.navigation.goBack();
    }

    render() {
        const {showActions,categoryTitle, color, businessName, showBack, noMargin, editButton, businessView, hideMenu} = this.props;
        let nameTextStyle = styles.businessNameText;
        if (color) {
            nameTextStyle = styles.businessColorNameText;
        }
        let headerContainerStyle = styles.logo_view;
        if (noMargin) {
            headerContainerStyle = styles.logo_view_no_margin;
        }
        let showEdit = false;
        if (editButton) {
            showEdit = true;
        }
        let arrowName = I18nManager.isRTL ? "ios-arrow-forward" : "ios-arrow-back";
        let back = undefined;
        let menuAction = <Menu>
            <MenuTrigger placement="right">
                <Icon2 style={{color:'white',paddingLeft: 10, fontSize: 15}} name="options"/>
            </MenuTrigger>
            <MenuOptions>
                <MenuOption onSelect={this.unFollowBusiness.bind(this)}>
                    <ThisText style={{padding:10,paddingBottom:5}}>{strings.UnFollow}</ThisText>
                </MenuOption>
                {showActions && <MenuOption onSelect={this.showFeedBack.bind(this)}>
                    <ThisText  style={{padding:10,paddingTop:5}}>{strings.reportActivity}</ThisText>
                </MenuOption>}
            </MenuOptions>
        </Menu>;
        if (businessView) {
            menuAction = <Menu>
                <MenuTrigger placement="right">
                    <Icon2 style={{paddingLeft: 10, fontSize: 15}} name="options"/>
                </MenuTrigger>
                <MenuOptions>

                    <MenuOption onSelect={this.assignQrCode.bind(this)}>
                        <ThisText style={{padding:10,paddingBottom:5}}>{strings.assignQrCode}</ThisText>
                    </MenuOption>
                    <MenuOption onSelect={this.showBusinessAccountDetails.bind(this)}>
                        <ThisText style={{padding:10,paddingTop:5}}>{strings.accountDetail}</ThisText>
                    </MenuOption>
                </MenuOptions>
            </Menu>
        }
        if (showBack) {
            back = <TouchableOpacity transparent style={{
                alignItems: 'flex-start',
                justifyContent: 'flex-start',
                width: 40,
                marginLeft: 10,
                marginRight: 10
            }} onPress={() => this.back()}>
                <Icon active  color={"#2db6c8"} size={30} name={arrowName}/>
            </TouchableOpacity>
        }
        return  <View>
            {!this.props.noProfile ?
                <View style={{margin: 7}} >
                    {this.headerInternals(headerContainerStyle, back, nameTextStyle, businessName, categoryTitle, showEdit, editButton, hideMenu, menuAction)}
                </View>
                :
                <View style={{margin: 7}}>
                    {this.headerInternals(headerContainerStyle, back, nameTextStyle, businessName, categoryTitle, showEdit, editButton, hideMenu, menuAction)}
                </View>
            }
            </View>
    }

    headerInternals(headerContainerStyle, back, nameTextStyle, businessName, categoryTitle, showEdit, editButton, hideMenu, menuAction) {
        const{bgColor,textColor} = this.props;
        let backgroundColor= 'white';
        if(bgColor){
            backgroundColor = bgColor;
        }

        return <View style={[headerContainerStyle, {backgroundColor:backgroundColor,width: StyleUtils.getWidth()}]}>
            <View style={{alignItems: 'center', justifyContent: 'center'}}>
                {back}
            </View>
            {this.createBusinessLog()}
            <View style={{flex: 1, marginLeft:10,flexDirection: 'column', justifyContent: 'center'}}>
                <ThisText style={[nameTextStyle, {color:textColor,fontWeight:'bold'}]} note>{businessName}</ThisText>{categoryTitle &&
            <ThisText numberOfLines={1} style={styles.businessAddressText}
                      note>{categoryTitle}</ThisText>}
            </View>
            {showEdit ? <View style={{flexDirection: 'row', alignItems: 'center',}}>
                <View style={{marginTop:10}}>
                {editButton}
                </View>
                <View style={{marginRight: 20,  alignItems: 'center', justifyContent: 'center'}}>
                    {menuAction}
                </View>
            </View> :  <View style={{marginRight: 20, padding: 5, marginTop:20, alignItems: 'center', justifyContent: 'center'}}>
                {!hideMenu && menuAction}
            </View>}

        </View>;
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


