import React, {Component} from 'react';
import {Text, TouchableOpacity, View,Image} from 'react-native';
import {Button} from 'native-base';
import Icon from 'react-native-vector-icons/FontAwesome';
import Icon2 from 'react-native-vector-icons/EvilIcons';
import Icon3 from 'react-native-vector-icons/Entypo';
import styles from './styles'
import StyleUtils from "../../utils/styleUtils";

const like_icon = require('../../../images/Like.png');
const comments_icon = require('../../../images/Comment.png');
const user_like_icon = require('../../../images/user_like.png');
const share_icon = require('../../../images/share.png');
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
            if(disabled) {
                componenColor = '#cccccc';
            }
        }
        if (disabled) {
            return <View transparent style={styles.promotion_iconView}>
                <Image style={{tintColor: componenColor, marginRight: 10, width: 30, height: 25}}
                       source={comments_icon}/>
                <Text style={styles.socialTextColor}>{comments}</Text>
            </View>;
        }
        return <TouchableOpacity transparent style={styles.promotion_iconView} onPress={onPressComment}>
            <Image style={{tintColor: componenColor, marginRight: 10, width: 30, height: 25}}
                   source={comments_icon}/>
             <Text style={styles.socialTextColor}>{comments}</Text>
        </TouchableOpacity>;
    }

    createLikeButton() {
        const {like, likes, disabled, onPressUnLike, onPressLike, feed} = this.props;
        let componenColor = '#e19c73';
        if (feed) {
            componenColor = '#2db6c8';
            if(disabled) {
                componenColor = '#cccccc';
            }
        }
        if (disabled) {
            return <View transparent style={styles.promotion_iconView}>
                <Image style={{tintColor:componenColor, marginRight: 10, width: 25, height: 25}} source={like_icon}/>
                <Text style={styles.socialTextColor}>{likes}</Text>
            </View>
        }
        if (like) {
            return <TouchableOpacity transparent style={styles.promotion_iconView} onPress={onPressUnLike}>


                <Image style={{tintColor: componenColor, marginRight: 10, width: 25, height: 25}}
                       source={user_like_icon}/>
                <Text style={styles.socialTextColor}>{likes}</Text>

            </TouchableOpacity>
        }
        return <TouchableOpacity transparent style={styles.promotion_iconView} onPress={onPressLike}>

            <Image style={{tintColor: componenColor, marginRight: 10, width: 25, height: 25}}
                   source={like_icon}/>
            <Text style={styles.socialTextColor}>{likes}</Text>

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
            if(disabled) {
                componenColor = '#cccccc';
            }
        }
        if (disabled || shareDisabled) {
            return <View transparent style={styles.promotion_iconView}>

                <Image style={{tintColor: componenColor, marginRight: 10, width: 25, height: 25}}
                       source={share_icon}/>
                <Text style={styles.socialTextColor}>{shares}</Text>

            </View>
        }
        if (share) {
            return <TouchableOpacity transparent style={styles.promotion_iconView} onPress={shareAction}>

                <Image style={{tintColor: componenColor, marginRight: 10, width: 25, height: 25}}
                       source={share_icon}/>
                <Text style={styles.socialTextColor}>{shares}</Text>


            </TouchableOpacity>
        }
        return <TouchableOpacity transparent style={styles.promotion_iconView} onPress={shareAction}>

            <Image style={{tintColor: componenColor, marginRight: 10, width: 25, height: 25}}
                   source={share_icon}/>
            <Text style={styles.socialTextColor}>{shares}</Text>
        </TouchableOpacity>;
    }
}

