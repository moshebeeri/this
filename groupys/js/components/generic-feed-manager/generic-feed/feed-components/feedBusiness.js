/**
 * Created by roilandshut on 23/07/2017.
 */
import React, {Component} from 'react';
import {Dimensions, Image} from 'react-native';
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
import StyleUtils from '../../../../utils/styleUtils'
import * as componentCreator from "./feedCommonView";
import {BusinessHeader, SocialState,ImageController} from '../../../../ui/index';
import FormUtils from "../../../../utils/fromUtils";
import PageRefresher from '../../../../refresh/pageRefresher'

export default class FeedBusiness extends Component {
    render() {
        return this.createBusiness(this.props.item, this.props.like, this.props.unlike, this.props.showUsers, this.props.comment)
    }



    componentWillMount() {
        const {item} = this.props;
        PageRefresher.createFeedSocialState(item.id);
    }

    visited(visible) {
        const {item} = this.props;
        if (visible) {
            console.log(item.id + ' visited');
            PageRefresher.visitedFeedItem(item);
        }
    }

    createBusiness(item, like, unlike, showUsers, comment) {
        const {location, refresh, showActions} = this.props;
        if (!item.name) {
            return <View></View>;
        }
        const styles = componentCreator.createStyle();
        const imageBusiness = this.createBusinessImage(item, styles);
        const result =
            <InViewPort onChange={this.visited.bind(this)}
                        style={[styles.businesses_container, {width: StyleUtils.getWidth()}]}>
                <View style={[styles.promotion_card, {width: StyleUtils.getWidth()}]}>
                    <View style={{width: StyleUtils.getWidth()}}>
                        <BusinessHeader navigation={this.props.navigation} business={item.business}
                                        categoryTitle={item.categoryTitle} businessLogo={item.businessLogo}
                                        businessName={item.business.name} noMargin
                                        id={item.activityId} showActions={showActions}
                        />
                    </View>
                    <View style={{
                        width: StyleUtils.getWidth(),
                        paddingBottom: 5,
                        backgroundColor: 'white',
                        justifyContent: 'flex-start',
                        alignItems: 'flex-start'
                    }}>
                        <Text style={styles.promotion_type}>{item.itemTitle}</Text>
                    </View>

                    {imageBusiness}

                    <View style={[styles.business_bottomUpperContainer, {width: StyleUtils.getWidth()}]}>
                        <View style={styles.businessLocationdescription}>


                            <View style={styles.promotion_bottom_location}>
                                <Icon3 style={styles.promotion_location} size={25} name="location-on"/>
                                <View style={{flexDirection: 'row'}}>
                                    <Text style={styles.promotion_addressText} note>{item.businessAddress} </Text>
                                    <Text style={styles.detailsText}>
                                        {FormUtils.getDistanceString(location.lat, location.long, item.location.lat, item.location.lng)}
                                    </Text>
                                </View>
                            </View>
                        </View>
                    </View>


                    <View style={[styles.promotion_bottomContainer, {width: StyleUtils.getWidth()}]}>
                        <SocialState feed comments={item.social.comments} onPressComment={comment}
                                     like={item.social.like} likes={item.social.likes}
                                     onPressUnLike={() => unlike(item.id)}
                                     onPressLike={() => like(item.id)}
                                     share={item.social.share} shares={item.social.shares} shareAction={showUsers}/>


                    </View>
                </View>
            </InViewPort>;
        return result;
    }

    createBusinessImage(item, styles) {
        if (item.banner && item.banner.uri) {
            return <View style={[styles.promotion_image_view, {width: StyleUtils.getWidth()}]}>

                <ImageController resizeMode="cover" style={[styles.promotion_image, {width: StyleUtils.getWidth()}]}
                       source={{uri: item.banner.uri}}>
                </ImageController>
            </View>
        }
        return undefined;
    }
}
