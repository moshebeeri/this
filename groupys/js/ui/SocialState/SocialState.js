import React, {Component} from 'react';
import {I18nManager, TouchableOpacity, View} from 'react-native';
import {Button} from 'native-base';
import styles from './styles'
import StyleUtils from "../../utils/styleUtils";
import Ionicons from "react-native-vector-icons/Ionicons";
import SimpleLineIcons from "react-native-vector-icons/SimpleLineIcons";
import {ThisText} from '../../ui/index';
import withPreventDoubleClick from '../../ui/TochButton/TouchButton';

const TouchableOpacityFix = withPreventDoubleClick(TouchableOpacity);
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
        const {showFollowers} = this.props;
        return <View style={[styles.socialContainer, {width: StyleUtils.getWidth()}]}>

            {this.createLikeButton()}
            {!showFollowers && this.createCommentButton()}
            {showFollowers && this.createFollowers()}
            {this.createShareButton()}
        </View>
    }

    createFollowers() {
        const {followers, disabled, feed} = this.props;
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
        return <View transparent style={styles.promotion_iconView}>
            <Ionicons size={40} color={componenColor} style={{marginRight: 10, width: 40, height: 40}}
                      name="ios-people"/>
            <ThisText style={styles.socialTextColor}>{followers}</ThisText>
        </View>;
    }

    createCommentButton() {
        const {comments, disabled, onPressComment, feed, groupChat} = this.props;
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
        if (groupChat) {
            if (I18nManager.isRTL) {
                return <TouchableOpacityFix transparent style={styles.promotion_iconView} onPress={onPressComment}>
                    <SimpleLineIcons size={28} color={componenColor} style={{marginRight: 10}}
                                     name="action-undo"/>

                </TouchableOpacityFix>;
            } else {
                return <TouchableOpacityFix transparent style={styles.promotion_iconView} onPress={onPressComment}>
                    <SimpleLineIcons size={28} color={componenColor} style={{marginRight: 10}}
                                     name="action-redo"/>

                </TouchableOpacityFix>;
            }
        }
        if (disabled) {
            return <View transparent style={styles.promotion_iconView}>
                <SimpleLineIcons size={30} color={componenColor} style={{marginRight: 10, width: 40, height: 40}}
                                 name="bubbles"/>

                <ThisText style={styles.socialTextColor}>{comments}</ThisText>
            </View>;
        }
        return <TouchableOpacityFix transparent style={styles.promotion_iconView} onPress={onPressComment}>
            <SimpleLineIcons size={30} color={componenColor} style={{marginRight: 10}}
                             name="bubbles"/>
            <ThisText style={styles.socialTextColor}>{comments}</ThisText>
        </TouchableOpacityFix>;
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

                <Ionicons size={30} color={componenColor} style={{marginRight: 10}}
                          name="md-heart-outline"/>
                <ThisText style={styles.socialTextColor}>{likes}</ThisText>
            </View>
        }
        if (like) {
            return <TouchableOpacityFix transparent style={styles.promotion_iconView} onPress={onPressUnLike}>


                <Ionicons size={30} color={componenColor} style={{marginRight: 10}}
                          name="md-heart"/>
                <ThisText style={styles.socialTextColor}>{likes}</ThisText>

            </TouchableOpacityFix>
        }
        return <TouchableOpacityFix transparent style={styles.promotion_iconView} onPress={onPressLike}>

            <Ionicons size={30} color={componenColor} style={{marginRight: 10}}
                      name="md-heart-outline"/>
            <ThisText style={styles.socialTextColor}>{likes}</ThisText>

        </TouchableOpacityFix>
    }

    createShareButton() {
        const {share, shares, disabled, shareAction, feed, shareDisabled, sharable} = this.props;
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
        if (disabled || shareDisabled || !sharable) {
            return <View transparent style={styles.promotion_iconView}>
                <SimpleLineIcons size={28} color={'#cccccc'} style={{marginRight: 10}}
                                 name="share"/>
                <ThisText style={styles.socialTextColor}>{shares}</ThisText>

            </View>
        }
        if (share) {
            return <TouchableOpacityFix transparent style={styles.promotion_iconView} onPress={shareAction}>

                <SimpleLineIcons size={28} color={componenColor} style={{marginRight: 10}}
                                 name="share"/>
                <ThisText style={styles.socialTextColor}>{shares}</ThisText>


            </TouchableOpacityFix>
        }
        return <TouchableOpacityFix transparent style={styles.promotion_iconView} onPress={shareAction}>

            <SimpleLineIcons size={28} color={componenColor} style={{marginRight: 10}}
                             name="share"/>
            <ThisText style={styles.socialTextColor}>{shares}</ThisText>
        </TouchableOpacityFix>;
    }
}

