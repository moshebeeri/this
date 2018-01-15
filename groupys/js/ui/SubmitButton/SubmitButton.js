import React, {Component} from 'react';
import {Dimensions, View,TextInput,Text,TouchableOpacity} from 'react-native';
import {Icon, Input, Button} from 'native-base';
import styles from './styles';


export default class SubmitButton extends Component {
    constructor(props) {
        super(props);
    }





    render() {
        const {disabled,title,color,onPress,disabledText} = this.props;
        let bgc = color;
        let textColor= 'white';
        let buttonTitle= title;
        if(disabled){
            bgc = 'gray';
            textColor = 'white';
            if(disabledText){
                buttonTitle = disabledText;
            }
        }
        return  <TouchableOpacity disabled={disabled} style={{height:40,width:100,alignItems:'center', justifyContent:'center',borderRadius: 20,backgroundColor:bgc}}
                        onPress={onPress}>
            <Text style={{color:textColor}}>{buttonTitle}</Text>
        </TouchableOpacity>

    }
}
