
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Platform
} from 'react-native'
import {Container, Content, Text, InputGroup, Input, Button,Body ,Icon,Left,
    View,Header,Item,Footer,Picker,ListItem,Right,Thumbnail} from 'native-base';

import CheckBox from 'react-native-check-box'
import {actions} from 'react-native-navigation-redux-helpers';
import { openDrawer } from '../../../../actions/drawer';
import navigateTo from '../../../../actions/sideBarNav';




export default class PercentRangeComponent extends Component {

    constructor(props) {
        super(props);

    }


    setPercentFrom(value){
        let percentNum = Number(value.value);
        this.props.setState(
            {
                percent_range: {
                    to: this.props.state.percent_range.to,
                    from: percentNum
                }
            }

        )
    }
    setPercentTo(value){
        let percentNum = Number(value.value);
        this.props.setState(
            {
                percent_range: {
                    to: percentNum,
                    from:this.props.state.percent_range.from,
                }
            }

        )
    }

    render() {
        let fromDefaultValue = "";
        if(this.props.state.percent_range.from){
            fromDefaultValue = this.props.state.percent_range.from.value;
        }
        let toDefaultValue = "";
        if(this.props.state.percent_range.to){
            toDefaultValue = this.props.state.percent_range.to.value;
        }

        return  <View>
           <Item underline>
               <Input value={fromDefaultValue}  onChangeText={(value) => this.setPercentFrom({value})} placeholder=' from %Precent' />
           </Item>
           <Item underline>
               <Input value= {toDefaultValue} onChangeText={(value) => this.setPercentTo({value})} placeholder=' to %Precent' />
           </Item>
       </View>
  }
}
