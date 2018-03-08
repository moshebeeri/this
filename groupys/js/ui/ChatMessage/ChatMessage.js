/**
 * Created by roilandshut on 23/07/2017.
 */
/**
 * Created by roilandshut on 19/07/2017.
 */
import React, {Component} from 'react';
import {View} from 'react-native';
import {actions} from 'react-native-navigation-redux-helpers';
import {Button, Container, Footer, Thumbnail} from 'native-base';
import styles from './styles'
import DateUtils from '../../utils/dateUtils'
import {ThisText} from '../index'
import Icon from 'react-native-vector-icons/EvilIcons';
import Icon2 from 'react-native-vector-icons/MaterialIcons'
import {Menu, MenuOption, MenuOptions, MenuTrigger,} from 'react-native-popup-menu';
import strings from "../../i18n/i18n"

let dateUtils = new DateUtils();
export default class ChatMessage extends Component {

    reply(){

    }

    claim(){

    }
    render() {
        const {item, wide} = this.props;
        const containerStyle = {
            marginTop: 10,
            marginLeft: 10,
            marginRight: 10,
            alignItems: 'flex-start',
            backgroundColor: '#E6E6E6',
        };
        const messageTime = this.createMessageTime(item.date, item.isUser);
        let styleContainer = styles.messageUserName;
        if (wide) {
            styleContainer = styles.messageWideUserName;
        }

        let replayMenu = <Menu>
            <MenuTrigger >
                <Icon2 active color={"#90a1a2"} size={25} name={'touch-app'}/>
    </MenuTrigger>
        <MenuOptions>

            <MenuOption onSelect={this.reply.bind(this)}>
                <ThisText style={{color: '#616F70'}}>{strings.Reply}</ThisText>
            </MenuOption>
            <MenuOption onSelect={this.claim.bind(this)}>
            <ThisText style={{color: '#616F70'}}>{strings.Claim}</ThisText>
    </MenuOption>


    </MenuOptions>
    </Menu>;
        if (!item.isUser) {
            return <View style={containerStyle}>
                <View style={styles.messageUsercomponent}>


                    <View>
                        <View style={styles.dateUsercontainer}>
                            <ThisText style={{color: '#616F70'}}>{item.name}</ThisText>

                        </View>
                        <View style={{flexDirection: 'row'}}>
                            <View style={{
                                justifyContent: 'flex-start',
                                alignItems: 'flex-start',
                                height: 15,
                                width: 10,
                                backgroundColor: 'white'
                            }}>
                                <View style={{
                                    width: 10,
                                    height: 15,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    backgroundColor: '#E6E6E6',
                                    borderTopRightRadius: 10
                                }}>


                                </View>

                            </View>
                            <View style={styleContainer}>

                                <View style={styles.message_container_user}>
                                    <ThisText numberOfLines={3} style={styles.messageText}>{item.message}</ThisText>

                                    {item.instance && <View style={{
                                        borderTopColor: '#E6E6E6',
                                        paddingTop: 2,
                                        marginTop: 10,
                                        borderTopWidth: 1,
                                        flexDirection:'row'
                                    }}>
                                        <Icon active color={"#2db6c8"} size={25} name={'tag'}/>
                                        <ThisText style={{
                                        fontSize: 14,
                                        color: '#616F70'
                                    }}>{item.instance.promotionTerm}</ThisText></View>}

                                </View>


                            </View>
                            {item.instance && <View style={{marginLeft:4,alignItems: 'center', justifyContent: 'center'}}>
                                {replayMenu}
                            </View>}
                        </View>
                        {item.instance ? <View style={{marginRight:14,alignItems: 'flex-end', justifyContent: 'flex-end'}}>
                            {messageTime}
                        </View> :  <View style={{alignItems: 'flex-end', justifyContent: 'flex-end'}}>
                            {messageTime}
                        </View>}

                    </View>

                </View>


            </View>
        } else {
            return <View style={{
                marginTop: 10,
                marginLeft: 10,
                marginRight: 10,
                alignItems: 'flex-end',
                backgroundColor: '#E6E6E6',
            }}>
                <View style={{flexDirection: 'row'}}>
                    {item.instance && <View style={{marginRight:4,alignItems: 'center', justifyContent: 'center'}}>
                        {replayMenu}
                    </View>}
                    <View style={styles.messageComponent}>


                            <View style={styles.messageName}>

                                <View>

                                <View style={styles.message_container}>
                                    <ThisText numberOfLines={3}
                                              style={styles.messageTextWhite}>{item.message}</ThisText>

                                    {item.instance && <View style={{
                                        borderTopColor: 'white',
                                        paddingTop: 2,
                                        marginTop: 10,
                                        borderTopWidth: 1,

                                        flexDirection:'row'
                                    }}>
                                        <Icon active color={"white"} size={25} name={'tag'}/>
                                        <ThisText style={{
                                        fontSize: 14,
                                        color: 'white'
                                    }}>{item.instance.promotionTerm}</ThisText></View>}

                                </View>

                            </View>

                        </View>


                    </View>

                    <View style={{
                        justifyContent: 'flex-end',
                        alignItems: 'flex-end',
                        height: 10,
                        width: 15,
                        backgroundColor: '#2db6c8'
                    }}>
                        <View style={{
                            height: 10,
                            width: 15,
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: '#E6E6E6',
                            borderTopLeftRadius: 10
                        }}>

                        </View>
                    </View>

                </View>
                <View style={{marginRight:8,alignItems: 'flex-end', justifyContent: 'flex-end'}}>
                    {messageTime}
                </View>
            </View>
        }
    }

    shouldComponentUpdate() {
        return false;
    }

    createMessageTime(date, isUser) {
        if (date) {
            return <ThisText note
                             style={styles.timeText}>{dateUtils.messageFormater(date)}</ThisText>

        }
        return undefined;
    }
}

