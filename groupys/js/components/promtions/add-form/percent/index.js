
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Platform,TextInput
} from 'react-native'
import {Container, Content, Text, InputGroup, Input, Button,Body ,Icon,Left,
    View,Header,Item,Footer,Picker,ListItem,Right,Thumbnail} from 'native-base';
;const Discouint_on = [
    {
        value:'',
        label:'Promotion On'
    },
    {
        value:'GLOBAL',
        label:'Global Discount'
    },
    {
        value:'PRODUCT',
        label:'Product Discount'
    }
];



export default class PercentComponent extends Component {

    constructor(props) {
        super(props);

    }

    setPercent(value){

        if(this.props.state.percent){
            let quantity = this.props.state.percent.quantity;
            let retail_price = this.props.state.percent.retail_price;
            this.props.setState(
                {
                    percent: {
                        percent: value,
                        quantity:quantity,
                        retail_price:retail_price,
                    },

                }
            )

        }else{
            this.props.setState(
                {
                    percent: {
                        percent: percentNum,

                    },

                }
            )
        }



    }


    setRetailPrice(value){
        if(this.props.state.percent) {
            let percent = this.props.state.percent.percent;
            let quantity = this.props.state.percent.quantity;
            this.props.setState(
                {
                    percent: {
                        percent: percent,
                        quantity:quantity,
                        retail_price:value,
                    },

                }
            )
        }else {
            this.props.setState(
                {
                    percent: {
                        retail_price: value,

                    },

                }
            )
        }
    }

    selectProduct(product){
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

    selectPromotionType(value){
        if(value) {
            this.props.setState({
                discount_on: value,
                choose_distribution: true
            })
        }else{
            this.props.setState({
                discount_on: value,
                choose_distribution: false
            })
        }
    }

    createSelectProductButton(){
        let result =  undefined;
        if(this.props.state.discount_on == 'PRODUCT'){
            let productName = undefined;
            if(this.props.state.product){
                productName = <Text> {this.props.state.product.name}</Text>


            }
            let button = <Item><Button transparent onPress={() => this.showProducts(true)}>
                <Text>Select Product </Text>
            </Button>
                {productName}
            </Item>
            let retailPrice =   <Item  style={{ margin:3 } } regular>
                <Input keyboardType = 'numeric'   onChangeText={(value) => this.setRetailPrice(value)} placeholder='Retail Price' />

            </Item>;

            result = <View>{retailPrice}{button}</View>
        }
        return result;
    }
    render() {

        let defaultvalue = undefined;
        if(this.props.state.total_discount){
            let total = Number(this.props.state.total_discount);
            let totalDiscount =  this.props.state.amount  * this.props.state.retail_price - total;
            let fixedPercentence = (totalDiscount / (this.props.state.amount  * this.props.state.retail_price)) * 100
            defaultvalue =fixedPercentence.toString();
        }else {


            if (this.props.state.percent.percent) {
                defaultvalue = this.props.state.percent.percent.toString();
            }
        }
        let selectProductButton =this.createSelectProductButton();



        let typePikkerTag = <Picker
            iosHeader="Discount"
            mode="dropdown"
            selectedValue={this.props.state.discount_on}
            onValueChange={this.selectPromotionType.bind(this)}
        >

            {


                Discouint_on.map((s, i) => {
                    return <Item
                        key={i}
                        value={s.value}
                        label={s.label}/>
                }) }
        </Picker>


        return <View>
            {typePikkerTag}
            <Item  style={{ margin:3 } } regular>
               <Input keyboardType = 'numeric'   onChangeText={(value) => this.setPercent(value)} placeholder='% Off' />
           </Item>

               {selectProductButton}


        </View>
  }
}

