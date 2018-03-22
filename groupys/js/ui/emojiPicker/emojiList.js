import React, {Component} from 'react';
import {ScrollView, TouchableOpacity, View} from 'react-native';
import {Icon, Input} from 'native-base';
import {ThisText} from '../index';
import withPreventDoubleClick from '../../ui/TochButton/TouchButton';

const TouchableOpacityFix = withPreventDoubleClick(TouchableOpacity);
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
                        <TouchableOpacityFix style={{
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
                        </TouchableOpacityFix>
                    ))
                }
            </View>
        </ScrollView>
    }
}
