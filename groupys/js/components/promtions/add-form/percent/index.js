
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Platform,TextInput
} from 'react-native'
import {Container, Content, Text, InputGroup, Input, Button,Body ,Icon,Left,
    View,Header,Item,Footer,Picker,ListItem,Right,Thumbnail} from 'native-base';

import CheckBox from 'react-native-check-box'
import {actions} from 'react-native-navigation-redux-helpers';
import { openDrawer } from '../../../../actions/drawer';
import navigateTo from '../../../../actions/sideBarNav';
import AddFormHeader from '../../../header/addFormHeader';

import styles from './styles';



export default class PercentComponent extends Component {

    constructor(props) {
        super(props);

    }

    setPercent(value){
        let percentNum = Number(value.value);

        if(this.props.state.amount && this.props.state.retail_price) {
           let discount = (percentNum / 100) * this.props.state.amount * this.props.state.retail_price;
            let totalDiscount = this.props.state.amount * this.props.state.retail_price - discount;
            this.props.setState(
                {
                    percent: {
                        percent: percentNum,

                    },
                    total_discount: totalDiscount.toString()
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

    render() {
        let defaultvalue = undefined;
        if(this.props.state.total_discount){
            let total = Number(this.props.state.total_discount);
            let totalDiscount =  this.props.state.amount  * this.props.state.retail_price - total;
            let fixedPercentence = (totalDiscount / (this.props.state.amount  * this.props.state.retail_price)) * 100
            defaultvalue =fixedPercentence.toString();
        }else {


            if (this.props.state.percent.percent) {
                defaultvalue = this.props.state.percent.percent.value;
            }
        }

       return  <Item underline>
           <Input keyboardType = 'numeric' value={defaultvalue}  onChangeText={(value) => this.setPercent({value})} placeholder='%Precent' />
       </Item>
  }
}

