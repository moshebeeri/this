import React, {Component} from 'react';
import {I18nManager, Platform, Text, TouchableOpacity, View,} from 'react-native';
import {Icon, Item, Picker, Spinner} from 'native-base';
import ModalDropdown from 'react-native-modal-dropdown';
import Icon3 from 'react-native-vector-icons/EvilIcons';
import styles from './styles'
import strings from "../../i18n/i18n";
import StyleUtils from "../../utils/styleUtils";
import {ThisText,TextInput} from '../../ui/index';

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
        });
        onValueSelected(value)
    }

    selectIos(value) {
        const {onValueSelected, list} = this.props;
        let options = list.map((s) => {
            return s.value;
        });
        this.setState({
            type: options[value - 1],
        });
        onValueSelected(options[value - 1])
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
                });
                return false
            }
        }
        return true;
    }

    renderRow(value) {
        return <View style={{justifyContent: 'flex-start', alignItems: 'flex-end'}}><ThisText
            style={{paddingLeft: 10, paddingRight: 10, fontSize: 14}}>{value}</ThisText></View>
    }

    createIosRender() {
        const {list, itemTitle, defaultHeader, isMandatory, defaultValue, value, disable} = this.props;
        let options = list.map((s) => {
            return s.label;
        });
        let pickerStyle = styles.modalView;
        if (this.state.invalid) {
            pickerStyle = styles.modalViewInvalid;
        }
        options.unshift(defaultValue);
        let selectValue = strings.PleaseSelect;
        if (value) {
            selectValue = value
        }
        return <View>
            <View style={[styles.pickerTitleContainer, {width: StyleUtils.getWidth() - 15}]}>

                <ThisText style={styles.pickerTextStyle}>{itemTitle}</ThisText>
                {isMandatory && <Icon style={{margin: 5, color: 'red', fontSize: 12}} name='star'/>}
            </View>
            {disable ? <View style={[pickerStyle, {
                    backgroundColor: '#cccccc',
                    width: StyleUtils.getWidth() - 20
                }]}><ThisText>{selectValue}</ThisText></View> :
                <TouchableOpacity onPress={() => this.showDropDownn()}
                                  style={[pickerStyle, {width: StyleUtils.getWidth() - 20}]} s>
                    <ModalDropdown ref={'dropDown'}
                                   style={[styles.modalViewStyle, {width: StyleUtils.getWidth() - 20}]}
                                   options={options}
                                   textStyle={{alignItems: 'flex-end', fontSize: 20}}
                                   onSelect={this.selectIos.bind(this)}
                                   renderRow={this.renderRow.bind(this)}
                                   defaultValue={selectValue}

                                   showsVerticalScrollIndicator={true}
                    />
                    <Icon3 style={{right: 10, position: 'absolute', fontSize: 25, color: "black"}} name="chevron-down"/>


                </TouchableOpacity>
            }
        </View>
    }

    componentWillMount(){
        const {selectedValue,onValueSelected} =  this.props;
        if(selectedValue){
            if (Platform.OS === 'ios') {
                this.setState({
                    type:selectedValue,
                });
                onValueSelected(selectedValue)
            }else {
                this.selectPromotionType(selectedValue);
            }
        }


    }
    render() {
        const {list, value, itemTitle, defaultHeader, isMandatory, defaultValue, disable} = this.props;
        if (Platform.OS === 'ios') {
            return this.createIosRender();
        }
        let pickerStyle = styles.picker;
        if (this.state.invalid) {
            pickerStyle = styles.pickerInvalid;
        }
        let selectedValue = this.state.type;
        if (value && !selectedValue) {
            let valueType = list.filter( listValue => listValue.label === value)
            if(valueType.length > 0){
                selectedValue = valueType[0].value;
            }


        }
        let enable = true;
        if (disable) {
            enable = false;
        }
        return <View>
            <View style={styles.pickerTitleContainer}>
                <ThisText style={styles.pickerTextStyle}>{itemTitle}</ThisText>
                {isMandatory && <Icon style={{margin: 5, color: 'red', fontSize: 12}} name='star'/>}
            </View>

            {disable ?   <View style={[styles.pickerTitleContainer, {alignItems:'center',backgroundColor:'#cccccc',height:40,width: StyleUtils.getWidth() - 15}]}>
                    <ThisText style={styles.pickerTextStyle}>{selectedValue}</ThisText></View> :
                <Picker
                    iosHeader={itemTitle}
                    mode="dropdown"
                    enabled={enable}
                    style={pickerStyle}
                    selectedValue={selectedValue}
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
            }
        </View>
    }
}

