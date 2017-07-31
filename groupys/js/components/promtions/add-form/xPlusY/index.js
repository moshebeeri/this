
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Platform,TextInput
} from 'react-native'
import {Container, Content, Text, InputGroup, Input, Button,Body ,Icon,Left,
    View,Header,Item,Footer,Picker,ListItem,Right,Thumbnail} from 'native-base';



export default class XPlusYComponent extends Component {

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

    setBuy(value) {
        if (value) {
            let eligible = undefined;
            if(this.props.state.x_plus_y && this.props.state.x_plus_y.values){
                eligible = this.props.state.x_plus_y.values.eligible;
            }
            this.props.setState({
                choose_distribution: true,
                x_plus_y:
                    {
                        values: {
                            buy: value,
                            eligible:eligible,
                        }
                    }

            })
        }
    }

    setEligible(value) {
        if (value) {
            let buy = undefined;
            if(this.props.state.x_plus_y && this.props.state.x_plus_y.values){
                buy = this.props.state.x_plus_y.values.buy;
            }
            this.props.setState({
                x_plus_y:
                    {
                        values: {
                            buy: buy,
                            eligible:value,
                        }
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
        if(this.props.state.product){
            productName = <Text> {this.props.state.product.name}</Text>


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
               <Input keyboardType = 'numeric'   onChangeText={(value) => this.setBuy(value)} placeholder='Buy Amount' />
           </Item>
            {selectBuyProductButton}
            <Item  style={{ margin:3 } } regular>
                <Input keyboardType = 'numeric'   onChangeText={(value) => this.setEligible(value)} placeholder='Number of Gifts' />
            </Item>
               {selectProductButton}


        </View>
  }
}

