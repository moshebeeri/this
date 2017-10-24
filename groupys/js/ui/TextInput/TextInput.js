import React, {Component} from 'react';
import {Dimensions, View} from 'react-native';
import {Icon, Input, Text} from 'native-base';
import styles from './styles';

const {width, height} = Dimensions.get('window');
export default class TextInput extends Component {
    constructor(props) {
        super(props);
    }

    focus() {
        const {refNext} = this.props;
        this.refs[refNext]._root.focus()
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
        const {field, placeholder, value, onChangeText, onSubmitEditing, returnKeyType, refNext, isMandatory} = this.props;
        return <View style={styles.textInputContainer}>
            <Text style={styles.textInputTextStyle}>{field}</Text>
            <View style={styles.textInputComponentLayout}>
                <Input style={styles.textInputComponentStyle} value={value} returnKeyType={returnKeyType}
                       ref={refNext}
                       onSubmitEditing={onSubmitEditing}
                       onChangeText={onChangeText} placeholder={placeholder}/>
                {isMandatory && <Icon style={{left: width - 35, top: 20, position: 'absolute', color: 'red', fontSize: 12}} name='star'/>}
            </View>
        </View>
    }
}
