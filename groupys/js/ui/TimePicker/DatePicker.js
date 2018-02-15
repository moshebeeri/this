import React, {Component} from 'react';
import {Dimensions, TextInput, View} from 'react-native';
import {Icon, Input, Text} from 'native-base';
import styles from './styles';
import DatePicker from "react-native-datepicker";
import strings from "../../i18n/i18n"
import {ThisText} from '../index';
const {width, height} = Dimensions.get('window');
import { I18nManager } from 'react-native';
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
        const {isMandatory, validateContent} = this.props;
        if (isMandatory) {
            if (!this.state.selectedValue) {
                this.setState({
                    invalid: true
                })
                return false
            }
        }
        if (validateContent) {
            if(!validateContent()){
                this.setState({
                    invalid: true
                })
                return false
            }
        }
        return true;
    }


    onChange(date) {
        const {onChangeDate} = this.props;
        this.setState({
            invalid: false,
            selectedValue:date
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
                {!I18nManager.isRTL  &&field && isMandatory && <Icon style={{margin: 5, color: mandtoryIconColor, fontSize: 12}} name='star'/>}

                <ThisText style={textStyle}>{field}</ThisText>
                {I18nManager.isRTL  &&field && isMandatory && <Icon style={{margin: 5, color: mandtoryIconColor, fontSize: 12}} name='star'/>}

            </View>
            <View style={styles.textInputComponentLayout}>
                <DatePicker
                    ref={refNext}
                    date={this.state.selectedValue}
                    style={textInputStyle}
                    mode="time"
                    placeholder={placeholder}
                    confirmBtnText={strings.Confirm}
                    cancelBtnText={strings.Cancel}
                    onDateChange={this.onChange.bind(this)}
                />

            </View>
        </View>
    }
}
