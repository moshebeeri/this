import React, {Component} from 'react';
import { View,Text} from 'react-native';
import {Item,Picker,Icon,Spinner} from 'native-base';

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

    render() {
        const {list, itemTitle, defaultHeader, isMandatory,defaultValue} = this.props;
        let value = this.state.type;
        if(!value){
            value = defaultValue;
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
                selectedValue={value}
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

