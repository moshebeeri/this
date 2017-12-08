import React, {Component} from 'react';
import {Dimensions,TouchableOpacity,Image,Platform} from 'react-native';
import {Button, Header, Input, InputGroup, Tab, TabHeading, Tabs, Text, View} from 'native-base';
import {actions} from 'react-native-navigation-redux-helpers';
import {Menu, MenuOption, MenuOptions, MenuTrigger,} from 'react-native-popup-menu';
import Icon from 'react-native-vector-icons/Ionicons';
import Icon2 from 'react-native-vector-icons/SimpleLineIcons';
import * as notificationAction from "../../actions/notifications";
import {connect} from 'react-redux';
import {bindActionCreators} from "redux";

const {width, height} = Dimensions.get('window')
const vw = width / 100;
const vh = height / 100

const qrcode = require('../../../images/qr-code.png');
import strings from "../../i18n/i18n"
import { I18nManager } from 'react-native';

class GeneralComponentHeader extends Component {
    constructor(props) {
        super(props);
    }

    realize() {
        this.props.navigate('realizePromotion')
    }

    back() {
        this.props.navigation.goBack();
    }
    showPromotionScaning() {
        this.props.navigate('ReadQrCode');
    }


    followBusiness() {
        this.props.navigate("businessFollow");
    }

    onBoardingPromotion() {
        this.props.navigate("businessFollow");
    }

    getNotification() {
        this.props.actions.setTopNotification();
    }

    render() {
        let back = undefined;
        let headerHeight = vh *7;
        if (Platform.OS === 'ios') {
            headerHeight = vh *9;
        }
        if (this.props.showBack) {
            back = <Button transparent style={{marginLeft:5,marginRight:5}} onPress={() => this.back()}>
                <Icon active color={"#2db6c8"} size={20} name="ios-arrow-back"/>

            </Button>
        }
        let menuAction = <Menu>
            <MenuTrigger>
                <Icon2 style={{fontSize: 25, color: "#2db6c8"}} name="options-vertical"/>
            </MenuTrigger>
            <MenuOptions>

                <MenuOption onSelect={this.followBusiness.bind(this)}>
                    <Text>{strings.FollowBusiness}</Text>
                </MenuOption>
                <MenuOption onSelect={this.onBoardingPromotion.bind(this)}>
                    <Text>{strings.OnBoardingPromotions}</Text>
                </MenuOption>
                <MenuOption onSelect={this.getNotification.bind(this)}>
                    <Text>Refresh Notification REMOVE</Text>
                </MenuOption>

            </MenuOptions>
        </Menu>
        return (
            <View style={{
                height: headerHeight, flexDirection: 'row', alignItems: 'center', backgroundColor: 'white',
                justifyContent: 'space-between',
            }}>
                {I18nManager.isRTL && <View style={{height: vh * 7, flexDirection: 'row', alignItems: 'flex-start'}}>
                    {back}

                    <Button transparent style={{marginLeft: 5, marginRight: 5}} onPress={this.props.openDrawer}>
                        <Icon2 active color={"#2db6c8"} size={20} name="menu"/>

                    </Button>

                </View>
                }
                {!I18nManager.isRTL && <View style={{
                    height: vh * 6, flexDirection: 'row', justifyContent: 'center', alignItems: 'center'
                }}>
                    {menuAction}
                    <TouchableOpacity onPress={() => this.showPromotionScaning()}
                                      style={{
                                          width: 30, height: 30,
                                          flexDirection: 'column',
                                          alignItems: 'center',
                                      }}
                                      regular>
                        <Image resizeMode="cover" style={{tintColor: '#2db6c8', marginTop: 3, width: 25, height: 25}}
                               source={qrcode}/>

                    </TouchableOpacity>

                </View>
                }
                <Text transparent style={{color: "#2db6c8", backgroundColor: 'transparent'}}>THIS</Text>
                {I18nManager.isRTL && <View style={{
                    height: vh * 6, flexDirection: 'row', justifyContent: 'center', alignItems: 'center'
                }}>
                    <TouchableOpacity onPress={() => this.showPromotionScaning()}
                                      style={{
                                          width: 30, height: 30,
                                          flexDirection: 'column',
                                          alignItems: 'center',
                                      }}
                                      regular>
                        <Image resizeMode="cover" style={{tintColor: '#2db6c8', marginTop: 3, width: 25, height: 25}}
                               source={qrcode}/>

                    </TouchableOpacity>
                    {menuAction}
                </View>
                }
                {!I18nManager.isRTL && <View style={{height: vh * 7, flexDirection: 'row', alignItems: 'flex-start'}}>
                    {back}

                    <Button transparent style={{marginLeft: 5, marginRight: 5}} onPress={this.props.openDrawer}>
                        <Icon2 active color={"#2db6c8"} size={20} name="menu"/>

                    </Button>

                </View>
                }
            </View>

        );
    }
}

export default connect(
    state => ({
        notification: state.notification
    }),
    (dispatch) => ({
        actions: bindActionCreators(notificationAction, dispatch)
    })
)(GeneralComponentHeader);

