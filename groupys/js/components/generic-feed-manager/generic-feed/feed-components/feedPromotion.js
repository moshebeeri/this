/**
 * Created by roilandshut on 23/07/2017.
 */
import React, {Component} from 'react';
import {Dimensions, Image, Platform} from 'react-native';
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
import stylesPortrate from './styles'
import StyleUtils from '../../../../utils/styleUtils'
import {BusinessHeader, PromotionHeader, PromotionSeperator, SocialState, SubmitButton} from '../../../../ui/index';
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
        const {item} = this.props;
        if (visible) {
            console.log(item.id + ' visited');
            PageRefresher.visitedFeedItem(item);
        }
    }

    render() {
        const {showInPopup, showActions, item, save, shared, like, unlike, showUsers, comment, token, location, hideSocial, realize} = this.props;
        const styles = this.createPromotionStyle();
        const image = this.createImageComponent(item, styles);
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
        let categoruTitle = item.categoryTitle;
        if (item.business) {
            categoruTitle = item.business.categoryTitle;
        }

        const result =
            <InViewPort onChange={this.visited.bind(this)} style={container}>
                <View style={[styles.promotion_card, {width: StyleUtils.getWidth()}]}>
                    <View style={{ width: StyleUtils.getWidth()}}>

                        <BusinessHeader navigation={this.props.navigation} business={item.business}
                                        categoryTitle={categoruTitle} businessLogo={item.business.logo}
                                        businessName={item.business.name} noMargin
                                        id={item.activityId} showActions={showActions}
                        />
                    </View>


                    {image}


                    <View style={{width: StyleUtils.getWidth(), backgroundColor: 'white'}}>
                        <View style={[promotaionDesc, {backgroundColor:'white',width: StyleUtils.getWidth()}]}>
                            <PromotionHeader type={item.promotion} feed titleText={item.promotionTitle}
                                             titleValue={item.promotionValue} term={item.promotionTerm}/>
                        </View>

                    </View>
                    <View style={ {marginBottom:10,alignItems:'center',justifyContent:'center',backgroundColor:'white',width: StyleUtils.getWidth()}}>
                        <Text numberOfLines={2} style={{marginRight: 10, marginLeft: 10, fontSize: 18}}>{item.name}
                            - {item.description}</Text>
                    </View>
                    {!shared && location && <View style={[styles.promotionsSeparator, {width: StyleUtils.getWidth()}]}>
                        <PromotionSeperator/>
                    </View>}

                    {!shared && location &&
                    <View style={[styles.promotionDetailsContainer, {width: StyleUtils.getWidth()}]}>
                        <View style={styles.promotionLoctionContainer}>
                            <View><Text style={styles.detailsTitleText}>{strings.Location}</Text></View>
                            <View><Text
                                style={styles.detailsText}>{FormUtils.getDistanceString(location.lat, location.long, item.location.lat, item.location.lng)}</Text></View>
                        </View>
                        <View style={styles.expireDateContainer}>
                            <View><Text style={styles.detailsTitleText}>{strings.Expire}</Text></View>
                            <View><Text style={styles.detailsText}>{item.endDate}</Text></View>
                        </View>
                        {save &&
                        <View style={styles.editButtonContainer}>
                            <SubmitButton title={strings.Claim.toUpperCase()} color={'#2db6c8'}
                                          disabled={claimDisabled} onPress={() => save(item.id)}/>
                        </View>
                        }
                        {realize &&
                        <View style={styles.editButtonContainer}>
                            <SubmitButton title={strings.Realize.toUpperCase()} color={'#2db6c8'}
                                          onPress={realize}/>
                        </View>
                        }
                    </View>}


                    {!hideSocial &&
                    <View style={[styles.promotion_bottomContainer, {width: StyleUtils.getWidth()}]}>

                        {item.social && <SocialState feed comments={item.social.comments} onPressComment={comment}
                                                     like={item.social.like} likes={item.social.likes}
                                                     onPressUnLike={() => unlike(item.id, token)}
                                                     onPressLike={() => like(item.id, token)}
                                                     shareDisabled={shared}
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

    createImageComponent(item, styles) {
        if (item.banner) {
            return <View style={[styles.promotion_image_view, {width: StyleUtils.getWidth()}]}>

                <Image resizeMode="cover" style={[styles.promotion_image, {width: StyleUtils.getWidth()}]}
                       source={{uri: item.banner.uri}}>
                </Image>
            </View>
        }
        return undefined;
    }

    createPromotionStyle() {
        return stylesPortrate;
    }
}