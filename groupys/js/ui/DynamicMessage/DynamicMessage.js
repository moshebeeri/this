import React, {Component} from 'react';
import {Text,View} from 'react-native';
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
    // let locationFunction = this.chooseAddress.bind(this);
    // addressOptions = this.state.locations.map(function (address) {
    //     return <TouchableOpacity key={address.geometry.location.lat} style={{height: 30, borderTopWidth: 0.5, backgroundColor: 'white'}}
    //                              onPress={() => locationFunction(address)} regular>
    //
    //         <Text style={{
    //             marginLeft: 10,
    //             color: 'black',
    //             fontStyle: 'normal',
    //             fontSize: 18
    //         }}>{address.formatted_address}</Text>
    //
    //     </TouchableOpacity>
    // })

    render() {
        const {messagesObject, messageToString, onMessage} = this.props;
        if(!messagesObject){
            return <View/>
        }
        const menuOptions = messagesObject.map(message => {
            return <MenuOption key={messageToString(message)} onSelect={() => onMessage(message)}>
                <Text>{messageToString(message)}s</Text>
            </MenuOption>
        })
        return <Menu opened={true}>
            <MenuTrigger>

            </MenuTrigger>
            <MenuOptions>

                {menuOptions}

            </MenuOptions>
        </Menu>;
    }
}

