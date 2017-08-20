
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Platform,TextInput
} from 'react-native'
import {Container, Content, Text, InputGroup, Input, Button,Body ,Icon,Left,
    View,Header,Item,Footer,Picker,ListItem,Right,Thumbnail} from 'native-base';



export default class PunchCardComponent extends Component {

    constructor(props) {
        super(props);

    }
    componentWillMount(){
        this.props.setState({
            discount_on: 'PRODUCT'
        })
    }

        selectBuyProduct(product){
        this.props.setState(
            {
                product:product
            }
        )
    }



    selectProduct(product){
        this.props.setState(
            {
                giftProduct:product
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

    setPunchCard(value) {
        if (value) {
            this.props.setState({
                choose_distribution: true,
                punch_card:{
                    values:{number_of_punches:value},
                }

            })
        }
    }
    showBuyProducts(){
        let products =  this.props.api.getProducts();
        let selectProductFunction = this.selectBuyProduct.bind(this);
        this.props.navigation.navigate("SelectProductsComponent",{
            products:products,
            selectProduct:selectProductFunction})

    }
    createSelectBuyProductButton(){
        let result =  undefined;
        let productName = undefined;
        if(this.props.state.prodict){
            productName = <Text> {this.props.state.product.name}</Text>


        }
        let button = <Item><Button transparent onPress={() => this.showBuyProducts(true)}>
            <Text>Select Punch Product</Text>
        </Button>
            {productName}
        </Item>


        result = <View>{button}</View>

        return result;
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
    render() {


        let selectProductButton =this.createSelectProductButton();



        let punchProduct = this.createSelectBuyProductButton();

        return <View>
            {punchProduct}
            <Item  style={{ margin:3 } } regular>
               <Input keyboardType = 'numeric'   onChangeText={(value) => this.setPunchCard(value)} placeholder='Number of Punches' />
           </Item>


               {selectProductButton}


        </View>
  }
}

