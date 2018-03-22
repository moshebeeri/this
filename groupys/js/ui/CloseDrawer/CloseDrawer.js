import React, {Component} from 'react';
import { I18nManager,TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

import {Button} from 'native-base';
import withPreventDoubleClick from '../../ui/TochButton/TouchButton';

const TouchableOpacityFix = withPreventDoubleClick(TouchableOpacity);
export default class CloseDrawer extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        let arrowName = I18nManager.isRTL ? "ios-arrow-forward" : "ios-arrow-back";
        return <TouchableOpacityFix style={{width:40,alignItems:'flex-end',marginLeft:5,marginRight:5}} transparent onPress={() => this.props.onPress()}>
                    <Icon active={this.props.active} color={this.props.color} size={this.props.size} name={arrowName}/>
               </TouchableOpacityFix>
    }
}




