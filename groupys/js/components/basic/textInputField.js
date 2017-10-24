import React, {Component} from 'react';
import {Dimensions, View} from 'react-native';
import {Icon, Input, Text} from 'native-base';
import styles from './styles';

const {width, height} = Dimensions.get('window')
export default class TextInputField extends Component {
    constructor(props) {
        super(props);
    }

    createManatoryIcon(isMandatory) {
        if (isMandatory) {
            return <Icon style={{left: width - 35, top: 20, position: 'absolute', color: 'red', fontSize: 12}}
                         name='star'/>
        }
        return undefined;
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
        const mandatoryIcon = this.createManatoryIcon(isMandatory);
        return <View style={styles.textInputContainer}>
            <Text style={styles.textInputTextStyle}>{field}</Text>
            <View style={styles.textInputComponentLayout}>
                <Input style={styles.textInputComponentStyle} value={value} returnKeyType={returnKeyType}
                       ref={refNext}
                       onSubmitEditing={onSubmitEditing}
                       onChangeText={onChangeText} placeholder={placeholder}/>
                {mandatoryIcon}
            </View>
        </View>
    }
}
