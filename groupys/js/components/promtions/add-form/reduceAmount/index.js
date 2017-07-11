
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Platform,TextInput
} from 'react-native'
import {Container, Content, Text, InputGroup, Input, Button,Body ,Icon,Left,
    View,Header,Item,Footer,Picker,ListItem,Right,Thumbnail} from 'native-base';



export default class ReduceAmountComponent extends Component {

    constructor(props) {
        super(props);

    }





    selectProduct(product){
        this.props.setState(
            {
                giftProduct:product
            }
        )
    }

    selectBuyProduct(product){
        this.props.setState(
            {
                buyProduct:product
            }
        )
    }

    showProducts(){
        let products =  this.props.api.getProducts();
        let selectProductFunction = this.selectProduct.bind(this);
        this.props.navigation.navigate("SelectProductsComponent",{
            products:products,
            selectProduct:selectProductFunction})

    }

    showBuyProducts(){
        let products =  this.props.api.getProducts();
        let selectProductFunction = this.selectBuyProduct.bind(this);
        this.props.navigation.navigate("SelectProductsComponent",{
            products:products,
            selectProduct:selectProductFunction})

    }

    setPunchCard(value) {
        if (value) {
            this.props.setState({
                discount_on: 'PRODUCT',
                choose_distribution: true,
                punch_card:{
                    number_of_punches:value,
                }

            })
        }
    }

    createSelectProductButton(){
        let result =  undefined;
            let productName = undefined;
            if(this.props.state.giftProduct){
                productName = <Text> {this.props.state.giftProduct.name}</Text>


            }
            let button = <Item><Button transparent onPress={() => this.showProducts(true)}>
                <Text>Select Gift</Text>
            </Button>
                {productName}
            </Item>


            result = <View>{button}</View>

        return result;
    }
    createSelectBuyProductButton(){
        let result =  undefined;
        let productName = undefined;
        if(this.props.state.buyProduct){
            productName = <Text> {this.props.state.buyProduct.name}</Text>


        }
        let button = <Item><Button transparent onPress={() => this.showBuyProducts(true)}>
            <Text>Select Buy Product</Text>
        </Button>
            {productName}
        </Item>


        result = <View>{button}</View>

        return result;
    }
    render() {

        let selectBuyProductButton =this.createSelectBuyProductButton();


        let selectProductButton =this.createSelectProductButton();





        return <View>

            <Item  style={{ margin:3 } } regular>
               <Input keyboardType = 'numeric'   onChangeText={(value) => this.setPunchCard(value)} placeholder='Buy $' />
           </Item>

            <Item  style={{ margin:3 } } regular>
                <Input keyboardType = 'numeric'   onChangeText={(value) => this.setPunchCard(value)} placeholder='Pay $'/>
            </Item>



        </View>
  }
}

