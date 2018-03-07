import React, {Component} from 'react';
import {View} from 'react-native';
import {Thumbnail} from 'native-base';
import styles from './styles';
import {ChatMessage, PromotionHeader, ThisText} from '../../../ui/index';
const noPic = require('../../../../images/client_1.png');
export default class GroupChat extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const {renderItem, user} = this.props;
        console.log('rendering' + renderItem.item.id);

        let item = renderItem.item;

        if (item.message) {


            if (!user) {
                return <View></View>
            }
            let isUser = item.message.actor === user._id;
            let messageItem = {
                name: item.message.name,
                avetar: item.message.logo,
                message: item.message.description,
                date: item.message.date,
                post: item.post,
                instance: item.instance,
                isUser: isUser
            };
            return <View style={{backgroundColor: '#E6E6E6', flex: 1}}>
                <ChatMessage key={item.id}
                             item={messageItem}/>
            </View>
        } else {
            return <View style={styles.comments_promotions}>
                {item.instance.promotion &&
                <PromotionHeader type={item.instance.promotion} feed titleText={item.instance.promotionTitle}
                                 titleValue={item.instance.promotionValue} term={item.instance.promotionTerm}/>}

                {item.instance.avetar &&
                <View style={{
                    flexDirection: 'row',
                    margin: 4,
                    borderRadius: 10,
                    backgroundColor: "#c9edf2",
                    height: 60,
                    width: width - 15
                }}>

                    <View style={{paddingLeft: 10, justifyContent: 'center'}}>
                        <Thumbnail small source={item.instance.avetar}/>
                    </View>
                    <View style={{paddingLeft: 20, justifyContent: 'center'}}>
                        <ThisText>{item.instance.name} {strings.Posted} </ThisText>
                        <ThisText>{item.instance.title}</ThisText>
                    </View>
                </View>
                }

            </View>
        }
    }

     createFeed(message) {
        let user = undefined
        if (message.activity) {
            user = message.activity.actor_user;
            message = message.activity;
        } else {
            user = message.user;
        }
        let name = user.phone_number;
        if (user.name) {
            name = user.name;
        }
        let response = {
            id: message._id,
            actor: user._id,
            showSocial: false,
            description: message.message,
            date: message.created,
        }
        if (user.pictures && user.pictures.length > 0) {
            response.logo = {
                uri: user.pictures[user.pictures.length - 1].pictures[0]
            }
        } else {
            response.logo = noPic;
        }
        response.name = name;
        response.itemType = 'MESSAGE';
        return response;
    }

    shouldComponentUpdate(){
        return false;
    }
}
