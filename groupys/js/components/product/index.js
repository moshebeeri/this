import React, {Component} from 'react';
import {Image, Platform} from 'react-native';
import {connect} from 'react-redux';
import {actions} from 'react-native-navigation-redux-helpers';
import {Container, Content, Text,Title, InputGroup, Input, Button, Icon, View,Header, Body, Right, ListItem, Thumbnail,Left} from 'native-base';

import GenericListView from '../generic-list-manager/generic-list-view/index'

import GenericListManager from '../generic-list-manager/index'



import * as productsAction from "../../actions/product";

import { bindActionCreators } from "redux";
class Product extends Component {


    constructor(props) {
        super(props);


    }


    fetchApi(pageOffset,pageSize ) {
        let fetchProducts = this.props.api.props.fetchProducts.bind(this);

        return new Promise(async function(resolve, reject) {
            let response =  await  fetchProducts();
            resolve(response);
        });


    }

    render() {


        return (
           <GenericListManager rows={this.props.products.products} title="Products" component="home" addComponent="AddProduct" api={this}
                               ItemDetail = {GenericListView}/>
        );
    }
}

export default connect(
    state => ({
        products: state.products
    }),

    dispatch => bindActionCreators(productsAction, dispatch)
)(Product);
