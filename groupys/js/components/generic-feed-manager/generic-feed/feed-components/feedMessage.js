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


export default class FeedMessage extends Component {




    render(){
        return this.createMessage(this.props.item)
    }

    createMessage(item){
        let image =  <Thumbnail  square   source={item.logo}/>

        let containerStyle = {
            margin:10,
            alignItems:'flex-start',
            backgroundColor:'#ebebeb',
        };

        let messageStyle = {



            flexDirection: 'column',


        };

        let messageContainer = <View style={styles.message_Container}>
            {image}
            <View style={styles.messageName}>
                <Text style={{  fontWeight: 'bold'}}>{item.name}</Text>
                <View style={messageStyle}>
                    <Text>{item.description}</Text>
                </View>
            </View>

        </View>


        return <View style = {containerStyle}>
            {messageContainer}
        </View>
    }
}

