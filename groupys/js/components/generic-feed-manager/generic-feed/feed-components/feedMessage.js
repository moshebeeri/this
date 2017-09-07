/**
 * Created by roilandshut on 23/07/2017.
 */
/**
 * Created by roilandshut on 19/07/2017.
 */
import React, { Component } from 'react';
import { Image,TextInput, Platform,View} from 'react-native';

import { connect } from 'react-redux';
import { actions } from 'react-native-navigation-redux-helpers';
import { Container,Footer,Icon,Button,Thumbnail,Text } from 'native-base';
import styles from './styles'
import DateUtils from '../../../../utils/dateUtils'
let dateUtils = new DateUtils();

export default class FeedMessage extends Component {




    render(){
        return this.createMessage(this.props.item)
    }

    createMessage(item){
        const image =  <Thumbnail  medium    source={item.logo}/>

        const containerStyle = {
            margin:5,
            alignItems:'flex-start',
            backgroundColor:'#ebebeb',
        };

        const messageTime = this.createMessageTime(item);
        const messageContainer = <View style={styles.message_component}>
            {image}
            <View style={styles.messageName}>
                <Text style={{  fontWeight: 'bold'}}>{item.name}</Text>
                <View style={styles.message_container}>
                    <Text>{item.description}</Text>

                </View>
            </View>
            <View style={styles.date_container}>
                {messageTime}
            </View>


        </View>


        return <View style = {containerStyle}>
            {messageContainer}
        </View>
    }

    createMessageTime(item) {

        if (item.date) {
           return <Text note
                                style={styles.dateFont}>{dateUtils.messageFormater(item.date)}</Text>

        }
        return undefined;
    }
}

