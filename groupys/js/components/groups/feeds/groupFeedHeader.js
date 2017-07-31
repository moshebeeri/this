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

import * as groupsAction from "../../../actions/groups";
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

    navigateBack(){
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

        }

        let groupInvite = undefined;
        if(this.isGroupAdmin(group)){
            groupInvite =   <View style={styles.invite_to_group}>
                <Button transparent  onPress={this.showUsers.bind(this)}>
                    <Icon style={{fontSize:35,color:"#2db6c8"}} name="person-add" />
                </Button>
            </View>
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
            {groupInvite}
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

