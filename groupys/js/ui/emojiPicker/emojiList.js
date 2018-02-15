import React, {Component} from 'react';
import {Dimensions, I18nManager, TextInput,TouchableOpacity, View,ScrollView} from 'react-native';
import {Icon, Input, Text} from 'native-base';
import {ThisText} from '../index';
const {width, height} = Dimensions.get('window');
export default class EmojiList extends Component {
    constructor(props) {
        super(props);
    }

    onEmojiSelect(emoji) {
        this.props.onEmojiSelect(emoji)
    }

    render() {
        const {emojis} = this.props;
        return <ScrollView>
            <View style={{flexDirection: 'row', alignSelf: 'stretch', flexWrap: 'wrap'}}>
                {
                    emojis.map((emoji, index) => (
                        <TouchableOpacity style={{
                            height: 40,
                            flexDirection: 'row',
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}
                                          key={index}
                                          onPress={() => {
                                              this.onEmojiSelect(emoji)
                                          }}>
                            <ThisText style={{height: 37, fontSize: 30}} key={index}>{emoji}</ThisText>
                        </TouchableOpacity>
                    ))
                }
            </View>
        </ScrollView>
    }
}
