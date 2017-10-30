import React, {Component} from 'react';
import {Text,View,TouchableOpacity} from 'react-native';
import {Button, Input} from 'native-base';
import {Menu, MenuOption, MenuOptions, MenuTrigger,} from 'react-native-popup-menu';

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
        if(!messagesObject){
            return <View/>
        }
        const options = messagesObject.map(message => {
            return  <TouchableOpacity key={messageToString(message)} style={{height: 30, borderTopWidth: 0.5, backgroundColor: 'white'}}
                                            onPress={() => onMessage(message)} regular>

                <Text style={{
                    marginLeft: 10,
                    color: 'black',
                    fontStyle: 'normal',
                    fontSize: 18
                }}>{messageToString(message)}</Text>

            </TouchableOpacity>
        })
        return <View>{options}</View>
    }
}

