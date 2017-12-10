/**
 * Created by roilandshut on 19/07/2017.
 */
import React, {Component} from 'react';
import {Image, TextInput, Platform, View,TouchableOpacity,Dimensions,I18nManager} from 'react-native';
import {connect} from 'react-redux';
import {actions} from 'react-native-navigation-redux-helpers';
import {Container, Footer, Button, Thumbnail, Text} from 'native-base';
import styles from './styles'
import store from 'react-native-simple-store';
import GroupApi from "../../../api/groups"
import {GroupHeader, PromotionHeaderSnippet} from '../../../ui/index';
const {width, height} = Dimensions.get('window')
const vh = height / 100
const qrcode = require('../../../../images/qr-code.png');
let groupApi = new GroupApi();
import {
    Menu,
    MenuOptions,
    MenuOption,
    MenuTrigger,
} from 'react-native-popup-menu';
import * as groupsAction from "../../../actions/groups";
import Icon2 from 'react-native-vector-icons/SimpleLineIcons';
import Icon from 'react-native-vector-icons/Ionicons';

import {bindActionCreators} from "redux";
import strings from "../../../i18n/i18n"

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
        this.props.fetchGroups();
    }

    showScanner() {
        let group = this.props.item;
        this.props.navigation.navigate('ReadQrCode',{group:group});
    }
    navigateBack() {
        this.handleBack();
        this.props.navigation.goBack();
    }

    showUsers() {
        let users = this.props.user.followers;
        if (users) {
            this.props.navigation.navigate('SelectUsersComponent', {
                users: users,
                selectUsers: this.inviteUser.bind(this)
            })
        }
    }

    followBusiness() {
        let group = this.props.item;
        this.props.navigation.navigate("businessFollow", {business: group.entity.business, group: group});
    }

    addPromotion() {
        let group = this.props.item;
        this.props.navigation.navigate("addPromotions", {business: group.entity.business, group: group});
    }

    inviteUser(users) {
        if (users) {
            let groupId = this.props.item._id;
            users.forEach(function (user) {
                groupApi.inviteUser(user._id, groupId);
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
        if(Array.isArray(group.admins)) {
            group.admins.forEach(function (adminId) {
                if (userId === adminId) {
                    isGroupAdmin = true;
                }
            });
        }else{
            Object.keys(group.admins).forEach(key => {
                if (userId === group.admins[key]) {
                    isGroupAdmin = true;
                }
            });
        }
        return isGroupAdmin;
    }

    render() {
        let headerHeight = {   flexDirection: 'row',
            width: width,
            height: vh * 10,
            backgroundColor: '#fff',
            justifyContent:'center',
            alignItems:'center'};

        if (Platform.OS === 'ios') {
            headerHeight = {   flexDirection: 'row',
                width: width,
                height: vh * 13,
                backgroundColor: '#fff',
                justifyContent:'center',
                alignItems:'center'};
        }
        let group = this.props.item;
        let image = <Thumbnail square source={require('../../../../images/client_1.png')}/>
        if (this.props.item.pictures && this.props.item.pictures.length > 0) {
            image = <Thumbnail square source={{uri: this.props.item.pictures[0].pictures[3]}}/>
        } else {
            if (group.entity && group.entity.business &&  group.entity.business.pictures) {
                image = <Thumbnail square source={{uri: group.entity.business.pictures[0].pictures[3]}}/>
            }
        }
        let groupInvite = undefined;
        let addPromotionMenu = undefined;
        if (group.role && (group.role === "owner" || group.role === "OWNS" || group.role === "Admin" || group.role === "Manager"  )) {
            addPromotionMenu = <MenuOption onSelect={this.addPromotion.bind(this)}>
                <Text>{strings.AddPromotion}</Text>
            </MenuOption>
        }

        let arrowName = I18nManager.isRTL ? "ios-arrow-forward" : "ios-arrow-back";

        if (this.isGroupAdmin(group)) {
            groupInvite = <Menu>
                <MenuTrigger customStyles={{alignItems:'center',justifyContent:'center'}}>
                    <Icon2 style={{fontSize: 25, color: "#2db6c8"}} name="options-vertical"/>
                </MenuTrigger>
                <MenuOptions>
                    <MenuOption onSelect={this.showUsers.bind(this)}>
                        <Text>{strings.Invite}</Text>
                    </MenuOption>
                    <MenuOption onSelect={this.followBusiness.bind(this)}>
                        <Text>{strings.FollowBusiness}</Text>
                    </MenuOption>
                    {addPromotionMenu}
                </MenuOptions>
            </Menu>
        }
        return <View style={headerHeight}>
            <View style={styles.imageStyle}>
                <Button style={{width:30,alignItems:'center',justifyContent:'center'}} transparent onPress={this.navigateBack.bind(this)}>
                    <Icon style={{alignItems:'center',justifyContent:'center',fontSize: 20, color: "#2db6c8"}} name={arrowName}/>
                </Button>
            </View>
            <View style={{flex:10}}>
           <GroupHeader noColor group={group}/>
            </View>
            <View style={styles.group_actions}>
                <TouchableOpacity onPress={() => this.showScanner()}
                                  style={{
                                      width: 30, height: 30,
                                      flexDirection: 'column',
                                      alignItems: 'center',
                                      justifyContent:'center',

                                  }}
                                  regular>
                    <Image resizeMode="cover" style={{ tintColor: '#2db6c8', marginTop:3,width: 25, height: 25}}
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
    }),
    dispatch => bindActionCreators(groupsAction, dispatch)
)(GroupFeedHeader);

