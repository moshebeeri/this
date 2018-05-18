import React, {Component} from 'react';
import {TouchableOpacity} from 'react-native';
import Icon2 from 'react-native-vector-icons/MaterialIcons';
import {Button} from 'native-base';
import StyleUtils from '../../utils/styleUtils'
import withPreventDoubleClick from '../../ui/TochButton/TouchButton';

const TouchableOpacityFix = withPreventDoubleClick(TouchableOpacity);
export default class EditButton extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const {onPress, iconName, touchSize, size, color} = this.props;
        let name = "edit";
        if (iconName) {
            name = iconName;
        }
        let defaultColor = 'white'
        if (color) {
            defaultColor = color;
        }
        let style = {};
        let defaultSize = StyleUtils.scale(20);
        if (size) {
            defaultSize = StyleUtils.scale(size);
        }
        if (touchSize) {
            style = {height: StyleUtils.scale(touchSize), width: StyleUtils.scale(touchSize)};
        }
        return <TouchableOpacityFix style={style}
                                    onPress={onPress}>
            <Icon2 size={defaultSize} style={{color: defaultColor}} name={name}/>
        </TouchableOpacityFix>
    }
}




