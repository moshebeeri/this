import React, {Component} from 'react';
import { I18nManager } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

import {Button} from 'native-base';

export default class CloseDrawer extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        let arrowName = I18nManager.isRTL ? "ios-arrow-forward" : "ios-arrow-back";
        return <Button transparent onPress={() => this.props.onPress()}>
                    <Icon active={this.props.active} color={this.props.color} size={this.props.size} name={arrowName}/>
               </Button>
    }
}



