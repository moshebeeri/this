/**
 * Created by roilandshut on 23/07/2017.
 */
/**
 * Created by roilandshut on 19/07/2017.
 */
import React, {Component} from 'react';
import {View} from 'react-native';
import {actions} from 'react-native-navigation-redux-helpers';
import {Button, Container, Footer, Icon, Text, Thumbnail} from 'native-base';
import styles from './styles'
import DateUtils from '../../utils/dateUtils'
import {ImageController} from '../index'
let dateUtils = new DateUtils();
export default class ChatMessage extends Component {
    render() {
        const {item,wide} = this.props;
        const image = <ImageController thumbnail size={40} source={item.avetar}/>
        const containerStyle = {
            marginTop: 10,
            alignItems: 'flex-start',
            backgroundColor: 'white',
        };
        const messageTime = this.createMessageTime(item.date);
        let styleContainer = styles.messageUserName;
        if(wide){
            styleContainer = styles.messageWideUserName;
        }
        if (item.isUser) {
            return <View style={containerStyle}>
            <View style={styles.messageUsercomponent}>

                <View style={{
                    justifyContent: 'flex-start',
                    alignItems: 'flex-start',
                    height: 45,
                    width: 45,
                    backgroundColor: '#0699dc'
                }}>
                    <View style={{
                        width: 45,
                        height: 45,
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: 'white',
                        borderTopRightRadius: 15
                    }}>
                        {image}

                    </View>

                </View>
                <View>
                <View style={styleContainer}>
                    <Text style={styles.messageNameText}>{item.name}</Text>
                    <View style={styles.message_container}>
                        <Text numberOfLines={3} style={styles.messageText}>{item.message}</Text>

                    </View>
                </View>
                <View style={styles.dateUsercontainer}>
                    {messageTime}

                </View>
                </View>


            </View>


            </View>
        } else {
            return <View style={ {
                marginTop: 10,
                alignItems: 'flex-end',
                backgroundColor: 'white',
            }}>
                <View style={styles.messageComponent}>
                    <View>
                    <View style={styles.messageName}>
                        <Text style={styles.messageNameText}>{item.name}</Text>
                        <View style={styles.message_container}>
                            <Text numberOfLines={3} style={styles.messageText}>{item.message}</Text>

                        </View>
                    </View>
                    <View style={styles.dateContainer}>
                        {messageTime}

                    </View>
                    </View>

                    <View style={{
                        justifyContent: 'flex-end',
                        alignItems: 'flex-end',
                        height: 45,
                        width: 45,
                        backgroundColor: '#0699dc'
                    }}>
                        <View style={{
                            width: 45,
                            height: 45,
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: 'white',
                            borderTopLeftRadius: 15
                        }}>
                            {image}

                        </View>
                    </View>

                </View>


            </View>
        }
    }

    createMessageTime(date) {
        if (date) {
            return <Text note
                         style={styles.dateFont}>{dateUtils.messageFormater(date)}</Text>
        }
        return undefined;
    }
}

