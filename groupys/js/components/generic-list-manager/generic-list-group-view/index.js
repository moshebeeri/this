import React, {Component} from 'react';
import {Image, Platform,TouchableNativeFeedback,TouchableHighlight,TouchableOpacity} from 'react-native';
import {connect} from 'react-redux';
import {actions} from 'react-native-navigation-redux-helpers';
import {Container, Content, Text,Title, InputGroup, Input, Button, Icon, View,Header, Body, Right, ListItem, Thumbnail,Left} from 'native-base';


import GroupApi from "../../../api/groups"
let groupApi = new GroupApi();

import stylesPortrate from './styles'
import stylesLandscape from './styles_landscape'
import StyleUtils from '../../../utils/styleUtils'
export default class GenericListGroupView extends Component {


    constructor(props) {
        super(props);

    }


     showGroupFeeds(props,group){
        groupApi.touch(group._id);
        this.props.navigation.navigate('GroupFeed',{group:group,role:this.props.item.role});
    }

    showUsers(show){
        let users = this.props.user.followers;
        if(users) {
            this.props.navigation.navigate('SelectUsersComponent', {
                users: users,
                selectUsers: this.selectUsers.bind(this)
            })
        }

    }

    render() {
        let styles = stylesPortrate
        if(StyleUtils.isLandscape()){
            alert('changeStyle')
            styles = stylesLandscape;
        }

        let row = undefined
        let image =  <Thumbnail large square   source={require('../../../../images/client_1.png')}/>
        let lastMessage = undefined;
        if(this.props.item.act && this.props.item.act.activity ){
            lastMessage =   <Text  style={styles.group_members}>{ this.props.item.act.activity.user.name} { this.props.item.act.activity.message}</Text>

        }
        let group = this.props.item.group;
        if(group.pictures && group.pictures.length > 0) {
            image =  <Thumbnail large square  source={{uri: group.pictures[0].pictures[3]}} />

        }else{
            if(group.entity && group.entity.business ){
                image =  <Thumbnail large square  source={{uri: group.entity.business.pictures[0].pictures[3]}} />


            }
        }



            row = <TouchableOpacity  onPress={this.showGroupFeeds.bind(this,this.props,group)}  >
                    <View style = {styles.group_container}>
                    <View style = {styles.group_description}>
                        <View style = {styles.group_image}>
                        {image}
                        </View>
                        <View style={styles.group_name}>
                        <Text style={styles.group_name_text}>{group.name}</Text>
                            {lastMessage}
                        </View>

                    </View>

                 </View>
                </TouchableOpacity>


        return ( row

        );
    }
}

