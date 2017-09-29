
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Platform,Provider
} from 'react-native'
import {Container, Content, Text, InputGroup, Input, Button,Body,Fab ,Icon,Left,
    View,Header,Item,Footer,Picker,ListItem,Right,Thumbnail} from 'native-base';


import { bindActionCreators } from "redux";

import * as promotionsAction from "../../../../actions/promotions";

 class SelectProductsComponent extends Component {


    constructor(props) {
        super(props);

        this.state = {

            productList:props.products,

        };
    }
    navigateToAdd(){

        this.props.navigation.navigate("AddProduct",{business:{_id:this.props.navigation.state.params.businessId}});
    }

    selectProduct(product){
        this.props.navigation.state.params.selectProduct(product)
        this.props.navigation.goBack();
    }


    render() {
        let index = 0;
        let productsRows = undefined
        let products=undefined;
        if(this.props.products) {
            products = this.props.products['products' + this.props.navigation.state.params.businessId];
        }

        if(products && products.length > 0) {

            productsRows =  products.map((r, i) => {
                index++;

                if (r.pictures.length > 0) {
                    return <ListItem key={index} thumbnail>
                        <Left>

                            <Thumbnail square size={80} source={{uri: r.pictures[0].pictures[3]}}/>
                        </Left>
                        <Body>
                        <Text>{r.name}</Text>
                        <Text note>{r.info}</Text>
                        </Body>
                        <Right>

                            <Button transparent
                                    onPress={() => this.selectProduct(r)}
                            >
                                <Text>Select</Text>
                            </Button>
                        </Right>
                    </ListItem>
                }
                return <ListItem key={index} thumbnail style={{backgroundColor: '#fff'}}>
                    <Left>
                        <Thumbnail square size={80} source={require('../../../../../images/client_1.png')}/>
                    </Left>
                    <Body>

                    <Text>{r.name}</Text>
                    <Text note>{r.info}</Text>
                    </Body>
                    <Right>
                        <Button transparent
                                onPress={() => this.selectProduct(r)}
                        >
                            <Text>Select</Text>
                        </Button>
                    </Right>
                </ListItem>
            });
        }
        return (

            <Container>
              <Content  style={{  backgroundColor: '#fff'}}>




                  { productsRows }

              </Content>
                <Fab

                    direction="right"
                    active={false}
                    containerStyle={{ marginLeft: 10 }}
                    style={{ backgroundColor: "#ff6400" }}
                    position="bottomRight"
                    onPress={() => this.navigateToAdd()}>
                    <Icon size={20} name="ios-add" />

                </Fab>
            </Container>


        );
  }
}

export default connect(
    state => ({
        promotions: state.promotions,
        products: state.products,

    }),

    dispatch => bindActionCreators(promotionsAction, dispatch)
)(SelectProductsComponent);