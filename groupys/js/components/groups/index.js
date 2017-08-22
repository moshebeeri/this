 import React, {Component} from 'react';
import {Image, Platform} from 'react-native';
import {connect} from 'react-redux';
import {actions} from 'react-native-navigation-redux-helpers';
import {Container, Content, Text,Title, InputGroup, Input, Button, Icon, View,Header, Body, Right, ListItem, Thumbnail,Left} from 'native-base';

import GenericListGroupView from '../generic-list-manager/generic-list-group-view/index'

import GenericListManager from '../generic-list-manager/index'



import * as groupsAction from "../../actions/groups";
import { bindActionCreators } from "redux";

 class Group extends Component {


    constructor(props) {
        super(props);
        this.props.fetchUsersFollowers();
        this.props.fetchGroupsFromStore();
        console.log('renderrrr')
    }


    fetchApi(pageOffset,pageSize ) {

        let fetchGroups = this.props.api.props.fetchGroups.bind(this);

        return new Promise(async function(resolve, reject) {
            let response =  await  fetchGroups();
            resolve(response);
        });


    }

    componentWillMount(){
        this.props.fetchGroups();
    }
    render() {
        console.log('renderrrr')

        return (
           <GenericListManager rows={this.props.groups.groups} navigation = {this.props.navigation} title="Groups" component="home" addComponent="AddGroups" api={this}
                               ItemDetail = {GenericListGroupView}/>
        );
    }

    componentDidMount(){
        console.log('didmount')
    }
}


export default connect(
    state => ({
        groups: state.groups
    }),

    dispatch => bindActionCreators(groupsAction, dispatch)
)(Group);



