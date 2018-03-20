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
import {SubmitButton, ThisText} from '../index'
import Icon from 'react-native-vector-icons/EvilIcons';
import strings from "../../i18n/i18n"
import Ionicons from 'react-native-vector-icons/Ionicons';

let dateUtils = new DateUtils();
export default class ChatMessage extends Component {
    claim() {
        const {claim} = this.props;
        claim();
    }

    realize() {
        const {realize} = this.props;
        realize();
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
                                {item.instance && <View>
                                    <View style={{
                                        marginTop: 5,
                                        alignItems: 'flex-start',
                                        justifyContent: 'center'
                                    }}><ThisText style={{
                                        fontSize: 14,
                                        color: '#616F70'
                                    }}>{strings.CreatedByBusiness.formatUnicorn(item.instance.businessName)}</ThisText>
                                    </View>

                                    <View style={{
                                        borderBottomColor: '#E6E6E6',
                                        paddingTop: 2,
                                        marginTop: 10,

                                        paddingBottom: 10,
                                        paddingRight: 5,
                                        borderBottomWidth: 1,
                                        alignItems: 'flex-start', justifyContent: 'center',
                                        flexDirection: 'row'
                                    }}>
                                        <Icon active color={"#2db6c8"} size={25} name={'tag'}/>

                                        <ThisText style={{
                                            fontSize: 14,
                                            color: '#616F70',
                                            maxWidth:200
                                        }}>{item.instance.promotionTerm}</ThisText>
                                        {item.instance.showSave && <View style={{marginLeft: 10,}}>

                                            <SubmitButton fontSize={12} height={25} width={45}
                                                           title={strings.Claim.toUpperCase()} color={'#2db6c8'}
                                                          onPress={() => this.claim()}/>
                                        </View>}
                                        {!item.instance.isRealized && <View style={{marginLeft: 10,}}>

                                            <SubmitButton fontSize={12} height={25} width={65}
                                                          title={strings.Realize.toUpperCase()} color={'#2db6c8'}
                                                          onPress={() => this.realize()}/>
                                        </View>}
                                        {item.instance.isRealized && <View style={{marginLeft: 10,}}>

                                            <SubmitButton fontSize={12} height={25} width={75} disabled
                                                          title={strings.Realized.toUpperCase()} color={'#cccccc'}/>
                                        </View>}

                                    </View>
                                </View>}

                                {item.post && <View>
                                    <View style={{marginTop: 5}}><ThisText style={{
                                        fontSize: 14,
                                        color: '#616F70'
                                    }}>{strings.postMessage.formatUnicorn(item.post.name)}</ThisText>
                                    </View>

                                    <View style={{
                                        borderBottomColor: '#E6E6E6',
                                        paddingTop: 2,
                                        paddingLeft: 5,
                                        marginTop: 10,
                                        paddingBottom: 8,
                                        borderBottomWidth: 1,
                                        flexDirection: 'row'
                                    }}>
                                        <Ionicons size={25} style={{marginRight: 12,}} color={'#2db6c8'}
                                                  name="ios-person-outline"/>
                                        <ThisText style={{
                                            fontSize: 14,
                                            color: '#616F70',
                                            width: 200,
                                        }}>{item.post.feed.text}</ThisText></View>
                                </View>}
                                <View style={styles.message_container_user}>
                                    <ThisText numberOfLines={3} style={styles.messageText}>{item.message}</ThisText>


                                </View>


                            </View>

                        </View>
                        {item.instance ?
                            <View style={{marginRight: 14, alignItems: 'flex-end', justifyContent: 'flex-end'}}>
                                {messageTime}
                            </View> : <View style={{alignItems: 'flex-end', justifyContent: 'flex-end'}}>
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

                    <View style={styles.messageComponent}>


                        <View style={styles.messageName}>

                            <View>
                                {item.instance &&
                                <View>
                                    <View style={{
                                        marginTop: 5,
                                        alignItems: 'flex-start',
                                        justifyContent: 'center'
                                    }}><ThisText style={{
                                        fontSize: 14,
                                        color: 'white'
                                    }}>{strings.CreatedByBusiness.formatUnicorn(item.instance.businessName)}</ThisText>
                                    </View>
                                    <View style={{
                                        borderBottomColor: 'white',
                                        paddingTop: 2,
                                        paddingRight: 5,
                                        marginTop: 10,
                                        paddingBottom: 10,

                                        borderBottomWidth: 1,
                                        flexDirection: 'row'
                                    }}>
                                        <Icon active color={"white"} size={25} name={'tag'}/>
                                        <ThisText style={{
                                            fontSize: 14,
                                            color: 'white',
                                            maxWidth:200
                                        }}>{item.instance.promotionTerm}</ThisText>


                                        {item.instance.showSave && <View style={{marginLeft: 10,}}>

                                            <SubmitButton fontSize={12} height={25} width={45}
                                                          title={strings.Claim.toUpperCase()} textColor={'#2db6c8'}
                                                          color={'white'}
                                                          onPress={() => this.claim()}/>
                                        </View>}
                                        {!item.instance.isRealized && <View style={{marginLeft: 10,}}>

                                            <SubmitButton fontSize={12} height={25} width={65}
                                                          title={strings.Realize.toUpperCase()} textColor={'#2db6c8'}
                                                          color={'white'}
                                                          onPress={() => this.realize()}/>
                                        </View>}
                                        {item.instance.isRealized && <View style={{marginLeft: 10,}}>

                                            <SubmitButton fontSize={12} height={25} width={75} disabled
                                                          title={strings.Realized.toUpperCase()} textColor={'#2db6c8'}
                                                          color={'#cccccc'}/>
                                        </View>}
                                    </View>

                                </View>}
                                {item.post &&
                                <View>
                                    <View style={{marginTop: 5}}><ThisText style={{
                                        fontSize: 14,
                                        color: 'white'
                                    }}>{strings.postMessage.formatUnicorn(item.post.name)}</ThisText>
                                    </View>
                                    <View style={{
                                        borderBottomColor: 'white',
                                        paddingTop: 2,
                                        paddingLeft: 5,
                                        borderBottomWidth: 1,
                                        paddingBottom: 8,
                                        flexDirection: 'row'
                                    }}>
                                        <Ionicons size={25} style={{marginRight: 12,}} color={'white'}
                                                  name="ios-person-outline"/>
                                        <ThisText style={{
                                            fontSize: 14,
                                            color: 'white',
                                            width: 200,
                                        }}>{item.post.feed.text}</ThisText></View>
                                </View>}

                                <View style={styles.message_container}>
                                    <ThisText numberOfLines={3}
                                              style={styles.messageTextWhite}>{item.message}</ThisText>


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
                <View style={{marginRight: 8, alignItems: 'flex-end', justifyContent: 'flex-end'}}>
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

