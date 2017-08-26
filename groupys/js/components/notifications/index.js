import React, {Component} from 'react';
import {Image, Platform} from 'react-native';
import {connect} from 'react-redux';
import {actions} from 'react-native-navigation-redux-helpers';
import {Container, Content, Fab,Text,Title, InputGroup, Input, Button, View,Header, Body, Right, ListItem, Thumbnail,Left} from 'native-base';

import NotificationListView from './list-view/index'

import GenericListManager from '../generic-list-manager/index'


import * as notificationAction from "../../actions/notifications";

import { bindActionCreators } from "redux";
class Notification extends Component {


    constructor(props) {
        super(props);


    }


    fetchApi(pageOffset,pageSize ) {

        let fetchNotification = this.props.api.props.fetchNotification.bind(this);


        return new Promise(async function(resolve, reject) {
            let response =  await  fetchNotification();
            resolve(response);
        });
    }


    render() {
        let notification = undefined;
        if(this.props.notification) {
            notification = this.props.notification.notification;
        }

        return (
          <GenericListManager navigation ={this.props.navigation} rows={notification} title="Products" component="home" addComponent="AddProduct" api={this}
                                   ItemDetail = {NotificationListView}/>


        );
    }
}

export default connect(
    state => ({
        notification: state.notification
    }),

    dispatch => bindActionCreators(notificationAction, dispatch)
)(Notification);
