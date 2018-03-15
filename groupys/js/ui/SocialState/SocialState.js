import React, {Component} from 'react';
import {TouchableOpacity, View,I18nManager} from 'react-native';
import {Button} from 'native-base';
import styles from './styles'
import StyleUtils from "../../utils/styleUtils";
import Ionicons from "react-native-vector-icons/Ionicons";
import EvilIcons from "react-native-vector-icons/EvilIcons";
import SimpleLineIcons from "react-native-vector-icons/SimpleLineIcons";
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
        const {comments, disabled, onPressComment, feed,groupChat} = this.props;
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

        if(groupChat){
            if(I18nManager.isRTL) {
                return <TouchableOpacity transparent style={styles.promotion_iconView} onPress={onPressComment}>
                    <SimpleLineIcons size={28} color={componenColor} style={{marginRight: 10}}
                                     name="action-undo"/>

                </TouchableOpacity>;
            }else{
                return <TouchableOpacity transparent style={styles.promotion_iconView} onPress={onPressComment}>
                    <SimpleLineIcons size={28} color={componenColor} style={{marginRight: 10}}
                                     name="action-redo"/>

                </TouchableOpacity>;
            }
        }
        if (disabled) {

            return <View transparent style={styles.promotion_iconView}>
                <SimpleLineIcons size={30} color={componenColor} style={{marginRight: 10, width: 40, height: 40}}
                                 name="bubbles"/>

                <ThisText style={styles.socialTextColor}>{comments}</ThisText>
            </View>;
        }
        return <TouchableOpacity transparent style={styles.promotion_iconView} onPress={onPressComment}>
            <SimpleLineIcons size={30} color={componenColor} style={{marginRight: 10}}
                             name="bubbles"/>
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

                <Ionicons size={30} color={componenColor} style={{marginRight: 10}}
                          name="md-heart-outline"/>
                <ThisText style={styles.socialTextColor}>{likes}</ThisText>
            </View>
        }
        if (like) {
            return <TouchableOpacity transparent style={styles.promotion_iconView} onPress={onPressUnLike}>


                <Ionicons size={30} color={componenColor} style={{marginRight: 10}}
                          name="md-heart"/>
                <ThisText style={styles.socialTextColor}>{likes}</ThisText>

            </TouchableOpacity>
        }
        return <TouchableOpacity transparent style={styles.promotion_iconView} onPress={onPressLike}>

            <Ionicons size={30} color={componenColor} style={{marginRight: 10}}
                      name="md-heart-outline"/>
            <ThisText style={styles.socialTextColor}>{likes}</ThisText>

        </TouchableOpacity>
    }

    createShareButton() {
        const {share, shares, disabled, shareAction, feed, shareDisabled,shareable} = this.props;
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
        if (disabled || shareDisabled ||!shareable) {
            return <View transparent style={styles.promotion_iconView}>
                <SimpleLineIcons size={28} color={'#cccccc'} style={{marginRight: 10}}
                           name="share"/>
                <ThisText style={styles.socialTextColor}>{shares}</ThisText>

            </View>
        }
        if (share) {
            return <TouchableOpacity transparent style={styles.promotion_iconView} onPress={shareAction}>

                <SimpleLineIcons size={28} color={componenColor} style={{marginRight: 10}}
                           name="share"/>
                <ThisText style={styles.socialTextColor}>{shares}</ThisText>


            </TouchableOpacity>
        }
        return <TouchableOpacity transparent style={styles.promotion_iconView} onPress={shareAction}>

            <SimpleLineIcons size={28} color={componenColor} style={{marginRight: 10}}
                       name="share"/>
            <ThisText style={styles.socialTextColor}>{shares}</ThisText>
        </TouchableOpacity>;
    }
}

