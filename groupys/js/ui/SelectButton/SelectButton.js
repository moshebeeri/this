import React, {Component} from 'react';
import { View,Text,TouchableOpacity} from 'react-native';
import {Item,Picker,Icon,Spinner} from 'native-base';

import styles from './styles'

export default class SelectButton extends Component {
    constructor(props) {
        super(props);
        this.state = {
            type: ''
        }
    }


    focus() {
        const {refNext} = this.props;
        this.refs[refNext].focus()
    }


    render() {
        const {title, action,} = this.props;

        return <TouchableOpacity style={styles.buttonStyle} onPress={action}>
                    <Text style={styles.buttonTextStyle}>{title}</Text>
        </TouchableOpacity>
    }
}

