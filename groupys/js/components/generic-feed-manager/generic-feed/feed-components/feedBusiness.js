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
import Icon3 from 'react-native-vector-icons/MaterialIcons';
import stylesPortrate from './styles'
import stylesLandscape from './styles_lendscape'
import StyleUtils from '../../../../utils/styleUtils'
import * as componentCreator from "./feedCommonView";

export default class FeedBusiness extends Component {
    render() {
        return this.createBussines(this.props.item, this.props.like, this.props.unlike, this.props.showUsers, this.props.comment)
    }

    createBussines(item, like, unlike, showUsers, comment) {
        if (!item.name) {
            return <View></View>;
        }
        const styles = componentCreator.createStyle();
        const likeIcon = componentCreator.createLikeButton(item, styles, like, unlike);
        const commentICon = componentCreator.createCommentButton(styles, comment, item)
        const shareICon = componentCreator.createShareButton(styles, showUsers, item);
        const result =
            <View style={styles.bussiness_container}>
                <View style={styles.promotion_card}>
                    <View style={styles.bussiness_upperContainer}>
                        <View style={styles.logo_view}>

                            <View style={{flexDirection: 'column'}}>
                                <Text style={styles.promotion_nameText} note>{item.name} </Text>
                            </View>
                        </View>

                        <View style={styles.promotion_description}>
                            <Text style={styles.promotion_text_description}>{item.description}</Text>

                        </View>
                    </View>
                    <View style={styles.promotion_image_view}>

                        <Image resizeMode="cover" style={styles.promotion_image} source={{uri: item.banner.uri}}>
                        </Image>
                    </View>

                    <View style={styles.business_buttomUpperContainer}>
                        <View style={styles.promotion_buttom_description}>

                            <Text style={styles.promotion_type}>{item.itemTitle}</Text>

                            <View style={styles.promotion_buttom_location}>
                                <Icon3 style={styles.promotion_location} size={25} name="location-on"/>
                                <Text style={styles.promotion_addressText} note>{item.businessAddress} </Text>
                            </View>
                        </View>
                    </View>


                    <View style={styles.promotion_bottomContainer}>
                        {likeIcon}
                        {commentICon}
                        {shareICon}

                    </View>
                </View>
            </View>
        return result;
    }

    getStyle() {
        if (StyleUtils.isLandscape()) {
            return stylesLandscape;
        }
        return stylesPortrate;
    }
}