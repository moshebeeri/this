import React, {Component} from 'react';
import {Dimensions, I18nManager, Image, TextInput, TouchableOpacity} from 'react-native';
import {Button, Header, Input, InputGroup, Spinner, Tab, TabHeading, Tabs, View} from 'native-base';
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
import strings from "../../i18n/i18n"
import StyleUtils from "../../utils/styleUtils";
import {ThisText} from '../../ui/index';
import navigationUtils from '../../utils/navigationUtils'

const {height} = Dimensions.get('window')
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
        navigationUtils.doNavigation(this.props, 'realizePromotion');
    }

    back() {
        this.props.navigation.goBack();
    }

    showPromotionScaning() {
        navigationUtils.doNavigation(this.props, 'ReadQrCode');
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
        navigationUtils.doNavigation(this.props.navigation, 'businessFollow');
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

    resetMessage() {
        const {debug} = this.props;
        debug.resetMessag();
    }

    render() {
        const {businessActions, state, network} = this.props;
        let back = undefined;
        if (this.props.showBack) {
            back = <Button transparent style={{marginLeft: 5, marginRight: 5}} onPress={() => this.back()}>
                <Icon active color={"#2db6c8"} size={StyleUtils.scale(20)} name="ios-arrow-back"/>

            </Button>
        }
        let arrowName = I18nManager.isRTL ? "ios-arrow-forward" : "ios-arrow-back";
        if (state.searchType) {
            return (
                <View style={{ marginTop: StyleUtils.isIphoneX() ? 30: 0,justifyContent:'center',alignItems:'center',height: StyleUtils.scale(50),width: StyleUtils.getWidth(),backgroundColor:'white'}}>
                    {network.offline && <View style={{
                        width: StyleUtils.getWidth(),
                        height: StyleUtils.scale(20),
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: '#f4ce42'
                    }}>
                        <ThisText style={{color: 'gray'}}>{strings.Offline}</ThisText>
                    </View>}

                    <View style={{

                        height: StyleUtils.scale(20), flexDirection: 'row', alignItems: 'center', backgroundColor: 'white',
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

                                justifyContent: 'center',
                                marginLeft: StyleUtils.scale(10),
                                width: StyleUtils.scale(30)
                            }}>
                                <Icon active color={"#2db6c8"} size={StyleUtils.scale(25)} name={arrowName}/>
                            </View>

                        </TouchableOpacity>
                        <TextInput style={{
                            color: '#888888',
                            marginLeft: 10,
                            marginRight: StyleUtils.scale(40),
                            marginTop: 5,
                            fontSize: StyleUtils.scale(18),
                            width: StyleUtils.getWidth() - StyleUtils.scale(100),
                            height: StyleUtils.scale(40)
                        }}
                                   underlineColorAndroid='transparent'
                                   value={this.state.searchText}
                                   autoFocus={true}
                                   returnKeyType='search'
                                   onSubmitEditing={this.search.bind(this)}
                                   onChangeText={(searchText) => this.setState({searchText})}
                                   placeholder={state.searchPlaceHolder}
                        />
                        {state.searching && <Spinner style={{right: StyleUtils.scale(20), position: 'absolute'}}/>}

                    </View>
                </View>
            );
        }
        let menuAction = <Menu>
            <MenuTrigger>
                <Icon style={{fontSize: StyleUtils.scale(28), color: "#2db6c8"}} name="ios-search"/>
            </MenuTrigger>
            <MenuOptions>

                <MenuOption onSelect={this.searchBusiness.bind(this)}>
                    <ThisText style={{padding: 10, paddingBottom: 5}}>{strings.SearchBusiness}</ThisText>
                </MenuOption>
                <MenuOption onSelect={this.searchGroups.bind(this)}>
                    <ThisText style={{padding: 10, paddingTop: 5,}}>{strings.SearchGroups}</ThisText>
                </MenuOption>


            </MenuOptions>
        </Menu>
        return (
            <View style={{marginTop: StyleUtils.isIphoneX() ? 10: 0, width: StyleUtils.getWidth()}}>
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
                    height: StyleUtils.relativeHeight(9, 9),
                    flexDirection: 'row',
                    alignItems: 'center',
                    backgroundColor: 'white',
                    justifyContent: 'flex-start',
                }}>

                    {<View style={{flexDirection: 'row', alignItems: 'flex-start'}}>
                        {back}

                        <Button transparent style={{marginLeft: StyleUtils.scale(15), marginRight: StyleUtils.scale(5)}}
                                onPress={this.props.openDrawer}>
                            <Icon2 active color={"#2db6c8"} size={StyleUtils.scale(20)} name="menu"/>

                        </Button>

                    </View>
                    }

                    <ThisText transparent
                              style={{
                                  fontSize: StyleUtils.scale(20),
                                  marginLeft: StyleUtils.scale(15),
                                  color: "#2db6c8",
                                  backgroundColor: 'transparent'
                              }}>THIS</ThisText>
                    {<View style={{
                        flex: 1, flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center'
                    }}>

                        {menuAction}

                        <TouchableOpacity onPress={() => this.showPromotionScaning()}
                                          style={{
                                              marginRight: StyleUtils.scale(20),
                                              marginLeft: StyleUtils.scale(20),
                                              flexDirection: 'column',
                                              alignItems: 'center',
                                          }}
                                          regular>
                            <Image resizeMode="cover"
                                   style={{
                                       tintColor: '#2db6c8',
                                       marginTop: StyleUtils.scale(3),
                                       width: StyleUtils.scale(25),
                                       height: StyleUtils.scale(25)
                                   }}
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
        debug: bindActionCreators(debugAction, dispatch),
    })
)(GeneralComponentHeader);

