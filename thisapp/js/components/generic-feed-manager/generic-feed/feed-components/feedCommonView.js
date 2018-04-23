/**
 * Created by roilandshut on 07/09/2017.
 */
import React, {Component} from 'react';
import {Dimensions, Image, PanResponder, Platform, TouchableHighlight, TouchableOpacity} from 'react-native';
import {actions} from 'react-native-navigation-redux-helpers';
import {
    Button,
    Card,
    CardItem,
    Container,
    Content,
    Footer,
    Header,
    Input,
    InputGroup,
    Item,
    Left,
    Picker,
    Right,
    Thumbnail,
    View
} from 'native-base';
import Icon from 'react-native-vector-icons/FontAwesome';
import Icon2 from 'react-native-vector-icons/EvilIcons';
import stylesPortrate from './styles'
import {ThisText} from '../../../../ui/index';

const {width, height} = Dimensions.get('window')
const vw = width / 100;
const vh = height / 100
const vmin = Math.min(vw, vh);
const vmax = Math.max(vw, vh);

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
        return (
            <Button style={saveStyle} onPress={() => save(item.id)}>
                <ThisText>Strings.Save</ThisText>
            </Button>
        )
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
    return <Button style={saveStyle}>


        <ThisText>strings.saved</ThisText>


    </Button>;
}

export function createShareButton(styles, showUsers, item) {
    if (!item.social) {
        return undefined;
    }
    const shares = new String(item.social.shares);
    if (item.social.share) {
        return <Button transparent style={styles.promotion_iconView} onPress={showUsers}>

            <Icon2 style={styles.promotion_share} size={30} name="share-google"/>
            <ThisText>{shares}</ThisText>


        </Button>
    }
    return <Button transparent style={styles.promotion_iconView} onPress={showUsers}>

        <Icon2 style={styles.promotion_comment} size={30} name="share-google"/>
        <ThisText>{shares}</ThisText>
    </Button>;
}

export function createCommentButton(styles, comment, item) {
    return <Button transparent style={styles.promotion_iconView} onPress={comment}>
        <Icon2 style={styles.promotion_comment} size={30} name="comment"/>
        <ThisText>0</ThisText>
    </Button>;
}

export function createStyle() {
    return stylesPortrate;
}

export function createLikeButton(item, styles, like, unlike, token) {
    if (!item.social) {
        return undefined;
    }
    const likes = new String(item.social.numberLikes);
    if (item.social && item.social.like === true) {
        return <Button transparent style={styles.promotion_iconView} onPress={() => unlike(item.id, token)}>


            <Icon style={styles.promotion_like} size={25} name="heart"/>
            <ThisText>{likes}</ThisText>

        </Button>
    }
    return <Button transparent style={styles.promotion_iconView} onPress={() => like(item.id, token)}>

        <Icon style={styles.promotion_unlike} size={25} name="heart"/>
        <ThisText>{likes}</ThisText>

    </Button>
}

export function createBusinessLog(item, showBusiness) {
    if (item.businessLogo) {
        return <TouchableOpacity onPress={showBusiness}>
            <View>
                <Thumbnail square={true} size={40} source={{uri: item.businessLogo}}/>
            </View>
        </TouchableOpacity>
    }
    return undefined;
}