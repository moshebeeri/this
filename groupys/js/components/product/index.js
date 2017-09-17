import React, {Component} from 'react';
import {Image, Platform} from 'react-native';
import {connect} from 'react-redux';
import {actions} from 'react-native-navigation-redux-helpers';
import {Container, Content, Fab,Text,Title, InputGroup, Input, Button, View,Header, Body, Right, ListItem, Thumbnail,Left} from 'native-base';

import GenericListView from '../generic-list-manager/generic-list-view/index'

import GenericListManager from '../generic-list-manager/index'

import Icon from 'react-native-vector-icons/EvilIcons';

import * as businessAction from "../../actions/business";
import {getBusinessProducts} from '../../selectors/businessesSelector'
import { bindActionCreators } from "redux";
class Product extends Component {


    constructor(props) {
        super(props);
     }

    componentWillMount(){
         this.setBusinessProducts();
    }

    setBusinessProducts() {
        const {actions, navigation} = this.props;
        const business = navigation.state.params.business._id;

        actions.setBusinessProducts(business);
    }

    renderItem(item){
        const { navigation} = this.props;
        return <GenericListView
            item={item.item}
            index ={item.index}
            addform ={"AddProduct"}
            navigation={navigation}
        />



    }




    navigateToAdd(){

        this.props.navigation.navigate("AddProduct",{business:this.props.navigation.state.params.business});
    }
    render() {
        const { products,navigation,actions,update} = this.props;
        const business = navigation.state.params.business._id;



        return (
            <Container style={{flex:-1}}>
                <GenericListManager rows={products[business]} navigation = {navigation} actions={actions}  update={update}
                                    onEndReached={this.setBusinessProducts.bind(this)} ItemDetail = {this.renderItem.bind(this)}/>
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
        products: getBusinessProducts(state),
        update:state.businesses.update

    }),

    (dispatch) => ({
        actions: bindActionCreators(businessAction, dispatch),

    })
)(Product);
