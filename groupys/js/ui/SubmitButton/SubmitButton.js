import React, {Component} from 'react';
import {Dimensions, View,TextInput,Text} from 'react-native';
import {Icon, Input, Button} from 'native-base';
import styles from './styles';


export default class SubmitButton extends Component {
    constructor(props) {
        super(props);
    }





    render() {
        const {disabled,title,color,onPress} = this.props;
        let bgc = color;
        let textColor= 'white';
        if(disabled){
            bgc = 'gray';
            textColor = 'white';

        }
        return  <Button disabled={disabled} style={{width:100,alignItems:'center', justifyContent:'center',borderRadius: 20,backgroundColor:bgc}}
                        onPress={onPress}>
            <Text style={{color:textColor}}>{title}</Text>
        </Button>

    }
}
