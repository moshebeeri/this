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
        const {disabled,title,color,onPress,disabledText,width,fontSize,height,textColor} = this.props;
        let bgc = color;

        let defaultTextColor= 'white';
        if(textColor){
            defaultTextColor = textColor;
        }
        let buttonTitle= title;
        let defaultWidth = 100;
        if(width){
            defaultWidth = width;
        }
        if(disabled){
            bgc = 'gray';
            defaultTextColor = 'white';
            if(disabledText){
                buttonTitle = disabledText;
            }
        }

        let defaultHeight = 40;
        if(height){
            defaultHeight = height;
        }


        let defaultFontSize = 14;
        if(fontSize){
            defaultFontSize = fontSize;
        }
        return  <TouchableOpacity disabled={disabled} style={{height:defaultHeight,width:defaultWidth,alignItems:'center', justifyContent:'center',borderRadius: defaultWidth/4,backgroundColor:bgc}}
                        onPress={onPress}>
            <ThisText style={{color:defaultTextColor,fontSize:defaultFontSize}}>{buttonTitle}</ThisText>
        </TouchableOpacity>

    }
}
