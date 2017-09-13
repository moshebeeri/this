 import React, {Component} from 'react';
import {Image, Platform} from 'react-native';
import {connect} from 'react-redux';
import {actions} from 'react-native-navigation-redux-helpers';
import {Container, Content, Text,Title, InputGroup, Input, Button, Icon, View,Header, Body, Right, ListItem, Thumbnail,Left} from 'native-base';

import GenericListGroupView from '../generic-list-manager/generic-list-group-view/index'

import GenericListManager from '../generic-list-manager/index'


import {getGroups} from '../../selectors/groupSelector'
import * as groupsAction from "../../actions/groups";
import { bindActionCreators } from "redux";

 class Group extends Component {


    constructor(props) {
        super(props);

    }
     onPressItem(item){
         const {actions,navigation} = this.props;
         actions.touch(item._id);
         navigation.navigate('GroupFeed',{group:item,role:'admin'});
     }



    renderItem(item){
       return <GenericListGroupView
            onPressItem={this.onPressItem.bind(this,item.item)}
            item={item.item}
            index = {item.index}
            key={item.index}
        />

    }
    componentWillMount(){
        this.props.actions.fetchGroups();
    }
    render() {
        const { update,groups,navigation,actions} = this.props;


        return (
           <GenericListManager rows={groups} navigation = {navigation} actions={actions}  update={update}
                               ItemDetail = {this.renderItem.bind(this)}/>
        );
    }


}


export default connect(
    state => ({
        groups: getGroups(state),
        update: state.groups.update
    }),
    (dispatch) => ({
        actions: bindActionCreators(groupsAction, dispatch),
    })
)(Group);



