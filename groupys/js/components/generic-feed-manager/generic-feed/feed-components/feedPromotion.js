/**
 * Created by roilandshut on 23/07/2017.
 */
import React, {Component} from 'react';
import {Dimensions} from 'react-native';
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
import stylesPortrate from './styles'
import LinearGradient from 'react-native-linear-gradient';
import StyleUtils from '../../../../utils/styleUtils'
import {
    BusinessHeader,
    ImageController,
    PromotionHeader,
    PromotionSeperator,
    SocialState,
    SubmitButton,
    ThisText
} from '../../../../ui/index';
import FormUtils from "../../../../utils/fromUtils";
import strings from "../../../../i18n/i18n"
import PageRefresher from '../../../../refresh/pageRefresher'

const {width, height} = Dimensions.get('window');
const vh = height / 100;
export default class FeedPromotion extends Component {
    constructor() {
        super();
    }

    componentWillMount() {
        const {item} = this.props;
        PageRefresher.createFeedSocialState(item.id);
    }

    visited(visible) {
        const {item, actions, group} = this.props;
        if (visible && actions && actions.setSocialState) {
            actions.setSocialState(item);
            if (group) {
                actions.setVisibleItem(item.fid, group._id);
            } else {
                actions.setVisibleItem(item.fid);
            }
        }
    }

    shouldComponentUpdate() {
        const {item, visibleItem, shouldUpdate, visibleFeeds} = this.props;
        if (shouldUpdate) {
            return true;
        }
        let results = item.id === visibleItem;
        if (results) {
            return results
        }
        if (visibleFeeds && item.fid && visibleFeeds.includes(item.fid)) {
            return true;
        }
        return false;
    }

    render() {
        const {showInPopup, showActions, item, save, shared, like, unlike, showUsers, comment, token, location, hideSocial, realize, navigation, scanner,group} = this.props;
        let categoruTitle = item.categoryTitle;
        if (item.business) {
            categoruTitle = item.business.categoryTitle;
        }
        const styles = this.createPromotionStyle();
        const image = this.createImageComponent(item, styles,categoruTitle,showActions);
        const container = this.createContainerStyle(item);
        let claimDisabled = true;
        if (item.showsave) {
            claimDisabled = false
        }
        let promotionUpperContainer = styles.promotion_upperContainer;
        let logtyle = styles.logo_view;
        let promotaionDesc = styles.promotiosDescription;
        let promotionDetalis = styles.promotionDetails;
        if (shared) {
            promotionUpperContainer = styles.promotioSharedUpperContainer;
            logtyle = styles.logoSharedview;
            promotaionDesc = styles.promotiosShareDescription;
            promotionDetalis = styles.promotionShareDetails;
        }

        const result =
            <InViewPort onChange={this.visited.bind(this)} style={container}>
                <View style={[styles.promotion_card, {width: StyleUtils.getWidth()}]}>
                    {!scanner ? <View style={{width: StyleUtils.getWidth(), backgroundColor: 'red'}}>
                            <View style={[promotaionDesc, {backgroundColor: 'white', width: StyleUtils.getWidth()}]}>
                                <PromotionHeader item={item} type={item.promotion} feed titleText={item.promotionTitle}
                                                 titleValue={item.promotionValue} term={item.promotionTerm}/>
                            </View>

                        </View> :
                        <View style={{
                            flex: 1,
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}>
                            <PromotionHeader item={item} type={item.promotion} feed titleText={item.promotionTitle}
                                             titleValue={item.promotionValue} term={item.promotionTerm}/>
                        </View>}


                    {image}




                    {!shared && location &&
                    <View style={[styles.promotionDetailsContainer, {width: StyleUtils.getWidth()}]}>
                        <View style={styles.promotionLoctionContainer}>
                            <View><ThisText style={styles.detailsTitleText}>{strings.Location}</ThisText></View>
                            <View><ThisText
                                style={styles.detailsText}>{FormUtils.getDistanceString(location.lat, location.long, item.location.lat, item.location.lng)}</ThisText></View>
                        </View>
                        <View style={styles.expireDateContainer}>
                            <View><ThisText style={styles.detailsTitleText}>{strings.Expire}</ThisText></View>
                            <View><ThisText style={styles.detailsText}>{item.endDate}</ThisText></View>
                        </View>
                        {!claimDisabled && save &&
                        <View style={styles.editButtonContainer}>
                            <SubmitButton disabledText={strings.Claimed.toUpperCase()}
                                          title={strings.Claim.toUpperCase()} color={'#2db6c8'}
                                          onPress={() => save(item.id, navigation, item)}/>
                        </View>
                        }
                        {claimDisabled && !item.isRealized &&
                        <View style={styles.editButtonContainer}>
                            <SubmitButton title={strings.Realize.toUpperCase()} color={'#2db6c8'}
                                          onPress={() => realize(item)}/>
                        </View>
                        }

                        {claimDisabled && item.isRealized &&
                        <View style={styles.editButtonContainer}>
                            <SubmitButton disabled title={strings.Realized.toUpperCase()} color={'#cccccc'}
                                          onPress={() => realize(item)}/>
                        </View>}

                    </View>}

                    {!hideSocial &&
                    <View style={[styles.promotion_bottomContainer, {width: StyleUtils.getWidth()}]}>

                        {item.social && <SocialState feed comments={item.social.comments} onPressComment={comment}
                                                     like={item.social.like} likes={item.social.likes}
                                                     onPressUnLike={() => unlike(item.id, token)}
                                                     onPressLike={() => like(item.id, token)}
                                                     shareDisabled={shared}
                                                     groupChat={group}
                                                     shareable = {item.shareable}
                                                     share={item.social.share} shares={item.social.shares}
                                                     shareAction={showUsers}/>}
                    </View>}


                </View>
            </InViewPort>;
        return result;
    }

    createColorStyle(item) {
        return {
            color: item.promotionColor,
            fontFamily: 'Roboto-Regular', marginLeft: 10, marginTop: 4, fontSize: 16
        };
    }

    createContainerStyle(item) {
        const {shared, showInPopup} = this.props;
        if (showInPopup) {
            return {
                flex: 1,
                height: 90 * vh,
                width: StyleUtils.getWidth() - 5,
                overflow: 'hidden',
                backgroundColor: 'white',
                // backgroundColor:'#FFF',
                alignItems: 'center',
                flexDirection: 'column',
            }
        }
        return {
            flex: 1,
            width: StyleUtils.getWidth(),
            overflow: 'hidden',
            backgroundColor: 'pink',
            marginBottom: 10,
            alignItems: 'center',
            flexDirection: 'column',
        }
    }

    createImageComponent(item, styles,categoruTitle,showActions) {
        if (item.banner) {
            return <View style={[styles.promotion_image_view, {width: StyleUtils.getWidth()}]}>
                <ImageController resizeMode="cover" style={[styles.promotion_image, {width: StyleUtils.getWidth()}]}
                                 source={{uri: item.banner.uri}}>
                </ImageController>
                <LinearGradient start={{x: 1, y: 1}} end={{x: 1, y: 0}}
                                locations={[0,0.8]}
                                colors={['#00000099', 'transparent']}  style={{height:140,position:'absolute',justifyContent:'flex-end',top:110,backgroundColor:'transparent',width: StyleUtils.getWidth()}}>
                    {item.business &&
                    <BusinessHeader navigation={this.props.navigation} business={item.business}
                                    categoryTitle={categoruTitle} businessLogo={item.business.logo}
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

    createPromotionStyle() {
        return stylesPortrate;
    }
}