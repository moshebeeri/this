
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Platform,TextInput
} from 'react-native'
import {Container, Content, Text, InputGroup, Input, Button,Body ,Icon,Left,
    View,Header,Item,Footer,Picker,ListItem,Right,Thumbnail} from 'native-base';



export default class XForYComponent extends Component {

    constructor(props) {
        super(props);

    }




    componentWillMount(){
        this.props.setState({
                discount_on: 'PRODUCT'
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


    showBuyProducts(){
        let products =  this.props.api.getProducts();
        let selectProductFunction = this.selectBuyProduct.bind(this);
        this.props.navigation.navigate("SelectProductsComponent",{
            products:products,
            selectProduct:selectProductFunction})

    }


    setBuyAmount(value) {
        if (value) {
            let pay = undefined;
            if(this.props.state.x_for_y && this.props.state.x_for_y.values){
                pay = this.props.state.x_for_y.values.pay;
            }
            this.props.setState({
                choose_distribution: true,
                x_for_y:{
                    values: {
                        pay:pay,
                        eligible: value
                    }
                }

            })
        }
    }

    setPay(value) {
        if (value) {
            let eligible = undefined;
            if(this.props.state.x_for_y && this.props.state.x_for_y.values){
                eligible = this.props.state.x_for_y.values.eligible;
            }
            this.props.setState({
                choose_distribution: true,
                x_for_y:
                    {
                        values: {
                            pay: value,
                            eligible:eligible,
                        }
                     }

            })
        }
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






        return <View>

            <Item  style={{ margin:3 } } regular>
               <Input keyboardType = 'numeric'   onChangeText={(value) => this.setBuyAmount(value)} placeholder='Buy Amount' />
           </Item>
            {selectBuyProductButton}
            <Item  style={{ margin:3 } } regular>
                <Input keyboardType = 'numeric'   onChangeText={(value) => this.setPay(value)} placeholder='Pay $'/>
            </Item>



        </View>
  }
}

