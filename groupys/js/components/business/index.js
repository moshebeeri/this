import React, {Component} from 'react';
import {Image, Platform} from 'react-native';
import {connect} from 'react-redux';
import {actions} from 'react-native-navigation-redux-helpers';
import {Container, Content, Text, InputGroup, Input, Button, Icon, View,Header, Body, Right, ListItem, Thumbnail,Left} from 'native-base';

import GenericListManager from '../generic-list-manager/index';

import BusinessListView from './business-list-view/index'

import * as businessAction from "../../actions/business";
import { bindActionCreators } from "redux";

 class Business extends Component {



    constructor(props) {
        super(props);
        this.props.fetchBusinessCategories('root');

        this.state = {
            refresh: '',
        }




    }


    async getAll(){
       return  this.props.fetchBusiness();
    }
    async fetchApi(pageOffset,pageSize ) {
        let businesses = this.props.api.props.fetchBusiness.bind(this);


        return new Promise(async function(resolve, reject) {
            let response =  await  businesses();
            resolve(response);
        });


    }

    async componentWillMount(){
        this.props.navigateAction('addBusiness',this.props.index)

    }

    render() {


        return (
            <GenericListManager navigation = {this.props.navigation} rows={this.props.businesses.businesses} title="Business" component="home" addComponent="addBusiness" api={this}
                                ItemDetail={BusinessListView}/>
        );
    }
}

export default connect(
    state => ({
        businesses: state.businesses
    }),
    dispatch => bindActionCreators(businessAction, dispatch)
)(Business);
