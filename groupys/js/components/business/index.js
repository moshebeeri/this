import React, {Component} from 'react';
import {Image, Platform} from 'react-native';
import {connect} from 'react-redux';
import {actions} from 'react-native-navigation-redux-helpers';
import {Container, Content, Text, InputGroup, Input, Button, Icon, View,Header, Body, Right, ListItem, Thumbnail,Left} from 'native-base';

import GenericListManager from '../generic-list-manager/index';

import GenericListView from '../generic-list-manager/generic-list-view/index'

import * as businessAction from "../../actions/business";
import { bindActionCreators } from "redux";

 class Business extends Component {



    constructor(props) {
        super(props);
        this.state = {
            refresh: '',
        }




    }


    async getAll(){
       return this.props.businesses.businesses;
    }
    fetchApi(pageOffset,pageSize ) {
        let businesses = this.props.api.props.businesses.businesses;
        return new Promise(async function(resolve, reject) {
            resolve(businesses);
        });


    }

    async componentWillMount(){
        this.props.navigateAction('add-business',this.props.index)

    }

    render() {


        return (
            <GenericListManager navigation = {this.props.navigation} rows={this.props.businesses.businesses} title="Business" component="home" addComponent="addBusiness" api={this}
                                ItemDetail={GenericListView}/>
        );
    }
}

export default connect(
    state => ({
        businesses: state.businesses
    }),
    dispatch => bindActionCreators(businessAction, dispatch)
)(Business);
