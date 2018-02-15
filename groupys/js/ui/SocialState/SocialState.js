import React, {Component} from 'react';
import { Text, TouchableOpacity, View} from 'react-native';
import {Button} from 'native-base';
import styles from './styles'
import StyleUtils from "../../utils/styleUtils";
import {ImageController} from '../index'
const like_icon = require('../../../images/Like.png');
const comments_icon = require('../../../images/Comment.png');
const user_like_icon = require('../../../images/user_like.png');
const share_icon = require('../../../images/share.png');
import {ThisText} from '../../ui/index';

export default class SocialState extends Component {
    constructor(props) {
        super(props);
        this.state = {
            type: '',
            valid: true,
        }
    }

    isValid() {
        return true;
    }

    render() {
        return <View style={[styles.socialContainer, {width: StyleUtils.getWidth()}]}>

            {this.createLikeButton()}
            {this.createCommentButton()}
            {this.createShareButton()}
        </View>
    }

    createCommentButton() {
        const {comments, disabled, onPressComment, feed} = this.props;
        let componentStyle = styles.promotionBusiness;
        if (feed) {
            componentStyle = styles.promotionFeed;
        }
        let componenColor = '#e19c73';
        if (feed) {
            componenColor = '#2db6c8';
            if (disabled) {
                componenColor = '#cccccc';
            }
        }
        if (disabled) {
            return <View transparent style={styles.promotion_iconView}>
                <ImageController style={{tintColor: componenColor, marginRight: 10, width: 30, height: 25}}
                       source={comments_icon}/>
                <ThisText style={styles.socialTextColor}>{comments}</ThisText>
            </View>;
        }
        return <TouchableOpacity transparent style={styles.promotion_iconView} onPress={onPressComment}>
            <ImageController style={{tintColor: componenColor, marginRight: 10, width: 30, height: 25}}
                   source={comments_icon}/>
            <ThisText style={styles.socialTextColor}>{comments}</ThisText>
        </TouchableOpacity>;
    }

    createLikeButton() {
        const {like, likes, disabled, onPressUnLike, onPressLike, feed} = this.props;
        let componenColor = '#e19c73';
        if (feed) {
            componenColor = '#2db6c8';
            if (disabled) {
                componenColor = '#cccccc';
            }
        }
        if (disabled) {
            return <View transparent style={styles.promotion_iconView}>
                <ImageController style={{tintColor: componenColor, marginRight: 10, width: 25, height: 25}} source={like_icon}/>
                <ThisText style={styles.socialTextColor}>{likes}</ThisText>
            </View>
        }
        if (like) {
            return <TouchableOpacity transparent style={styles.promotion_iconView} onPress={onPressUnLike}>


                <ImageController style={{tintColor: componenColor, marginRight: 10, width: 25, height: 25}}
                       source={user_like_icon}/>
                <ThisText style={styles.socialTextColor}>{likes}</ThisText>

            </TouchableOpacity>
        }
        return <TouchableOpacity transparent style={styles.promotion_iconView} onPress={onPressLike}>

            <ImageController style={{tintColor: componenColor, marginRight: 10, width: 25, height: 25}}
                   source={like_icon}/>
            <ThisText style={styles.socialTextColor}>{likes}</ThisText>

        </TouchableOpacity>
    }

    createShareButton() {
        const {share, shares, disabled, shareAction, feed, shareDisabled} = this.props;
        let componentStyle = styles.promotionBusiness;
        if (feed) {
            componentStyle = styles.promotionFeed;
        }
        let componenColor = '#e19c73';
        if (feed) {
            componenColor = '#2db6c8';
            if (disabled) {
                componenColor = '#cccccc';
            }
        }
        if (disabled || shareDisabled) {
            return <View transparent style={styles.promotion_iconView}>

                <ImageController style={{tintColor: componenColor, marginRight: 10, width: 25, height: 25}}
                       source={share_icon}/>
                <ThisText style={styles.socialTextColor}>{shares}</ThisText>

            </View>
        }
        if (share) {
            return <TouchableOpacity transparent style={styles.promotion_iconView} onPress={shareAction}>

                <ImageController style={{tintColor: componenColor, marginRight: 10, width: 25, height: 25}}
                       source={share_icon}/>
                <ThisText style={styles.socialTextColor}>{shares}</ThisText>


            </TouchableOpacity>
        }
        return <TouchableOpacity transparent style={styles.promotion_iconView} onPress={shareAction}>

            <ImageController style={{tintColor: componenColor, marginRight: 10, width: 25, height: 25}}
                   source={share_icon}/>
            <ThisText style={styles.socialTextColor}>{shares}</ThisText>
        </TouchableOpacity>;
    }
}

