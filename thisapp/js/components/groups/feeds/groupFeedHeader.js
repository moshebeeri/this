/**
 * Created by roilandshut on 19/07/2017.
 */
import React, {Component} from 'react';
import {Dimensions, I18nManager, Image, Platform, TouchableOpacity, View} from 'react-native';
import {connect} from 'react-redux';
import {actions} from 'react-native-navigation-redux-helpers';
import {Button, Container, Footer, Thumbnail} from 'native-base';
import styles from './styles'
import store from 'react-native-simple-store';
import GroupApi from "../../../api/groups"
import {GroupHeader, ThisText} from '../../../ui/index';
import {Menu, MenuOption, MenuOptions, MenuTrigger,} from 'react-native-popup-menu';
import * as groupsAction from "../../../actions/groups";
import * as instanceGroupCommentsAction from "../../../actions/instanceGroupComments"
import Icon2 from 'react-native-vector-icons/SimpleLineIcons';
import Icon from 'react-native-vector-icons/Ionicons';
import StyleUtils from '../../../utils/styleUtils'
import {bindActionCreators} from "redux";
import strings from "../../../i18n/i18n"
import navigationUtils from '../../../utils/navigationUtils'

const {height} = Dimensions.get('window');
const vh = height / 100
const qrcode = require('../../../../images/qr-code.png');
let groupApi = new GroupApi();

