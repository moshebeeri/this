import React, {Component} from 'react';
import {TextInput, View} from 'react-native';
import {Icon, Input} from 'native-base';
import styles from './styles';
import {ThisText} from '../../ui/index';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
export default class TextInputField extends Component {
    constructor(props) {
        super(props);
        this.state = {
            invalid: false,
        }
    }

    focus() {
        const {refNext} = this.props;
        this.refs[refNext].focus()
    }

    isValid() {
        const {isMandatory, value, validateContent, invalid} = this.props;
        if (invalid) {
            this.setState({
                invalid: true
            })
            return false
        }
        if (isMandatory) {
            if (!value) {
                this.setState({
                    invalid: true
                })
                return false
            }
        }
        if (validateContent) {
            if (!validateContent(value)) {
                this.setState({
                    invalid: true
                })
                return false
            }
        }
        return true;
    }

    onSubmit() {
        const {onSubmitEditing, validateContent, value} = this.props;
        if (validateContent) {
            if (!validateContent(value)) {
                this.setState({
                    invalid: true
                })
                return;
            }
        }
        if (onSubmitEditing) {
            onSubmitEditing();
        }
    }

    onChange(text) {
        const {onChangeText} = this.props;
        this.setState({
            invalid: false
        })
        onChangeText(text);
    }

    render() {
        const {fieldColor, field, placeholder, value, returnKeyType, refNext, isMandatory, keyboardType, disabled, secureTextEntry, multiline, numberOfLines, textArea} = this.props;
        let textStyle = styles.textInputTextStyle;
        let mandatoryIconColor = 'red';
        if (fieldColor === 'white') {
            textStyle = styles.textInputTextStyleWhite;
            mandatoryIconColor = 'black';
        }
        let textInputStyle = styles.textInputComponentStyle;
        if (this.state.invalid) {
            textInputStyle = styles.textInputInvalidComponentStyle;
        }
        let containerStyle = styles.textInputNoFiledContainer;
        if (field) {
            containerStyle = styles.textInputContainer;
        }
        if (textArea) {
            containerStyle = styles.textAreaContainer;
        }
        let stringValue = '';
        if (value) {
            stringValue = value.toString();
        }
        let inputField = <TextInput style={textInputStyle} value={stringValue} returnKeyType={returnKeyType}
                                    ref={refNext} underlineColorAndroid='transparent' disabled
                                    keyboardType={keyboardType}
                                    secureTextEntry={secureTextEntry}
                                    numberOfLines={numberOfLines}
                                    multiline={multiline}
                                    blurOnSubmit={false}
                                    onSubmitEditing={this.onSubmit.bind(this)}
                                    onChangeText={this.onChange.bind(this)} placeholder={placeholder}/>
        if (disabled) {
            if (value) {
                inputField = <View style={styles.textInputDisabledComponentStyle}>
                    <ThisText>{value}</ThisText>
                </View>
            } else {
                inputField = <View style={styles.textInputDisabledComponentStyle}>
                    <ThisText>{placeholder}</ThisText>
                </View>
            }
        }
        return <View style={containerStyle}>
            <View style={styles.textInputTitleContainer}>

                <ThisText style={textStyle}>{field}</ThisText>
                {field && isMandatory &&
                <MaterialCommunityIcons style={{marginLeft:3,marginTop: 4, color: mandatoryIconColor, fontSize: 8}} name='asterisk'/>}

            </View>
            <View style={styles.textInputComponentLayout}>
                {inputField}
            </View>
        </View>
    }
}
