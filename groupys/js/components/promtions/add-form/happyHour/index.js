import React, {Component} from 'react';
import {connect} from 'react-redux';
import {
    Platform, TextInput
} from 'react-native'
import {
    Container, Content, Text, InputGroup, Input, Button, Body, Icon, Left,
    View, Header, Item, Footer, Picker, ListItem, Right, Thumbnail
} from 'native-base';

export default class HappyHourComponent extends Component {
    constructor(props) {
        super(props);
    }

    selectProduct(product) {
        this.props.setState(
            {
                product: product
            }
        )
    }

    showProducts() {
        let products = this.props.api.getProducts();
        let selectProductFunction = this.selectProduct.bind(this);
        let businessId = this.props.api.getBusinessId();
        this.props.navigation.navigate("SelectProductsComponent", {
            products: products,
            selectProduct: selectProductFunction,
            businessId: businessId
        })
    }

    setPay(value) {
        if (value) {
            let pay = undefined;
            if (this.props.state.happy_hour && this.props.state.happy_hour.values) {
                pay = this.props.state.happy_hour.values.pay;
            }
            this.props.setState({
                choose_distribution: true,
                happy_hour: {
                    values: {
                        pay: pay,
                        eligible: value
                    }
                }
            })
        }
    }

    createSelectProductButton() {
        let result = undefined;
        let productName = undefined;
        if (this.props.state.product) {
            productName = <Text> {this.props.state.product.name}</Text>
        }
        let button = <Item><Button transparent onPress={() => this.showProducts(true)}>
            <Text>Select Product </Text>
        </Button>
            {productName}
        </Item>
        result = <View>{button}</View>
        return result;
    }

    render() {
        let selectProductButton = this.createSelectProductButton();
        return <View>


            {selectProductButton}
            <Item style={{margin: 3}} regular>
                <Input keyboardType='numeric' onChangeText={(value) => this.setPay(value)} placeholder='Pay $'/>
            </Item>
            <Item style={{margin: 3}} regular>
                <Input keyboardType='numeric' onChangeText={(value) => this.setFrom(value)}
                       placeholder='From Hour (1 - 24)'/>
            </Item>
            <Item style={{margin: 3}} regular>
                <Input keyboardType='numeric' onChangeText={(value) => this.setTo(value)}
                       placeholder='To Hour (1 - 24) '/>
            </Item>

            <Item style={{margin: 3}} regular>
                <Input onChangeText={(value) => this.setPunchCard(value)} placeholder='Days of Week (1,2,3..,7)'/>
            </Item>
        </View>
    }
}

