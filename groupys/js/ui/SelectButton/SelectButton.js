import React, {Component} from 'react';
import { View,Text,TouchableOpacity} from 'react-native';
import {Item,Picker,Icon,Spinner} from 'native-base';

import styles from './styles'

export default class SelectButton extends Component {
    constructor(props) {
        super(props);
        this.state = {
            type: '',
            valid:true,
        }
    }


    focus() {
        const {refNext} = this.props;
        this.refs[refNext].focus()
    }

    isValid(){
        const{selectedValue,isMandatory} = this.props;
        if(isMandatory){
            if(!selectedValue){
                this.setState({valid:false});
                return false;
            }
        }

        return true;
    }


    render() {
        const {title, action,} = this.props;
        let buttonStyle = styles.buttonStyle;
        let textStyle = styles.buttonTextStyle;
        if(!this.state.valid){
            buttonStyle = styles.buttonStyleInvalid;
            textStyle = styles.buttonTextStyleInvalid;
        }
        return <TouchableOpacity style={buttonStyle} onPress={action}>
                    <Text style={textStyle}>{title}</Text>
        </TouchableOpacity>
    }
}

