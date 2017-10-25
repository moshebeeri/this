import React, {Component} from 'react';
import {Dimensions, View,TextInput} from 'react-native';
import {Icon, Input, Text} from 'native-base';
import styles from './styles';

const {width, height} = Dimensions.get('window');
export default class TextInputField extends Component {
    constructor(props) {
        super(props);
    }

    focus() {
        const {refNext} = this.props;
        this.refs[refNext].focus()
    }

    isValid() {
        const {isMandatory, value, validateContent} = this.props;
        if (isMandatory) {
            if (!value) {
                return false
            }
        }
        if (validateContent) {
            return validateContent(value)
        }
        return true;
    }


    render() {
        const {fieldColor,field, placeholder, value, onChangeText, onSubmitEditing, returnKeyType, refNext, isMandatory} = this.props;
        let textStyle = styles.textInputTextStyle;
        let mandtoryIconColor = 'red';
        if(fieldColor==='white'){
            textStyle = styles.textInputTextStyleWhite;
            mandtoryIconColor = 'black';
        }
        return <View style={styles.textInputContainer}>
            <View style={styles.textInputTitleContainer}>
                <Text style={textStyle}>{field}</Text>
                {isMandatory && <Icon style={{ margin:5,color:mandtoryIconColor, fontSize: 12}} name='star'/>}

            </View>
            <View style={styles.textInputComponentLayout}>
                <TextInput style={styles.textInputComponentStyle} value={value} returnKeyType={returnKeyType}
                       ref={refNext} underlineColorAndroid='transparent'
                       onSubmitEditing={onSubmitEditing}
                       onChangeText={onChangeText} placeholder={placeholder}/>
           </View>
        </View>
    }
}
