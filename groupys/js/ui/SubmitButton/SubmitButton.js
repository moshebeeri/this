import React, {Component} from 'react';
import {Dimensions, View,TextInput,Text,TouchableOpacity} from 'react-native';
import {Icon, Input, Button} from 'native-base';
import styles from './styles';

import {ThisText} from '../../ui/index';

export default class SubmitButton extends Component {
    constructor(props) {
        super(props);
    }





    render() {
        const {disabled,title,color,onPress,disabledText,width} = this.props;
        let bgc = color;
        let textColor= 'white';
        let buttonTitle= title;
        let defaultWidth = 100;
        if(width){
            defaultWidth = width;
        }
        if(disabled){
            bgc = 'gray';
            textColor = 'white';
            if(disabledText){
                buttonTitle = disabledText;
            }
        }
        return  <TouchableOpacity disabled={disabled} style={{height:40,width:defaultWidth,alignItems:'center', justifyContent:'center',borderRadius: 20,backgroundColor:bgc}}
                        onPress={onPress}>
            <ThisText style={{color:textColor}}>{buttonTitle}</ThisText>
        </TouchableOpacity>

    }
}
