
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Platform,TextInput
} from 'react-native'
import {Container, Content, Text, InputGroup, Input, Button,Body ,Icon,Left,
    View,Header,Item,Footer,Picker,ListItem,Right,Thumbnail} from 'native-base';



export default class XPlusYOffComponent extends Component {

    constructor(props) {
        super(props);

    }


    componentWillMount(){
        this.props.setState({
            discount_on: 'PRODUCT'
        })
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
                product:product
            }
        )
    }

    showProducts(){
        let products =  this.props.api.getProducts();
        let selectProductFunction = this.selectProduct.bind(this);
        let businessId = this.props.api.getBusinessId();
        this.props.navigation.navigate("SelectProductsComponent",{
            products:products,
            selectProduct:selectProductFunction,
            businessId:businessId})

    }

    showBuyProducts(){
        let products =  this.props.api.getProducts();
        let selectProductFunction = this.selectBuyProduct.bind(this);
        let businessId = this.props.api.getBusinessId();
        this.props.navigation.navigate("SelectProductsComponent",{
            products:products,
            selectProduct:selectProductFunction,
            businessId:businessId})
    }

    setOff(value) {
        if (value) {
            this.props.setState({

                choose_distribution: true,
                x_plus_n_percent_off:{
                    eligible:value,
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
                <Text>Select Product </Text>
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


            {selectBuyProductButton}
            {selectProductButton}
            <Item  style={{ margin:3 } } regular>
                <Input keyboardType = 'numeric'   onChangeText={(value) => this.setOff(value)} placeholder='% Off' />
            </Item>



        </View>
  }
}

