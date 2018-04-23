import React, {Component} from 'react';
import {Dimensions, I18nManager, View} from 'react-native';
import {CheckBox, Icon, Input, Text} from 'native-base';
import styles from './styles';
import SelectMultiple from 'react-native-select-multiple'
import strings from "../../i18n/i18n"
import StyleUtils from '../../utils/styleUtils'
import {ThisText} from '../../ui/index';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
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
        return <View style={[containerStyle, {width: StyleUtils.getWidth() - 15}]}>
            <View style={[styles.textInputTitleContainer, {width: StyleUtils.getWidth() - 15}]}>


                <ThisText style={textStyle}>{field}</ThisText>
                {isMandatory &&
                <MaterialCommunityIcons style={{marginLeft: 3, marginTop: 4, color: 'red', fontSize: StyleUtils.scale(8)}}
                                        name='asterisk'/>}


            </View>
            <View style={[weekscontainerStyle, {width: StyleUtils.getWidth() - 15}]}>


                 <SelectMultiple
                    items={days}

                    checkboxStyle={{justifyContent: 'flex-start'}}
                    selectedItems={this.state.selectedDays}
                    onSelectionsChange={this.onChange.bind(this)}/>

                <SelectMultiple
                    items={days2}
                    rowStyle={{justifyContent: 'flex-start' }}
                    selectedItems={this.state.selectedDays}
                    onSelectionsChange={this.onChange.bind(this)}/>
            </View>
        </View>
    }
}
