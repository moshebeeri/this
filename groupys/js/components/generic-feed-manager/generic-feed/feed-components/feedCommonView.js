/**
 * Created by roilandshut on 07/09/2017.
 */


import React, {Component} from 'react';
import {Image ,Platform,PanResponder,TouchableHighlight,TouchableOpacity,Dimensions } from 'react-native';
import {connect} from 'react-redux';
import {actions} from 'react-native-navigation-redux-helpers';
import { Container, Content, Text, InputGroup, Input,Thumbnail,Button,Picker,Right,Item,Left,Header,Footer,Body, View,Card,CardItem } from 'native-base';

const {width, height} = Dimensions.get('window')

const   vw = width/100;
const  vh = height/100
const vmin = Math.min(vw, vh);
const vmax = Math.max(vw, vh);

import Icon from 'react-native-vector-icons/FontAwesome';
import Icon2 from 'react-native-vector-icons/EvilIcons';

import stylesPortrate from './styles'
import stylesLandscape from './styles_lendscape'
import StyleUtils from '../../../../utils/styleUtils'

export function createSaveButton(item, save) {

    if (item.showsave) {
        const saveStyle = {
            flex: -1,
            justifyContent: 'center',
            marginLeft: 20,
            flexDirection: 'row',
            height: 40,
            width: 100,
            backgroundColor: item.promotionColor,
        };
        return <Button style={saveStyle} onPress={() => save(item.id)}>


            <Text>save</Text>


        </Button>
    }
    const saveStyle = {
        flex: -1,
        justifyContent: 'center',
        marginLeft: 20,
        flexDirection: 'row',
        height: 40,
        width: 100,
        backgroundColor: 'gray',
    };


    return  <Button style={saveStyle}>


        <Text>saved</Text>


    </Button>;

}

export function createShareButton(styles, showUsers, item) {
    const shares = new String(item.social.shares);
    if (item.social.share) {
        return <Button transparent style={styles.promotion_iconView} onPress={showUsers}>

            <Icon2 style={styles.promotion_share} size={30} name="share-google"/>
            <Text>{shares}</Text>


        </Button>
    }
    return <Button transparent style={styles.promotion_iconView} onPress={showUsers}>

        <Icon2 style={styles.promotion_comment} size={30} name="share-google"/>
        <Text>{shares}</Text>
    </Button>;
}

export function createCommentButton(styles, comment,item) {
    return <Button transparent style={styles.promotion_iconView} onPress={comment}>
        <Icon2 style={styles.promotion_comment} size={30} name="comment"/>
        <Text>0</Text>
    </Button>;
}

export function createStyle() {
    if (StyleUtils.isLandscape()) {
        return  stylesLandscape;
    }
    return stylesPortrate;
}

export function createLikeButton(item,styles,like,unlike){
    const likes = new String(item.social.numberLikes);
    if (item.social && item.social.like == true) {
        return <Button transparent style={styles.promotion_iconView} onPress={() => unlike(item.id)}>


            <Icon  style={styles.promotion_like} size={25} name="heart"/>
            <Text>{likes}</Text>

        </Button>


    }
    return <Button transparent style={styles.promotion_iconView} onPress={() => like(item.id)}>

        <Icon style={styles.promotion_unlike}  size={25} name="heart"/>
        <Text>{likes}</Text>

    </Button>

}
export function createBusinessLog(item,showBussines){
    if(item.businessLogo){
        return <TouchableOpacity onPress={showBussines}>
            <View>
                <Thumbnail  square={true} size={40} source={{uri: item.businessLogo}} />
            </View>
        </TouchableOpacity>

    }
    return undefined;
}