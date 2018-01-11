import React, {Component} from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import {Button} from 'native-base';
import Icon from 'react-native-vector-icons/FontAwesome';
import Icon2 from 'react-native-vector-icons/EvilIcons';
import Icon3 from 'react-native-vector-icons/Entypo';
import styles from './styles'
import StyleUtils from "../../utils/styleUtils";

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
        if (disabled) {
            return <View transparent style={styles.promotion_iconView}>
                <Icon2 style={componentStyle} size={25} name="comment"/>
                <Text style={styles.socialTextColor}>{comments}</Text>
            </View>;
        }
        return <TouchableOpacity transparent style={styles.promotion_iconView} onPress={onPressComment}>
            <Icon2 style={componentStyle} size={25} name="comment"/>
            <Text style={styles.socialTextColor}>{comments}</Text>
        </TouchableOpacity>;
    }

    createLikeButton() {
        const {like, likes, disabled, onPressUnLike, onPressLike, feed} = this.props;
        let componentStyle = styles.promotionBusiness;
        if (feed) {
            componentStyle = styles.promotionFeed;
        }
        if (disabled) {
            return <View transparent style={styles.promotion_iconView}>
                <Icon style={componentStyle} size={20} name="heart"/>
                <Text style={styles.socialTextColor}>{likes}</Text>
            </View>
        }
        if (like) {
            return <TouchableOpacity transparent style={styles.promotion_iconView} onPress={onPressUnLike}>


                <Icon style={styles.promotionLikeActive} size={20} name="heart"/>
                <Text style={styles.socialTextColor}>{likes}</Text>

            </TouchableOpacity>
        }
        return <TouchableOpacity transparent style={styles.promotion_iconView} onPress={onPressLike}>

            <Icon style={componentStyle} size={20} name="heart"/>
            <Text style={styles.socialTextColor}>{likes}</Text>

        </TouchableOpacity>
    }

    createShareButton() {
        const {share, shares, disabled, shareAction, feed, shareDisabled} = this.props;
        let componentStyle = styles.promotionBusiness;
        if (feed) {
            componentStyle = styles.promotionFeed;
        }
        if (disabled || shareDisabled) {
            return <View transparent style={styles.promotion_iconView}>

                <Icon3 style={styles.promotionDisabledFeed} size={25} name="share"/>
                <Text style={styles.socialTextColor}>{shares}</Text>

            </View>
        }
        if (share) {
            return <TouchableOpacity transparent style={styles.promotion_iconView} onPress={shareAction}>

                <Icon3 style={styles.promotionShareActive} size={25} name="share"/>
                <Text style={styles.socialTextColor}>{shares}</Text>


            </TouchableOpacity>
        }
        return <TouchableOpacity transparent style={styles.promotion_iconView} onPress={shareAction}>

            <Icon3 style={componentStyle} size={25} name="share"/>
            <Text style={styles.socialTextColor}>{shares}</Text>
        </TouchableOpacity>;
    }
}

