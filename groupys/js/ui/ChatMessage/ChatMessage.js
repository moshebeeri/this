/**
 * Created by roilandshut on 23/07/2017.
 */
/**
 * Created by roilandshut on 19/07/2017.
 */
import React, {Component} from 'react';
import {View} from 'react-native';
import {actions} from 'react-native-navigation-redux-helpers';
import {Button, Container, Footer, Icon, Thumbnail} from 'native-base';
import styles from './styles'
import DateUtils from '../../utils/dateUtils'
import {ThisText} from '../index'

let dateUtils = new DateUtils();
export default class ChatMessage extends Component {
    render() {
        const {item, wide} = this.props;
        const containerStyle = {
            marginTop: 10,
            marginLeft:10,
            marginRight:10,
            alignItems: 'flex-start',
            backgroundColor: 'white',
        };
        const messageTime = this.createMessageTime(item.date);
        let styleContainer = styles.messageUserName;
        if (wide) {
            styleContainer = styles.messageWideUserName;
        }
        if (item.isUser) {
            return <View style={containerStyle}>
                <View style={styles.messageUsercomponent}>


                    <View>
                        <View style={styleContainer}>
                            <ThisText style={styles.messageNameText}>{item.name}</ThisText>
                            <View style={styles.message_container_user}>
                                <ThisText numberOfLines={3} style={styles.messageText}>{item.message}</ThisText>

                            </View>
                        </View>
                        <View style={styles.dateUsercontainer}>
                            {messageTime}

                        </View>
                    </View>


                </View>


            </View>
        } else {
            return <View style={{
                marginTop: 10,
                marginLeft:10,
                marginRight:10,
                alignItems: 'flex-end',
                backgroundColor: 'white',
            }}>
                <View style={styles.messageComponent}>
                    <View>
                        <View style={styles.messageName}>
                            <ThisText style={styles.messageNameText}>{item.name}</ThisText>
                            <View style={styles.message_container}>
                                <ThisText numberOfLines={3} style={styles.messageText}>{item.message}</ThisText>

                            </View>
                        </View>
                        <View style={styles.dateContainer}>
                            {messageTime}

                        </View>
                    </View>



                </View>


            </View>
        }
    }

    shouldComponentUpdate() {
        return false;
    }

    createMessageTime(date) {
        if (date) {
            return <ThisText note
                             style={styles.dateFont}>{dateUtils.messageFormater(date)}</ThisText>
        }
        return undefined;
    }
}

