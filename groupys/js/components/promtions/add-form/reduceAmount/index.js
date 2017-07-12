
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


    componentWillMount(){
        this.props.setState({
                discount_on: 'GLOBAL'
            }
        )
    }




    setPay(value) {
        if (value) {
            let price = undefined;
            if(this.props.state.reduced_amount && this.props.state.reduced_amount.values){
                price = this.props.state.reduced_amount.values.price;
            }
            this.props.setState({
                choose_distribution: true,
                reduced_amount:{
                    values:{
                        pay: value,
                        price: price
                    },
                }

            })
        }
    }


    setBuy(value) {
        if (value) {
            let pay = undefined;
            if(this.props.state.reduced_amount && this.props.state.reduced_amount.values){
                pay = this.props.state.reduced_amount.values.pay;
            }
            this.props.setState({
                choose_distribution: true,
                reduced_amount:{
                    values:{
                        pay: pay,
                        price: value
                    },
                }

            })
        }
    }

    render() {





        return <View>

            <Item  style={{ margin:3 } } regular>
               <Input keyboardType = 'numeric'   onChangeText={(value) => this.setBuy(value)} placeholder='Buy $' />
           </Item>

            <Item  style={{ margin:3 } } regular>
                <Input keyboardType = 'numeric'   onChangeText={(value) => this.setPay(value)} placeholder='Pay $'/>
            </Item>



        </View>
  }
}

