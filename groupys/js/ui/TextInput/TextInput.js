import React, {Component} from 'react';
import {Dimensions, TextInput, View} from 'react-native';
import {Icon, Input, Text} from 'native-base';
import styles from './styles';
import { I18nManager } from 'react-native';
const {width, height} = Dimensions.get('window');
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
        const {isMandatory, value, validateContent,invalid} = this.props;
        if(invalid){
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
            if(!validateContent(value)){
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
        if(onSubmitEditing) {
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
        const {fieldColor, field, placeholder, value, returnKeyType, refNext, isMandatory,keyboardType,disabled,secureTextEntry} = this.props;
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
        if(field){
            containerStyle = styles.textInputContainer;
        }
        let inputField =  <TextInput style={textInputStyle} value={value} returnKeyType={returnKeyType}
                                     ref={refNext} underlineColorAndroid='transparent' disabled
                                     keyboardType={keyboardType}
                                     secureTextEntry={secureTextEntry}
                                     onSubmitEditing={this.onSubmit.bind(this)}
                                     onChangeText={this.onChange.bind(this)} placeholder={placeholder}/>
        if(!I18nManager.isRTL){
            inputField =  <TextInput style={textInputStyle} value={value} returnKeyType={returnKeyType}
                                    ref={refNext} underlineColorAndroid='transparent' disabled
                                    keyboardType={keyboardType}
                                    secureTextEntry={secureTextEntry}
                                    onSubmitEditing={this.onSubmit.bind(this)}
                                    onChangeText={this.onChange.bind(this)} />

        }
        if(disabled){
            if(value) {
                inputField = <View style={styles.textInputDisabledComponentStyle}>
                    <Text>{value}</Text>
                </View>
            }else{
                inputField = <View style={styles.textInputDisabledComponentStyle}>
                    <Text>{placeholder}</Text>
                </View>
            }
        }

        return <View style={containerStyle}>
            <View style={styles.textInputTitleContainer}>

                <Text style={textStyle}>{field}</Text>
                {field && isMandatory && <Icon style={{margin: 5, color: mandatoryIconColor, fontSize: 12}} name='star'/>}

            </View>
            <View style={styles.textInputComponentLayout}>
                {inputField}
                {!value && <Text style={{position:'absolute',height: 40, backgroundColor:'transparent',color:'gray',alignSelf:'center',justifyContent:'center',alignItems:'center',top:6,right:10}}>{placeholder}</Text>}
            </View>
        </View>
    }
}
