import React, {Component} from 'react';
import {Image, Platform} from 'react-native';
import {connect} from 'react-redux';
import {actions} from 'react-native-navigation-redux-helpers';
import {Container, Content, Fab,Text,Title, InputGroup, Input, Button, View,Header, Body, Right, ListItem, Thumbnail,Left} from 'native-base';

import GenericListView from '../generic-list-manager/generic-list-view/index'

import GenericListManager from '../generic-list-manager/index'

import Icon from 'react-native-vector-icons/EvilIcons';

import * as productsAction from "../../actions/product";

import { bindActionCreators } from "redux";
class Product extends Component {


    constructor(props) {
        super(props);
        let id = this.props.navigation.state.params.business._id;
        this.props.fetchFromStoreProductsByBusiness(id);
    }


    fetchApi(pageOffset,pageSize ) {
        let id = this.props.api.props.navigation.state.params.business._id;

        this.props.api.props.fetchProductsByBusiness(id);

        let response = this.props.api.props.products['products' + id];

        return new Promise(async function(resolve, reject) {
            resolve(response);
        });
    }

    navigateToAdd(){

        this.props.navigation.navigate("AddProduct",{business:this.props.navigation.state.params.business});
    }
    render() {
        let businessId = this.props.navigation.state.params.business._id;
        let products = undefined;
        if(this.props.products) {
             products = this.props.products['products' + businessId];
        }

        return (
            <Container style={{flex:-1}}>
           <GenericListManager navigation ={this.props.navigation} rows={products} title="Products" component="home" addComponent="AddProduct" api={this}
                                   ItemDetail = {GenericListView}/>
               <Fab

                    direction="right"
                    active={false}
                    containerStyle={{ marginLeft: 10 }}
                    style={{ backgroundColor: "#ff6400" }}
                    position="bottomRight"
                    onPress={() => this.navigateToAdd()}>
                   <Icon size={20} name="plus" />

                </Fab>
            </Container>
        );
    }
}

export default connect(
    state => ({
        products: state.products
    }),

    dispatch => bindActionCreators(productsAction, dispatch)
)(Product);
