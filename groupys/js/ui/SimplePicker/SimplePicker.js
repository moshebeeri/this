import React, {Component} from 'react';
import {Platform, Text, TouchableOpacity, View} from 'react-native';
import {Icon, Item, Picker, Spinner} from 'native-base';
import ModalDropdown from 'react-native-modal-dropdown';
import Icon3 from 'react-native-vector-icons/EvilIcons';
import styles from './styles'
import { I18nManager } from 'react-native';
import strings from "../../i18n/i18n"
export default class SimplePicker extends Component {
    constructor(props) {
        super(props);
        this.state = {
            type: ''
        }
    }

    selectPromotionType(value) {
        const {onValueSelected} = this.props;
        this.setState({
            type: value,
        })
        onValueSelected(value)
    }

    selectIos(value) {
        const {onValueSelected, list} = this.props;
        let options = list.map((s) => {
            return s.value;
        })
        this.setState({
            type: options[value -1],
        })
        onValueSelected(options[value -1])
    }

    showDropDownn() {
        this.refs.dropDown.show();
    }

    focus() {
        const {refNext} = this.props;
        this.refs[refNext].focus()
    }

    isValid() {
        const {isMandatory} = this.props;
        if (isMandatory) {
            if (!this.state.type) {
                this.setState({
                    invalid: true
                })
                return false
            }
        }
        return true;
    }

    renderRow(value){

        return <View style={{justifyContent:I18nManager.isRTL?'flex-start':'flex-end',alignItems: 'flex-end'}}><Text style={{paddingLeft:10,paddingRight:10,fontSize:14 }}>{value}</Text></View>

    }
    createIosRender() {
        const {list, itemTitle, defaultHeader, isMandatory, defaultValue} = this.props;
        let options = list.map((s) => {
            return s.label;
        })
        let pickerStyle=styles.modalView;
        if (this.state.invalid) {
            pickerStyle = styles.modalViewInvalid;
        }
        options.unshift(defaultValue);


        return <View>
            <View style={styles.pickerTitleContainer}>
                {!I18nManager.isRTL && isMandatory && <Icon style={{margin: 5, color: 'red', fontSize: 12}} name='star'/>}

                <Text style={styles.pickerTextStyle}>{itemTitle}</Text>
                {I18nManager.isRTL && isMandatory && <Icon style={{margin: 5, color: 'red', fontSize: 12}} name='star'/>}
            </View>

            <TouchableOpacity onPress={() => this.showDropDownn()} style={pickerStyle}>
                <ModalDropdown ref={'dropDown'}
                               style={styles.modalViewStyle}
                               options={options}
                               textStyle={{alignItems:'flex-start',fontSize: 20}}
                               onSelect={this.selectIos.bind(this)}
                               renderRow = {this.renderRow.bind(this)}
                               defaultValue={strings.PleaseSelect}
                               // defaultValue={options[0]}
                               showsVerticalScrollIndicator={true}
                />
                <Icon3 style={{right: 10, position: 'absolute', fontSize: 25, color: "black"}} name="chevron-down"/>


            </TouchableOpacity>
        </View>
    }

    render() {
        const {list, itemTitle, defaultHeader, isMandatory, defaultValue} = this.props;
        if (Platform.OS === 'ios') {
            return this.createIosRender();
        }
        let pickerStyle = styles.picker;
        if (this.state.invalid) {
            pickerStyle = styles.pickerInvalid;
        }
        return <View>
            <View style={styles.pickerTitleContainer}>
                {!I18nManager.isRTL && isMandatory && <Icon style={{margin: 5, color: 'red', fontSize: 12}} name='star'/>}
                <Text style={styles.pickerTextStyle}>{itemTitle}</Text>
                {I18nManager.isRTL && isMandatory && <Icon style={{margin: 5, color: 'red', fontSize: 12}} name='star'/>}
            </View>


            <Picker
                iosHeader={itemTitle}
                mode="dropdown"
                style={pickerStyle}
                selectedValue={this.state.type}
                onValueChange={this.selectPromotionType.bind(this)}
            >
                <Item
                    key={999}
                    value={''}
                    label={defaultHeader}/>

                {
                    list.map((s, i) => {
                        return <Item
                            key={i}
                            value={s.value}
                            label={s.label}/>
                    })}
            </Picker>
        </View>
    }
}

