import React, {Component} from 'react';
import {Dimensions, TextInput, View} from 'react-native';
import {Icon, Input, Text} from 'native-base';
import styles from './styles';
import DatePicker from "react-native-datepicker";

const {width, height} = Dimensions.get('window');
export default class TimePickerField extends Component {
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
        const {isMandatory, value, validateContent} = this.props;
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

    onChange(date) {
        const {onChangeDate} = this.props;
        this.setState({
            invalid: false
        })
        onChangeDate(date);
    }

    render() {
        const {fieldColor, field, placeholder, value, refNext, isMandatory} = this.props;
        let textStyle = styles.textInputTextStyle;
        let mandtoryIconColor = 'red';
        if (fieldColor === 'white') {
            textStyle = styles.textInputTextStyleWhite;
            mandtoryIconColor = 'black';
        }
        let textInputStyle = styles.textInputComponentStyle;
        if (this.state.invalid) {
            textInputStyle = styles.textInputInvalidComponentStyle;
        }

        let containerStyle = styles.textInputNoFiledContainer;
        if(field){
            containerStyle = styles.textInputContainer;
        }

        return <View style={containerStyle}>
            <View style={styles.textInputTitleContainer}>
                <Text style={textStyle}>{field}</Text>
                {field && isMandatory && <Icon style={{margin: 5, color: mandtoryIconColor, fontSize: 12}} name='star'/>}

            </View>
            <View style={styles.textInputComponentLayout}>
                <DatePicker
                    ref={refNext}
                    date={value}
                    style={textInputStyle}
                    mode="time"
                    placeholder={placeholder}
                    confirmBtnText="Confirm"
                    cancelBtnText="Cancel"
                    onDateChange={this.onChange.bind(this)}
                />

            </View>
        </View>
    }
}