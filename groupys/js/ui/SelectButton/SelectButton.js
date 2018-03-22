import React, {Component} from 'react';
import {TouchableOpacity} from 'react-native';
import {Icon, Item, Picker, Spinner} from 'native-base';
import {ThisText} from '../../ui/index';
import styles from './styles'
import withPreventDoubleClick from '../../ui/TochButton/TouchButton';

const TouchableOpacityFix = withPreventDoubleClick(TouchableOpacity);
export default class SelectButton extends Component {
    constructor(props) {
        super(props);
        this.state = {
            type: '',
            valid: true,
        }
    }

    focus() {
        const {refNext} = this.props;
        this.refs[refNext].focus()
    }

    isValid() {
        const {selectedValue, isMandatory} = this.props;
        if (isMandatory) {
            if (!selectedValue) {
                this.setState({valid: false});
                return false;
            }
        }
        return true;
    }

    render() {
        const {title, action, client} = this.props;
        let buttonStyle = styles.buttonStyle;
        let textStyle = styles.buttonTextStyle;
        if (client) {
            buttonStyle = styles.buttonClientStyle;
            textStyle = styles.buttonClientTextStyle;
        }
        if (!this.state.valid) {
            buttonStyle = styles.buttonStyleInvalid;
            textStyle = styles.buttonTextStyleInvalid;
        }
        return <TouchableOpacityFix style={buttonStyle} onPress={action}>
            <ThisText style={textStyle}>{title}</ThisText>
        </TouchableOpacityFix>
    }
}

