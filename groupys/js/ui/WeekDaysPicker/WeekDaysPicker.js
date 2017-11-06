import React, {Component} from 'react';
import {Dimensions, View} from 'react-native';
import {CheckBox, Icon, Input, Text} from 'native-base';
import styles from './styles';
import SelectMultiple from 'react-native-select-multiple'

const days = [
    {label: 'Sunday', value: '1'},
    {label: 'Monday', value: '2'},
    {label: 'Tuesday', value: '3'},
    {label: 'Wednesday', value: '4'},
]
const days2 = [
    {label: 'Thursday', value: '5'},
    {label: 'Friday', value: '6'},
    {label: 'Saturday', value: '7'},
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
                <Text style={textStyle}>{field}</Text>
                {field && isMandatory &&
                <Icon style={{margin: 5, color: mandtoryIconColor, fontSize: 12}} name='star'/>}

            </View>
            <View style={weekscontainerStyle}>
                <SelectMultiple
                    items={days}
                    selectedItems={this.state.selectedDays}
                    onSelectionsChange={this.onChange.bind(this)}/>
                <SelectMultiple
                    items={days2}
                    selectedItems={this.state.selectedDays}
                    onSelectionsChange={this.onChange.bind(this)}/>


            </View>
        </View>
    }
}