class GroupFeedHeader extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    async componentWillMount() {
        let userId = await store.get('user_id');
        this.setState({
            userId: userId
        })
    }

    handleBack() {
        // this.props.actions.fetchGroups();
    }

    showScanner() {
        let group = this.props.item;
        navigationUtils.doNavigation(this.props.navigation, 'ReadQrCode', {group: group});
    }

    navigateBack() {
        this.handleBack();
        this.props.navigation.goBack();
    }

    showUsers() {
        let users = this.getFollowerUsers();
        if (users) {
            navigationUtils.doNavigation(this.props.navigation, 'SelectUsersComponent', {
                users: users,
                selectUsers: this.inviteUser.bind(this)
            });
        }
    }

    getFollowerUsers() {
        let group = this.props.item;
        let users = this.props.groupsFollowers[group._id];
        if (!users) {
            return [];
        }
        return users;
    }

    followBusiness() {
        let group = this.props.item;
        navigationUtils.doNavigation(this.props.navigation, "businessFollow", {
            business: group.entity.business,
            group: group
        });
    }

    addPromotion() {
        let group = this.props.item;
        navigationUtils.doNavigation(this.props.navigation, "addPromotions", {
            business: group.entity.business,
            group: group
        });
    }

    updateGroup() {
        let group = this.props.item;
        navigationUtils.doNavigation(this.props.navigation, "AddGroups", {group: group});
    }

    followBusiness() {
        let group = this.props.item;
        navigationUtils.doNavigation(this.props.navigation, "businessFollow", {group: group});
    }

    viewGroup() {
        let group = this.props.item;
        navigationUtils.doNavigation(this.props.navigation, "AddGroups", {group: group, view: true});
    }

    inviteUser(users) {
        const {actions} = this.props;
        if (users) {
            let groupId = this.props.item._id;
            users.forEach(function (user) {
                actions.inviteUser(user._id, groupId);
            });
        }
    }

    isGroupAdmin(group) {
        if (!group.admins) {
            return false;
        }
        if (group.admins.length === 0) {
            return false;
        }
        let userId = this.state.userId;
        let isGroupAdmin = false;
        if (Array.isArray(group.admins)) {
            group.admins.forEach(function (adminId) {
                if (userId === adminId) {
                    isGroupAdmin = true;
                }
            });
        } else {
            Object.keys(group.admins).forEach(key => {
                if (userId === group.admins[key]) {
                    isGroupAdmin = true;
                }
            });
        }
        return isGroupAdmin;
    }

    render() {
        let headerHeight = {
            flexDirection: 'row',
            width: StyleUtils.getWidth(),
            height: vh * 10,
            backgroundColor: '#fff',
            justifyContent: 'center',
            alignItems: 'center'
        };
        if (Platform.OS === 'ios') {
            headerHeight = {
                flexDirection: 'row',
                width: StyleUtils.getWidth(),
                height: vh * 13,
                backgroundColor: '#fff',
                justifyContent: 'center',
                alignItems: 'center'
            };
        }
        let group = this.props.item;
        let groupInvite = undefined;
        let addPromotionMenu = undefined;
        if (group.role && (group.role === "owner" || group.role === "OWNS" || group.role === "Admin" || group.role === "Manager"  )) {
            addPromotionMenu = <MenuOption onSelect={this.addPromotion.bind(this)}>
                <ThisText style={{padding: 10, paddingBottom: 5}}>{strings.AddPromotion}</ThisText>
            </MenuOption>
        }
        let arrowName = I18nManager.isRTL ? "ios-arrow-forward" : "ios-arrow-back";
        if (this.isGroupAdmin(group)) {
            groupInvite = <Menu>
                <MenuTrigger customStyles={{alignItems: 'center', justifyContent: 'center'}}>
                    <Icon2 style={{paddingRight:I18nManager.isRTL ? 0: 10,paddingLeft:I18nManager.isRTL ? 10: 0,fontSize: StyleUtils.scale(25), color: "#2db6c8"}} name="options-vertical"/>
                </MenuTrigger>
                <MenuOptions customStyles={{optionsContainer: {marginLeft: I18nManager.isRTL ? StyleUtils.scale(150) : 0}}}>

                    <MenuOption onSelect={this.updateGroup.bind(this)}>
                        <ThisText style={{padding: 10, paddingBottom: 5}}>{strings.Edit}</ThisText>
                    </MenuOption>

                    {this.getFollowerUsers().length > 0 && <MenuOption onSelect={this.showUsers.bind(this)}>
                        <ThisText style={{padding: 10, paddingBottom: 5}}>{strings.Invite}</ThisText>
                    </MenuOption>}
                    <MenuOption onSelect={this.followBusiness.bind(this)}>
                        <ThisText style={{padding: 10, paddingBottom: 5}}>{strings.FollowBusiness}</ThisText>
                    </MenuOption>
                    {addPromotionMenu}
                </MenuOptions>
            </Menu>
        }
        return <View style={headerHeight}>
            <View style={styles.imageStyle}>
                <Button style={{width: StyleUtils.scale(30), alignItems: 'center', justifyContent: 'center'}}
                        transparent
                        onPress={this.navigateBack.bind(this)}>
                    <Icon style={{
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: StyleUtils.scale(20),
                        color: "#2db6c8"
                    }}
                          name={arrowName}/>
                </Button>
            </View>
            <View style={{flex: 10}}>
                <GroupHeader onPressAction={this.viewGroup.bind(this)} enablePress noColor group={group}/>
            </View>
            <View style={styles.group_actions}>
                <TouchableOpacity onPress={() => this.showScanner()}
                                  style={{
                                      width: StyleUtils.scale(30), height: StyleUtils.scale(30),
                                      flexDirection: 'column',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                  }}
                                  regular>
                    <Image resizeMode="cover" style={{
                        tintColor: '#2db6c8',
                        marginTop: 3,
                        width: StyleUtils.scale(25),
                        height: StyleUtils.scale(25)
                    }}
                           source={qrcode}/>

                </TouchableOpacity>
                {groupInvite}
            </View>
        </View>
    }
}

export default connect(
    state => ({
        businesses: state.businesses,
        user: state.user,
        groupsFollowers: state.groups.groupFollowers
    }),
    (dispatch) => ({
        actions: bindActionCreators(groupsAction, dispatch),
        instanceGroupCommentsAction: bindActionCreators(instanceGroupCommentsAction, dispatch),
    })
)(GroupFeedHeader);

