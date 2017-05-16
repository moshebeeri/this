import React, {Component} from 'react';
import {Image, Platform} from 'react-native';
import {connect} from 'react-redux';
import {actions} from 'react-native-navigation-redux-helpers';
import {Container, Content, Text,Title, InputGroup, Input, Button, Icon, View,Header, Body, Right, ListItem, Thumbnail,Left} from 'native-base';

import GenericListGroupView from '../generic-list-manager/generic-list-group-view/index'
import GenericListView from '../generic-list-manager/generic-list-view/index'

import GenericListManager from '../generic-list-manager/index'

const {
    replaceAt,
} = actions;
import GroupApi from "../../api/groups"
let groupApi = new GroupApi();

export default class Group extends Component {


    constructor(props) {
        super(props);


    }

    async getAll(){
        let response =  await  groupApi.getAll();
        return response;
    }
    fetchApi(pageOffset,pageSize ) {

        return new Promise(async function(resolve, reject) {
            response =  await  groupApi.getAll();
            resolve(response);
        });


    }

    render() {


        return (
           <GenericListManager title="Groups" component="home" addComponent="AddGroups" api={this}
                               ItemDetail = {GenericListView}/>
        );
    }
}



