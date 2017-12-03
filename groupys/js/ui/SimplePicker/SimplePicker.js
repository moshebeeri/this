import React, {Component} from 'react';
import {Platform, Text, TouchableOpacity, View} from 'react-native';
import {Icon, Item, Picker, Spinner} from 'native-base';
import ModalDropdown from 'react-native-modal-dropdown';
import Icon3 from 'react-native-vector-icons/EvilIcons';
import styles from './styles'

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
            type: options[value],
        })
        onValueSelected(options[value])
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

    createIosRender() {
        const {list, itemTitle, defaultHeader, isMandatory, defaultValue} = this.props;
        let options = list.map((s) => {
            return s.label;
        })
        return <View>
            <View style={styles.pickerTitleContainer}>
                <Text style={styles.pickerTextStyle}>{itemTitle}</Text>
                {isMandatory && <Icon style={{margin: 5, color: 'red', fontSize: 12}} name='star'/>}
            </View>

            <TouchableOpacity onPress={() => this.showDropDownn()} style={styles.modalView}>
                <ModalDropdown ref={'dropDown'}
                               style={styles.modalViewStyle}
                               options={options}
                               textStyle={{fontSize: 20}}
                               onSelect={this.selectIos.bind(this)}
                               defaultValue={options[0]}
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
                <Text style={styles.pickerTextStyle}>{itemTitle}</Text>
                {isMandatory && <Icon style={{margin: 5, color: 'red', fontSize: 12}} name='star'/>}
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

