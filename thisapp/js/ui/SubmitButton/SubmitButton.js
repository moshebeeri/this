import React, {Component} from 'react';
import {TouchableOpacity} from 'react-native';
import {Button, Icon, Input} from 'native-base';
import {ThisText} from '../../ui/index';
import withPreventDoubleClick from '../../ui/TochButton/TouchButton';
import StyleUtils from '../../utils/styleUtils'
const TouchableOpacityFix = withPreventDoubleClick(TouchableOpacity);

export default class SubmitButton extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const {disabled, title, color, onPress, disabledText, width, fontSize, height, textColor} = this.props;
        let bgc = color;
        let defaultTextColor = 'white';
        if (textColor) {
            defaultTextColor = textColor;
        }
        let buttonTitle = title;
        let defaultWidth =  StyleUtils.scale(100);
        if (width) {
            defaultWidth =  StyleUtils.scale(width);
        }
        if (disabled) {
            bgc = 'gray';
            defaultTextColor = 'white';
            if (disabledText) {
                buttonTitle = disabledText;
            }
        }
        let defaultHeight = StyleUtils.scale(40);
        if (height) {
            defaultHeight = StyleUtils.scale(height);
        }
        let defaultFontSize =  StyleUtils.scale(14);
        if (fontSize) {
            defaultFontSize =  StyleUtils.scale(fontSize);
        }
        return <TouchableOpacityFix disabled={disabled} style={{
            height: defaultHeight,
            width: defaultWidth,
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: defaultWidth / 4,
            backgroundColor: bgc
        }}
                                    onPress={onPress}>
            <ThisText style={{color: defaultTextColor, fontSize: defaultFontSize}}>{buttonTitle}</ThisText>
        </TouchableOpacityFix>
    }
}
