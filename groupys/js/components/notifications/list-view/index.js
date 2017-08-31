import React, {Component} from 'react';
import {Image, Platform,TouchableOpacity,Dimensions} from 'react-native';
import {Container, Content, Text,Title, InputGroup, Input, Button, View,Header, Body, Right, ListItem,Card,CardItem, Thumbnail,Left} from 'native-base';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon2 from 'react-native-vector-icons/MaterialIcons';
const covefr = require('../../../../images/cover2.png');
import styles from './styles'
const {width, height} = Dimensions.get('window')
const   vw = width/100;
const  vh = height/100
import NotoficationApi from '../../../api/notification'
let notoficationApi = new NotoficationApi();
import {connect} from 'react-redux';
import Popup from 'react-native-popup';
import * as notificationAction from "../../../actions/notifications";

import { bindActionCreators } from "redux";

 class NotificationListView extends Component {


    constructor(props) {
        super(props);

    }





    async accept(){

        await notoficationApi.acceptInvatation(this.props.item.group);
        await notoficationApi.doNotificationAction(this.props.item._id)
        this.props.fetchNotification();
        this.props.fetchGroups();
    }


    read(notification_id){
        if(!this.props.item.read) {
            notoficationApi.readNotification(notification_id)
            this.props.item.read = true;
            this.props.fetchNotification();
        }
    }

    createView(){

        if(this.props.item.note =="ask_invite") {
            let group = this.props.item.group;
            let user = this.props.item.actor_user;
            let image =  <Thumbnail     source={require('../../../../images/client_1.png')}/>

            if(group.pictures && group.pictures.length > 0) {
                image =  <Thumbnail    source={{uri: group.pictures[0].pictures[3]}} />

            }else{
                if(group.entity && group.entity.business ){
                    image =  <Thumbnail    source={{uri: group.entity.business.pictures[0].pictures[3]}} />


                }
            }

            let reddemStyle ={
                flex:-1,justifyContent:'center',marginLeft:width/4 ,borderWidth:1,flexDirection: 'row',height: 40,width:width/2,backgroundColor:'white', borderColor: '#e65100',
            };

            let backgroundColor = '#fef8e0'
            let actionStyle = { backgroundColor:'#fef8e0',
                width: width,
                height: 50,
                justifyContent: 'center',
                alignItems: 'center',
                flex:-1,
            }

            if(this.props.item.read){
                backgroundColor = 'white';
                actionStyle = { backgroundColor:'white',
                    width: width,
                    height:  vh*9,
                    justifyContent: 'center',
                    alignItems: 'center',
                    flex:-1,
                }
            }

            let action =  <View style={actionStyle}>

                <Button  style={reddemStyle} onPress={this.accept.bind(this)}>


                    <Text style={{fontWeight:'bold',color:'#e65100'}}>Accept</Text>


                </Button>
            </View>

            if(this.props.item.action){
                action = undefined;
            }


            let nameWidth = this.props.item.group.name.length * 10;

            return (
                <View     style={{padding: 5, backgroundColor: '#eaeaea'}} regular>

                    <TouchableOpacity onPress={() => this.read(this.props.item._id)}  style={{
                        flex: -1,

                        backgroundColor:backgroundColor,
                        flexDirection: 'row',

                        alignItems: 'center',
                    }}>

                        {image}

                        <View style={{flexDirection: 'column',width:width - 50,height: vh*10 }}>
                            <View style={{flexDirection: 'row'}}>
                                <Text style={{fontWeight:'bold',marginLeft:vw*4 }}>{user.name}</Text>
                                <Text style={{height: vh*4 }}> invites you to join group </Text>
                            </View>
                            <Text style={{marginLeft:vw*3,fontWeight:'bold',height:vh*5,width:nameWidth }}> {this.props.item.group.name} </Text>


                        </View>


                    </TouchableOpacity>

                    {action}

                </View>


            );
        }

        return <View><Text>new notification with code: {this.props.item.id} And note:{this.props.item.note} </Text></View>



    }
    render() {
        return this.createView();

    }



}

export default connect(
    state => ({
        notification: state.notification
    }),

    dispatch => bindActionCreators(notificationAction, dispatch)
)(NotificationListView);

