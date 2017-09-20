/**
 * Created by roilandshut on 19/07/2017.
 */
import React, { Component } from 'react';
import { Image,TextInput, Platform,View} from 'react-native';

import { connect } from 'react-redux';
import { actions } from 'react-native-navigation-redux-helpers';
import { Container,Footer,Icon,Button,Thumbnail,Text } from 'native-base';
import styles from './styles'

import store from 'react-native-simple-store';

import GroupApi from "../../../api/groups"
let groupApi = new GroupApi();
import {
    Menu,
    MenuOptions,
    MenuOption,
    MenuTrigger,
} from 'react-native-popup-menu';
import * as groupsAction from "../../../actions/groups";
import Icon2 from 'react-native-vector-icons/SimpleLineIcons';
import { bindActionCreators } from "redux";

 class GroupFeedHeader extends Component {

     constructor(props) {
         super(props);
         this.state = {}
     }
    async componentWillMount(){
        let userId = await store.get('user_id');
        this.setState({
            userId:userId
        })
    }
     handleBack() {
        this.props.fetchGroups();
     }

    navigateBack(){
        this.handleBack();
        this.props.navigation.goBack();
    }
    showUsers(){
        let users = this.props.user.followers;
        if(users) {
            this.props.navigation.navigate('SelectUsersComponent', {
                users: users,
                selectUsers: this.inviteUser.bind(this)
            })
        }

    }

    followBusiness(){
        let group = this.props.item;

        this.props.navigation.navigate("businessFollow",{business:group.entity.business,group:group});

    }



    addPromotion(){
             let group = this.props.item;

            this.props.navigation.navigate("addPromotions",{business:group.entity.business,group:group});

    }

    inviteUser(users){
        if(users){
            let groupId = this.props.item._id;

            users.forEach(function(user) {
                groupApi.inviteUser(user._id,groupId);
            });
        }
    }

    isGroupAdmin(group){
        if(!group.admins){
            return false;
        }
        if(group.admins.length == 0){
            return false;
        }
        let userId = this.state.userId;
        let isGroupAdmin = false;

        group.admins.forEach(function(adminId) {
            if(userId == adminId){
                isGroupAdmin = true;
            }

        });

        return isGroupAdmin;

    }


    render() {
        let group = this.props.item;
        let image =  <Thumbnail  square   source={require('../../../../images/client_1.png')}/>
        if(this.props.item.pictures && this.props.item.pictures.length > 0) {
            image =  <Thumbnail  square  source={{uri: this.props.item.pictures[0].pictures[3]}} />

        }else{
            if(group.entity && group.entity.business ){
                image =  <Thumbnail  square  source={{uri: group.entity.business.pictures[0].pictures[3]}} />


            }
        }

        let groupInvite = undefined;
        let addPromotionMenu = undefined;
        if(group.role  &&(group.role == "owner" || group.role == "OWNS"||group.role == "Admin" || group.role == "Manager"  )){

            addPromotionMenu =  <MenuOption onSelect={this.addPromotion.bind(this)}>
                <Text>Add Promotion</Text>
            </MenuOption>
        }
        if(this.isGroupAdmin(group)) {

            groupInvite = <Menu>
                <MenuTrigger >
                    <Icon2 style={{fontSize: 25, color: "#2db6c8"}} name="options-vertical"/>
                </MenuTrigger>
                <MenuOptions>
                    <MenuOption onSelect={this.showUsers.bind(this)}>
                        <Text>Invite</Text>
                    </MenuOption>
                    <MenuOption onSelect={this.followBusiness.bind(this)}>
                        <Text>Follow Business</Text>
                    </MenuOption>
                    {addPromotionMenu}
                </MenuOptions>
            </Menu>
        }


        return <View style={styles.headerContainer}>
            <View style={styles.imageStyle}>
            <Button transparent  onPress={this.navigateBack.bind(this)}>
                <Icon style={{fontSize:35,color:"#2db6c8"}} name="arrow-back" />
            </Button>
            </View>
            <View style={styles.imageStyle}>
            {image}
            </View>
            <View style={styles.group_title}>
                <Text style={styles.group_name_text}>{group.name}</Text>
                <Text  style={styles.group_members}>{group.description}</Text>
            </View>
            <View style={styles.group_actions}>
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

