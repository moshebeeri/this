/**
 * Created by roilandshut on 23/07/2017.
 */
/**
 * Created by roilandshut on 23/07/2017.
 */
import React, {Component} from 'react';
import {Image, PanResponder, Platform, TouchableHighlight} from 'react-native';
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
    Text,
    Thumbnail,
    View
} from 'native-base';
import Icon2 from 'react-native-vector-icons/EvilIcons';
import Icon3 from 'react-native-vector-icons/MaterialIcons';
import StyleUtils from '../../../../utils/styleUtils'
import * as componentCreator from "./feedCommonView";
import {ThisText} from '../../../../ui/index';

export default class FeedGroupPromotion extends Component {
    render() {
        return this.createPromotion(this.props.item, this.props.save, this.props.like, this.props.unlike, this.props.showUsers);
    }

    createPromotion(item, save, like, unlike, showUsers) {
        const styles = componentCreator.createStyle();
        const colorStyle = {
            color: item.promotionColor,
            fontFamily: 'Roboto-Regular', marginLeft: 10, marginTop: 4, fontSize: 16
        }
        const promotion = <ThisText style={colorStyle}>{item.promotion}</ThisText>
        const buisnessLogo = componentCreator.createBusinessLog(item);
        const likeIcon = componentCreator.createLikeButton(item, styles, like, unlike);
        const commentICon = componentCreator.createCommentButton(styles, comment);
        const shareICon = componentCreator.createShareButton(styles, showUsers, item);
        const saveIcon = componentCreator.createSaveButton(item, save);
        const result =
            <View style={[styles.promotion_container, {width: StyleUtils.getWidth()}]}>
                <View style={[styles.promotion_card, {width: StyleUtils.getWidth()}]}>
                    <View style={[styles.promotion_upperContainer, {width: StyleUtils.getWidth()}]}>
                       <View style={styles.logo_view}>
                            {buisnessLogo}
                            <View style={{flexDirection: 'column'}}>
                                <ThisText style={styles.promotion_nameText} note>{item.businessName} </ThisText>
                                <ThisText style={styles.promotion_addressText} note>{item.businessAddress} </ThisText>
                            </View>
                        </View>

                        <View style={styles.promotion_description}>

                            <ThisText style={styles.promotion_text_description}>{item.name}</ThisText>
                            <ThisText style={styles.promotion_text_description}>{item.description}</ThisText>

                        </View>
                    </View>

                    <Image resizeMode="cover" style={styles.promotion_image} source={{uri: item.banner.uri}}>
                    </Image>

                    <View style={styles.promotion_bottomUpperContainer}>
                        <View style={styles.promotion_bottom_description}>
                            {promotion}
                            <ThisText style={styles.promotion_type}>{item.itemTitle}</ThisText>
                            <View style={styles.promotion_bottom_location}>
                                <Icon2 style={styles.promotion_location} size={25} name="clock"/>

                            </View>
                            <View style={styles.promotion_bottom_location}>
                                <Icon3 style={styles.promotion_location} size={25} name="location-on"/>
                                <ThisText style={styles.promotion_addressText} note>{item.businessAddress} </ThisText>
                            </View>
                        </View>
                    </View>


                    <View style={styles.promotion_bottomContainer}>
                        {likeIcon}
                        {commentICon}
                        {shareICon}
                        {saveIcon}
                    </View>
                </View>
            </View>
        return result;
    }
}