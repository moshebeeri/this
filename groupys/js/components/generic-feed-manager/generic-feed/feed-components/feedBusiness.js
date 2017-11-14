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
import {SocialState, SubmitButton,PromotionSeperator,PromotionHeader} from '../../../../ui/index';
import FormUtils from "../../../../utils/fromUtils";

export default class FeedBusiness extends Component {
    render() {
        return this.createBussines(this.props.item, this.props.like, this.props.unlike, this.props.showUsers, this.props.comment)
    }
    showBussines() {
        this.props.navigation.navigate("businessProfile", {bussiness: this.props.item.business});
    }

    createBussines(item, like, unlike, showUsers, comment) {
       const {location} = this.props;
        if (!item.name) {
            return <View></View>;
        }
        const buisnessLogo = componentCreator.createBusinessLog(item, this.showBussines.bind(this));

        const styles = componentCreator.createStyle();
        const likeIcon = componentCreator.createLikeButton(item, styles, like, unlike);
        const commentICon = componentCreator.createCommentButton(styles, comment, item)
        const shareICon = componentCreator.createShareButton(styles, showUsers, item);
        const imageBusiness = this.createBusinessImage(item,styles);
        const result =
            <View style={styles.bussiness_container}>
                <View style={styles.promotion_card}>
                    <View style={styles.promotion_upperContainer}>
                        <View style={styles.logo_view}>
                            {buisnessLogo}
                            <View style={{flex:1,flexDirection: 'column'}}>
                                <Text style={styles.promotion_nameText} note>{item.businessName} </Text>
                                <Text numberOfLines={1} style={styles.promotion_addressText} note>{item.bussinessCategory}</Text>
                            </View>
                        </View>


                    </View>

                    {imageBusiness}
                    <View style={styles.business_buttomUpperContainer}>
                        <View style={styles.promotion_buttom_description}>

                            <Text style={styles.promotion_type}>{item.itemTitle}</Text>

                            <View style={styles.promotion_buttom_location}>
                                <Icon3 style={styles.promotion_location} size={25} name="location-on"/>
                                <View>
                                <Text style={styles.promotion_addressText} note>{item.businessAddress} </Text>

                                <Text
                                    style={styles.detailsText}>{FormUtils.getDistanceFromLatLonInKm(location.lat, location.long, item.location.lat, item.location.lng)}
                                      - km away</Text>
                                </View>
                            </View>
                        </View>
                    </View>


                    <View style={styles.promotion_bottomContainer}>
                            <SocialState feed comments={item.social.comments} onPressComment={comment}
                                         like={item.social.like} likes={item.social.numberLikes}
                                         onPressUnLike={() => unlike(item.id, token)}
                                         onPressLike={() => like(item.id, token)}
                                         share={item.social.share} shares={item.social.shares} shareAction={showUsers}/>


                    </View>
                </View>
            </View>
        return result;



    }

    createBusinessImage(item,styles){
        if(item.banner && item.banner.uri) {
            return <View style={styles.promotion_image_view}>

                <Image resizeMode="cover" style={styles.promotion_image} source={{uri: item.banner.uri}}>
                </Image>
            </View>
        }
        return undefined;
    }

    getStyle() {
        if (StyleUtils.isLandscape()) {
            return stylesLandscape;
        }
        return stylesPortrate;
    }
}