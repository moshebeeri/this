import React, {Component} from 'react';
import {Dimensions, I18nManager, Image, Platform, TextInput, TouchableOpacity} from 'react-native';
import {Button, Header, Input, InputGroup, Spinner, Tab, TabHeading, Tabs, Text, View} from 'native-base';
import {actions} from 'react-native-navigation-redux-helpers';
import {Menu, MenuOption, MenuOptions, MenuTrigger,} from 'react-native-popup-menu';
import Icon from 'react-native-vector-icons/Ionicons';
import Icon2 from 'react-native-vector-icons/SimpleLineIcons';
import * as notificationAction from "../../actions/notifications";
import * as debugAction from "../../actions/debug";
import * as businessAction from "../../actions/business";
import * as groupsAction from "../../actions/groups";
import {connect} from 'react-redux';
import {bindActionCreators} from "redux";
import globals from '../../conf/global'
import strings from "../../i18n/i18n"
import StyleUtils from "../../utils/styleUtils";
const { height} = Dimensions.get('window')
import {ThisText} from '../../ui/index';

const vh = height / 100

const qrcode = require('../../../images/qr-code.png');

class GeneralComponentHeader extends Component {
    constructor(props) {
        super(props);
        this.state = {
            search: ''
        }
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

    searchBusiness() {
        this.props.businessActions.showSearchForm('business', strings.SearchBusiness);
    }

    searchGroups() {
        this.props.businessActions.showSearchForm('groups', strings.SearchGroups);
    }

    resetSearch() {
        this.props.businessActions.resetFollowForm();
    }

    followBusiness() {
        this.props.navigate("businessFollow");
    }

    search() {
        let searchParams = this.state.searchText;
        if (this.props.state.searchType === 'business') {
            this.props.businessActions.searchBusiness(searchParams)
        } else {
            this.props.groupsAction.searchGroup(searchParams)
        }
        this.setState({
            searchText: ''
        })
    }
    resetMessage(){
        const{debug} = this.props;
        debug.resetMessag();
    }


    render() {
        const {businessActions, state, network} = this.props;
        let back = undefined;
        let headerHeight = vh * 7;
        if (Platform.OS === 'ios') {
            headerHeight = vh * 9;
        }
        if (this.props.showBack) {
            back = <Button transparent style={{marginLeft: 5, marginRight: 5}} onPress={() => this.back()}>
                <Icon active color={"#2db6c8"} size={20} name="ios-arrow-back"/>

            </Button>
        }
        let arrowName = I18nManager.isRTL ? "ios-arrow-forward" : "ios-arrow-back";
        if (state.searchType) {
            return (
                <View style={{width: StyleUtils.getWidth()}}>
                    {network.offline && <View style={{
                        width: StyleUtils.getWidth(),
                        height: 20,
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: '#f4ce42'
                    }}>
                        <ThisText style={{color: 'gray'}}>Offline</ThisText>
                    </View>}
                    {network.debugMessage && globals.debug &&  <TouchableOpacity
                        onPress={() => this.resetMessage()}
                        style={{
                        width: StyleUtils.getWidth(),
                        height: 20,
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: 'white',


                    }}>
                        <ThisText style={{color: 'gray'}}>{network.debugMessage}</ThisText>
                    </TouchableOpacity>}
                    <View style={{
                        height: headerHeight, flexDirection: 'row', alignItems: 'center', backgroundColor: 'white',
                        justifyContent: 'space-between',
                    }}>
                        <TouchableOpacity transparent style={{
                            marginLeft: 5,
                            marginRight: 0,
                            alignItems: 'center',
                            justifyContent: 'center'
                        }} onPress={() => this.resetSearch()}>
                            <View style={{
                                alignItems: 'flex-start',
                                marginTop: 10,
                                justifyContent: 'flex-end',
                                marginLeft: 10,
                                width: 30
                            }}>
                                <Icon active color={"#2db6c8"} size={25} name={arrowName}/>
                            </View>

                        </TouchableOpacity>
                        <TextInput style={{
                            color: "#888888",
                            marginLeft: 10,
                            marginRight: 40,
                            marginTop: 5,

                            fontSize: 18,
                            width: StyleUtils.getWidth() - 100,
                            height:40
                        }}
                                   underlineColorAndroid='transparent'
                                   value={this.state.searchText}
                                   autoFocus={true}
                                   returnKeyType='search'
                                   onSubmitEditing={this.search.bind(this)}
                                   onChangeText={(searchText) => this.setState({searchText})}
                                   placeholder={state.searchPlaceHolder}
                        />
                        {state.searching && <Spinner style={{right: 20, position: 'absolute'}}/>}

                    </View>
                </View>
            );
        }
        let menuAction = <Menu>
            <MenuTrigger>
                <Icon style={{fontSize: 30, color: "#2db6c8"}} name="ios-search"/>
            </MenuTrigger>
            <MenuOptions>

                <MenuOption onSelect={this.searchBusiness.bind(this)}>
                    <ThisText>{strings.SearchBusiness}</ThisText>
                </MenuOption>
                <MenuOption onSelect={this.searchGroups.bind(this)}>
                    <ThisText>{strings.SearchGroups}</ThisText>
                </MenuOption>


            </MenuOptions>
        </Menu>
        return (
            <View style={{width: StyleUtils.getWidth()}}>
                {network.offline && <View style={{
                    width: StyleUtils.getWidth(),
                    height: 20,
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: '#f4ce42'
                }}>
                    <ThisText style={{color: 'gray'}}>{strings.Offline}</ThisText>
                </View>}
                <View style={{
                    height: headerHeight, flexDirection: 'row', alignItems: 'center', backgroundColor: 'white',
                    justifyContent: 'space-between',
                }}>

                    {<View style={{height: vh * 7, flexDirection: 'row', alignItems: 'flex-start'}}>
                        {back}

                        <Button transparent style={{marginLeft: 5, marginRight: 5}} onPress={this.props.openDrawer}>
                            <Icon2 active color={"#2db6c8"} size={20} name="menu"/>

                        </Button>

                    </View>
                    }

                    <ThisText transparent style={{color: "#2db6c8", backgroundColor: 'transparent'}}>THIS</ThisText>
                    {<View style={{
                        height: vh * 6, flexDirection: 'row', justifyContent: 'center', alignItems: 'center'
                    }}>
                        {menuAction}
                        <TouchableOpacity onPress={() => this.showPromotionScaning()}
                                          style={{
                                              width: 30, height: 30,
                                              marginRight: 5,
                                              marginLeft: 5,
                                              flexDirection: 'column',
                                              alignItems: 'center',
                                          }}
                                          regular>
                            <Image resizeMode="cover"
                                   style={{tintColor: '#2db6c8', marginTop: 3, width: 25, height: 25}}
                                   source={qrcode}/>

                        </TouchableOpacity>

                    </View>
                    }

                </View>
            </View>

        );
    }
}

export default connect(
    state => ({
        notification: state.notification,
        state: state.follow_businesses,
        network: state.network,
    }),
    (dispatch) => ({
        actions: bindActionCreators(notificationAction, dispatch),
        businessActions: bindActionCreators(businessAction, dispatch),
        groupsAction: bindActionCreators(groupsAction, dispatch),
        debug:bindActionCreators(debugAction, dispatch),
    })
)(GeneralComponentHeader);

