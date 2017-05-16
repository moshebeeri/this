import React, {Component} from 'react';
import {Image, Platform} from 'react-native';
import {connect} from 'react-redux';
import {actions} from 'react-native-navigation-redux-helpers';
import {Container, Content, Text,Title, InputGroup, Input, Button, Icon, View,Header, Body, Right, ListItem, Thumbnail,Left} from 'native-base';

import GenericListView from '../generic-list-manager/generic-list-view/index'

import GenericListManager from '../generic-list-manager/index'


import ProductApi from "../../api/product"
let productApi = new ProductApi();

export default class Product extends Component {


    constructor(props) {
        super(props);


    }

    async getAll(){
        let response =  await  productApi.getAll();
        return response;
    }
    fetchApi(pageOffset,pageSize ) {

        return new Promise(async function(resolve, reject) {
            response =  await  productApi.getAll();
            resolve(response);
        });


    }

    render() {


        return (
           <GenericListManager title="Products" component="home" addComponent="AddProduct" api={this}
                               ItemDetail = {GenericListView}/>
        );
    }
}
