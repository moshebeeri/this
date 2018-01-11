/**
 * Created by roilandshut on 23/07/2017.
 */
/**
 * Created by roilandshut on 19/07/2017.
 */
import React, {Component} from 'react';
import {Image, Platform, TextInput, View} from 'react-native';
import {actions} from 'react-native-navigation-redux-helpers';
import {Button, Container, Footer, Icon, Text, Thumbnail} from 'native-base';
import styles from './styles'
import StyleUtils from '../../../../utils/styleUtils'
export default class FeedComment extends Component {
    render() {
        return this.createMessage(this.props.item)
    }

    createMessage(item) {
        const image = <Thumbnail square source={item.logo}/>
        const containerStyle = this.createContainerStyle(item);
        const messageStyle = this.createMessageStyle(item);
        const messageContainer = this.createMessageContainer(image, item, messageStyle)
        return <View style={containerStyle}>
            {messageContainer}
        </View>
    }

    createMessageContainer(image, item, messageStyle) {
        if (item.userMessage) {
            return <View style={[styles.messageContainer, {width: StyleUtils.getWidth()}]}>

                <View style={styles.messageName}>
                    <View style={{alignItems: 'flex-end', height: 30}}>
                        <Text>{item.name}</Text>
                    </View>
                    <View style={messageStyle}>
                        <Text numberOfLines={5} style={{
                            fontSize: 16,
                            flex: 0.4,
                            color: 'white',
                            textAlign: 'center',
                            flexWrap: 'wrap', marginLeft: 10
                        }}>{item.description}</Text>
                    </View>
                </View>
                {image}
            </View>
        }
        return <View style={[styles.messageContainer, {width: StyleUtils.getWidth()}]}>
            {image}
            <View style={styles.messageName}>
                <Text>{item.name}</Text>
                <View style={messageStyle}>
                    <Text>{item.description}</Text>
                </View>
            </View>

        </View>;
    }

    createContainerStyle(item) {
        if (item.userMessage) {
            return {
                margin: 10,
                alignItems: 'flex-end',
            };
        }
        return {
            margin: 10,
            alignItems: 'flex-start',
        };
        ;
    }

    createMessageStyle(item) {
        if (item.userMessage) {
            return {
                backgroundColor: '#26bac4',
                borderTopLeftRadius: 20,
                borderBottomRightRadius: 20,
                borderBottomLeftRadius: 20,
                padding: 10,
                flexDirection: 'column',
                flex: 0.6,
                maxWidth: 200
            };
        }
        return {
            backgroundColor: '#e7e7e7',
            borderTopRightRadius: 20,
            borderBottomRightRadius: 20,
            borderBottomLeftRadius: 20,
            padding: 10,
            flex: 0.6,
            flexDirection: 'column',
            maxWidth: 200
        };
    }
}

