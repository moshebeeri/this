/**
 * Created by roilandshut on 23/07/2017.
 */
import React, {Component} from 'react';
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
    Thumbnail,
    View
} from 'native-base';
import Icon3 from 'react-native-vector-icons/MaterialIcons';
import StyleUtils from '../../../../utils/styleUtils'
import * as componentCreator from "./feedCommonView";
import {BusinessHeader, ImageController, SocialState, ThisText} from '../../../../ui/index';
import FormUtils from "../../../../utils/fromUtils";
import LinearGradient from 'react-native-linear-gradient';

export default class FeedBusiness extends Component {
    render() {
        return this.createBusiness(this.props.item, this.props.like, this.props.unlike, this.props.showUsers, this.props.comment)
    }

    componentWillMount() {
        const {item} = this.props;
    }

    visited(visible) {
        const {item, actions, group} = this.props;
        if (visible) {
            if (visible && actions && actions.setSocialState) {
                //  actions.setSocialState(item);
            }
            if (group) {
                actions.setVisibleItem(item.fid, group._id);
            } else {
                actions.setVisibleItem(item.fid);
            }
        }
    }

    shouldComponentUpdate() {
        const {item, shouldUpdateFeeds} = this.props;
        if(shouldUpdateFeeds[item.id] || shouldUpdateFeeds[item.id] === undefined){
            return true
        }
        return false;
    }

    componentDidUpdate(){
        this.props.actions.finishUpdateItem(this.props.item.id)

    }
    createBusiness(item, like, unlike, showUsers, comment, group) {
        const {location, refresh, showActions} = this.props;
        if (!item.name) {
            return <View></View>;
        }
        const styles = componentCreator.createStyle();
        const imageBusiness = this.createBusinessImage(item, styles, showActions,);
        const result =
            <View
                        style={[styles.businesses_container, {width: StyleUtils.getWidth()}]}>
                <View style={[styles.promotion_card, {width: StyleUtils.getWidth()}]}>

                    <View style={{
                        width: StyleUtils.getWidth(),
                        paddingBottom: 5,
                        backgroundColor: 'white',
                        justifyContent: 'flex-start',
                        flexDirection: 'row',
                        alignItems: 'center',
                        padding: 10,
                    }}>
                        {item.avetar && <ImageController thumbnail size={StyleUtils.scale(30)} source={item.avetar}/>}

                        <ThisText style={{
                            fontSize: StyleUtils.scale(14),
                            paddingLeft: StyleUtils.scale(10)
                        }}>{item.itemTitle}</ThisText>

                    </View>

                    {imageBusiness}

                    <View style={[styles.business_bottomUpperContainer, {width: StyleUtils.getWidth()}]}>
                        <View style={styles.businessLocationdescription}>


                            <View style={styles.promotion_bottom_location}>
                                <Icon3 style={styles.promotion_location} size={StyleUtils.scale(25)}
                                       name="location-on"/>
                                <View style={{flexDirection: 'row'}}>
                                    <ThisText style={styles.promotion_addressText}
                                              note>{item.businessAddress} </ThisText>
                                    <ThisText style={styles.detailsText}>
                                        {FormUtils.getDistanceString(location.lat, location.long, item.location.lat, item.location.lng)}
                                    </ThisText>
                                </View>
                            </View>
                        </View>
                    </View>


                    <View style={[styles.promotion_bottomContainer, {width: StyleUtils.getWidth()}]}>
                        <SocialState feed comments={item.social.comments} onPressComment={comment}
                                     like={item.social.like} likes={item.social.likes}
                                     onPressUnLike={() => unlike(item.id)}
                                     onPressLike={() => like(item.id)}
                                     sharable={item.sharable}
                                     groupChat={group}
                                     share={item.social.share} shares={item.social.shares} shareAction={showUsers}/>


                    </View>
                </View>
            </View>;
        return result;
    }

    createBusinessImage(item, styles, showActions) {
        if (item.banner && item.banner.uri) {
            return <View style={[styles.promotion_image_view, {width: StyleUtils.getWidth()}]}>
                <ImageController resizeMode="cover" style={[styles.promotion_image, {width: StyleUtils.getWidth()}]}
                                 source={{uri: item.banner.uri}}>
                </ImageController>
                <LinearGradient start={{x: 1, y: 1}} end={{x: 1, y: 0}}
                                locations={[0, 0.8]}
                                colors={['#00000099', 'transparent']} style={{
                    height: StyleUtils.relativeHeight(15, 10),
                    position: 'absolute',
                    justifyContent: 'flex-end',
                    bottom:0,
                    backgroundColor: 'transparent',
                    width: StyleUtils.getWidth()
                }}>
                    {item.business &&
                    <BusinessHeader navigation={this.props.navigation} business={item.business}
                                    categoryTitle={item.categoryTitle} businessLogo={item.business.logo}
                                    businessName={item.business.name} noMargin
                                    bgColor={'transparent'}
                                    textColor={'white'}
                                    size={60}
                                    id={item.activityId} showActions={showActions}
                    />}
                </LinearGradient>
            </View>
        }
        return undefined;
    }
}
