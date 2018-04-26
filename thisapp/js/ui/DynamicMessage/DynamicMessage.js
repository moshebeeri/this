import React, {Component} from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import withPreventDoubleClick from '../../ui/TochButton/TouchButton';

const TouchableOpacityFix = withPreventDoubleClick(TouchableOpacity);
import {Button, Input} from 'native-base';
import {ThisText} from '../index';
export default class DynamicMessage extends Component {
    constructor(props) {
        super(props);
    }

    focus() {
        const {refNext} = this.props;
        this.refs[refNext].focus()
    }

    render() {
        const {messagesObject, messageToString, onMessage} = this.props;
        if (!messagesObject) {
            return <View/>
        }
        const options = messagesObject.map(message => {
            return <TouchableOpacityFix key={messageToString(message)}
                                     style={{height: 30, borderTopWidth: 0.5, backgroundColor: 'white'}}
                                     onPress={() => onMessage(message)} regular>

                <ThisText style={{
                    marginLeft: 10,
                    color: 'black',
                    fontStyle: 'normal',
                    fontSize: 18
                }}>{messageToString(message)}</ThisText>

            </TouchableOpacityFix>
        })
        return <View>{options}</View>
    }
}
