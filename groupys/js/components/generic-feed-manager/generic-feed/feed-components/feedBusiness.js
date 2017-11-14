/**
 * Created by roilandshut on 23/07/2017.
 */
import React, {Component} from 'react';
import {Image} from 'react-native';
import InViewPort from '../../../../utils/inviewport'
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
import Icon3 from 'react-native-vector-icons/MaterialIcons';
import stylesPortrate from './styles'
import stylesLandscape from './styles_lendscape'
import StyleUtils from '../../../../utils/styleUtils'
import * as componentCreator from "./feedCommonView";
import {SocialState} from '../../../../ui/index';
import FormUtils from "../../../../utils/fromUtils";

export default class FeedBusiness extends Component {
    render() {
        return this.createBussines(this.props.item, this.props.like, this.props.unlike, this.props.showUsers, this.props.comment)
    }

    showBussines() {
        this.props.navigation.navigate("businessProfile", {bussiness: this.props.item.business});
    }

    createBussines(item, like, unlike, showUsers, comment) {
        const {location, refresh} = this.props;
        if (!item.name) {
            return <View></View>;
        }
        const buisnessLogo = componentCreator.createBusinessLog(item, this.showBussines.bind(this));
        const styles = componentCreator.createStyle();
        const imageBusiness = this.createBusinessImage(item, styles);
        const result =
            <InViewPort onChange={() => refresh(item.id)} style={styles.bussiness_container}>
                <View style={styles.promotion_card}>
                    <View style={styles.promotion_upperContainer}>
                        <View style={styles.logo_view}>
                            {buisnessLogo}
                            <View style={{flex: 1, flexDirection: 'column'}}>
                                <Text style={styles.promotion_nameText} note>{item.businessName} </Text>
                                <Text numberOfLines={1} style={styles.promotion_addressText}
                                      note>{item.bussinessCategory}</Text>
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
                                     like={item.social.like} likes={item.social.likes}
                                     onPressUnLike={() => unlike(item.id)}
                                     onPressLike={() => like(item.id)}
                                     share={item.social.share} shares={item.social.shares} shareAction={showUsers}/>


                    </View>
                </View>
            </InViewPort>
        return result;
    }

    createBusinessImage(item, styles) {
        if (item.banner && item.banner.uri) {
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