import React, {Component} from 'react';
import {Dimensions, View} from 'react-native';
import {CheckBox, Icon, Input, Text} from 'native-base';
import styles from './styles';
import SelectMultiple from 'react-native-select-multiple'
import strings from "../../i18n/i18n"
import { I18nManager } from 'react-native';
const days = [
    {label: strings.Sunday, value: '1'},
    {label: strings.Monday, value: '2'},
    {label: strings.Tuesday, value: '3'},
    {label: strings.Wednesday, value: '4'},
]
const days2 = [
    {label: strings.Thursday, value: '5'},
    {label: strings.Friday, value: '6'},
    {label: strings.Saturday, value: '7'},
]
const {width, height} = Dimensions.get('window');
export default class WeekDaysPicker extends Component {
    constructor(props) {
        super(props);
        this.state = {
            invalid: false,
            selectedDays: []
        }
    }

    focus() {
        const {refNext} = this.props;
        this.refs[refNext].focus()
    }

    isValid() {
        const {isMandatory} = this.props;
        if (isMandatory) {
            if (this.state.selectedDays.length === 0) {
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

    onChange(selectedFruits) {
        const {onChangeSelected} = this.props;
        this.setState({
            invalid: false,
            selectedDays: selectedFruits
        })
        onChangeSelected(selectedFruits);
    }

    render() {
        const {fieldColor, field, placeholder, value, refNext, isMandatory} = this.props;
        let textStyle = styles.textInputTextStyle;
        let mandtoryIconColor = 'red';
        if (fieldColor === 'white') {
            textStyle = styles.textInputTextStyleWhite;
            mandtoryIconColor = 'black';
        }
        let weekscontainerStyle = styles.textInputComponentLayout;
        if (this.state.invalid) {
            weekscontainerStyle = styles.textInputComponentInvalidLayout;
        }
        let containerStyle = styles.textInputNoFiledContainer;
        if (field) {
            containerStyle = styles.textInputContainer;
        }
        return <View style={containerStyle}>
            <View style={styles.textInputTitleContainer}>
                {!I18nManager.isRTL  && field && isMandatory &&
                <Icon style={{margin: 5, color: mandtoryIconColor, fontSize: 12}} name='star'/>}

                <Text style={textStyle}>{field}</Text>
                {I18nManager.isRTL  && field && isMandatory &&
                <Icon style={{margin: 5, color: mandtoryIconColor, fontSize: 12}} name='star'/>}

            </View>
            <View style={weekscontainerStyle}>
                {I18nManager.isRTL  && <SelectMultiple
                    items={days}
                    selectedItems={this.state.selectedDays}
                    onSelectionsChange={this.onChange.bind(this)}/>
                }
                <SelectMultiple
                    items={days2}
                    rowStyle={{justifyContent:I18nManager.isRTL ? 'flex-start' : 'space-between'}}
                    selectedItems={this.state.selectedDays}
                    onSelectionsChange={this.onChange.bind(this)}/>
                {!I18nManager.isRTL  && <SelectMultiple
                    items={days}
                    rowStyle={{justifyContent:'space-between'}}
                    checkboxStyle={{justifyContent:'flex-start'}}
                    selectedItems={this.state.selectedDays}
                    onSelectionsChange={this.onChange.bind(this)}/>
                }

            </View>
        </View>
    }
}
