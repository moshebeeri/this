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

        };

        let messageStyle = {
            backgroundColor:'#e7e7e7',
            borderTopRightRadius:20,
            borderBottomRightRadius:20,
            borderBottomLeftRadius:20,
            padding:10,
            flex: 0.6,
            flexDirection: 'column',
            maxWidth:200

        };

        let messageContainer = <View style={styles.messageContainer}>
            {image}
            <View style={styles.messageName}>
                <Text>{item.name}</Text>
                <View style={messageStyle}>
                    <Text>{item.description}</Text>
                </View>
            </View>

        </View>

        if(item.userMessage){
            containerStyle = {
                margin:10,
                alignItems:'flex-end',

            };
            messageStyle = {
                backgroundColor:'#26bac4',
                borderTopLeftRadius:20,
                borderBottomRightRadius:20,
                borderBottomLeftRadius:20,
                padding:10,
                flexDirection: 'column',
                flex: 0.6,
                maxWidth:200
            };

            messageContainer =  <View style={styles.messageContainer}>

                <View style={styles.messageName}>
                    <View style={{alignItems:'flex-end',height:30}}>
                        <Text>{item.name}</Text>
                    </View>
                    <View style={messageStyle}>
                        <Text  numberOfLines={5} style={{fontSize: 16,
                            flex: 0.4,
                            color: 'white',
                            textAlign: 'center',
                            flexWrap: 'wrap',marginLeft:10}}>{item.description}</Text>
                    </View>
                </View>
                {image}
            </View>

        }
        return <View style = {containerStyle}>
            {messageContainer}
        </View>
    }
}

