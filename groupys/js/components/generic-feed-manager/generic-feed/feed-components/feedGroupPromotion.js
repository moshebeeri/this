/**
 * Created by roilandshut on 23/07/2017.
 */
/**
 * Created by roilandshut on 23/07/2017.
 */
import React, {Component} from 'react';
import {Image, Platform, PanResponder, TouchableHighlight} from 'react-native';
import {connect} from 'react-redux';
import {actions} from 'react-native-navigation-redux-helpers';
import {
    Container,
    Content,
    Text,
    InputGroup,
    Input,
    Thumbnail,
    Button,
    Picker,
    Right,
    Item,
    Left,
    Header,
    Footer,
    Body,
    View,
    Card,
    CardItem
} from 'native-base';
import Icon from 'react-native-vector-icons/FontAwesome';
import Icon2 from 'react-native-vector-icons/EvilIcons';
import Icon3 from 'react-native-vector-icons/MaterialIcons';
import styles from './styles'
import * as componentCreator from "./feedCommonView";

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
        const promotion = <Text style={colorStyle}>{item.promotion}</Text>
        const buisnessLogo = componentCreator.createBusinessLog(item);
        const likeIcon = componentCreator.createLikeButton(item, styles, like, unlike);
        const commentICon = componentCreator.createCommentButton(styles, comment);
        const shareICon = componentCreator.createShareButton(styles, showUsers, item);
        const saveIcon = componentCreator.createSaveButton(item, save);
        const result =
            <View style={styles.promotion_container}>
                <View style={styles.promotion_card}>
                    <View style={styles.promotion_upperContainer}>
                        <View style={styles.logo_view}>
                            {buisnessLogo}
                            <View style={{flexDirection: 'column'}}>
                                <Text style={styles.promotion_nameText} note>{item.businessName} </Text>
                                <Text style={styles.promotion_addressText} note>{item.businessAddress} </Text>
                            </View>
                        </View>

                        <View style={styles.promotion_description}>

                            <Text style={styles.promotion_text_description}>{item.name}</Text>
                            <Text style={styles.promotion_text_description}>{item.description}</Text>

                        </View>
                    </View>

                    <Image resizeMode="cover" style={styles.promotion_image} source={{uri: item.banner.uri}}>
                    </Image>

                    <View style={styles.promotion_bottomUpperContainer}>
                        <View style={styles.promotion_bottom_description}>
                            {promotion}
                            <Text style={styles.promotion_type}>{item.itemTitle}</Text>
                            <View style={styles.promotion_bottom_location}>
                                <Icon2 style={styles.promotion_location} size={25} name="clock"/>

                            </View>
                            <View style={styles.promotion_bottom_location}>
                                <Icon3 style={styles.promotion_location} size={25} name="location-on"/>
                                <Text style={styles.promotion_addressText} note>{item.businessAddress} </Text>
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