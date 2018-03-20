import React, {Component} from 'react';
import {Dimensions, View} from 'react-native';
import {Icon, Input} from 'native-base';
import styles from './styles';
import DatePicker from "react-native-datepicker";
import {ThisText} from '../index';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import strings from "../../i18n/i18n"

const {width, height} = Dimensions.get('window');
export default class DatePickerField extends Component {
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
        if (field) {
            containerStyle = styles.textInputContainer;
        }
        return <View style={containerStyle}>
            <View style={styles.textInputTitleContainer}>

                <ThisText style={textStyle}>{field}</ThisText>
                {field && isMandatory &&
                <MaterialCommunityIcons style={{marginLeft: 3, marginTop:-5, color: 'red', fontSize: 8}}
                                        name='asterisk'/>}
            </View>
            <View style={styles.textInputComponentLayout}>
                <DatePicker
                    ref={refNext}
                    date={value}
                    style={textInputStyle}
                    mode="date"
                    placeholder={placeholder}
                    format="YYYY-MM-DD"
                    minDate="2016-05-01"
                    maxDate="2020-06-01"
                    confirmBtnText={strings.Confirm}
                    cancelBtnText={strings.Cancel}
                    onDateChange={this.onChange.bind(this)}
                />

            </View>
        </View>
    }
}
