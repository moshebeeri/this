/**
 * Created by roilandshut on 23/07/2017.
 */
import React, {Component} from 'react';
import {Dimensions, Linking, TouchableOpacity} from 'react-native';
import instanceUtils from '../../../../utils/instanceUtils'
import navigationUtils from '../../../../utils/navigationUtils'
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
    PunchView,
    SocialState,
    SubmitButton,
    ThisText
} from '../../../../ui/index';
import FormUtils from "../../../../utils/fromUtils";
import strings from "../../../../i18n/i18n"

const {width, height} = Dimensions.get('window');
const vh = height / 100;
export default class FeedPromotion extends Component {
    constructor() {
        super();
        this.state={savePressed: false};
    }

    componentWillMount() {
        const {item} = this.props;
    }

    visited(visible) {
        const {item, actions, group} = this.props;
        if (visible && actions && actions.setVisibleItem) {
            if (group) {
                actions.setVisibleItem(item.fid, group._id);
            } else {
                actions.setVisibleItem(item.fid);
            }
        }
    }

    shouldComponentUpdate() {
        const {item, shouldUpdateFeeds} = this.props;
        if (!shouldUpdateFeeds) {
            return true;
        }
        if (shouldUpdateFeeds[item.id] || shouldUpdateFeeds[item.id] === undefined) {
            return true
        }
        return false;
    }

    showAddress() {
        const {item} = this.props;
        let address = item.business.country + ' ' + item.business.city + ' ' + item.business.address
        let encodeAddress = encodeURI(address);
        Linking.openURL('https://www.google.com/maps/search/?api=1&query=' + encodeAddress);
    }

    componentDidUpdate() {
        if (this.props.actions && this.props.actions.finishUpdateItem) {
            this.props.actions.finishUpdateItem(this.props.item.id)
        }
    }

    saveInstance(){
        const{save,item} = this.props;
        this.setState({
            savePressed: true,
        })

        navigationUtils.doAction(save, item.id)
    }

    render() {
        const {
            showActions, item, save, shared, like, unlike, showUsers, comment, token, location, hideSocial, realize,
            scanner, group, minimizeSize
        }
            = this.props;
        let categoruTitle = item.categoryTitle;
        if (item.business) {
            categoruTitle = item.business.categoryTitle;
        }
        const styles = this.createPromotionStyle();
        const image = this.createImageComponent(item, styles, categoruTitle, showActions);
        const container = this.createContainerStyle(item);
        let promotaionDesc = styles.promotiosDescription;
        if (shared) {
            promotaionDesc = styles.promotiosShareDescription;
        }
        const result =
            <View style={[container, {width: StyleUtils.getWidth() - minimizeSize, backgroundColor: `white`}]}>
                <View style={[styles.promotion_card, {
                    backgroundColor: 'white',
                    width: StyleUtils.getWidth() - minimizeSize
                }]}>
                    {item.actionOff && <View style={{
                        marginLeft: StyleUtils.scale(5),
                        alignItems: 'flex-start',
                        justifyContent: 'center',
                        width: StyleUtils.getWidth()
                    }}>
                        <ThisText style={{
                            fontSize: StyleUtils.scale(19),
                            color: '#2db6c8',
                        }}>{strings.eligibleForNewPromotion}</ThisText>
                    </View>}
                    {!scanner ? <View style={{width: StyleUtils.getWidth(), backgroundColor: 'white'}}>
                            <View style={[promotaionDesc, {backgroundColor: 'white', width: StyleUtils.getWidth()}]}>
                                <PromotionHeader item={item} type={item.promotion} feed titleText={item.promotionTitle}
                                                 titleValue1={item.promotionValue1} titleValue2={item.promotionValue2}
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

                    {item.points && <View style={{

                        marginBottom: StyleUtils.scale(5),
                        alignItems: 'flex-start',
                        justifyContent: 'center',
                        width: StyleUtils.getWidth()
                    }}>
                        <ThisText style={{
                            marginLeft: StyleUtils.scale(10),
                            marginRight: StyleUtils.scale(10),
                            color: '#839192',
                            fontSize: StyleUtils.scale(13),
                        }}>{strings.PointsPromotionMessage.formatUnicorn(item.points)}</ThisText>
                    </View>}
                    {image}
                    <ThisText style={{ marginTop: 2,marginRight:5,marginLeft:5,fontWeight:'bold',backgroundColor:'transparent', color:'#839192'}}>{item.name}</ThisText>
                    {!shared && location &&
                    <View style={[styles.promotionDetailsContainer, {width: StyleUtils.getWidth()}]}>
                        <TouchableOpacity onPress={() => this.showAddress()} style={styles.promotionLoctionContainer}>
                            <View><ThisText style={styles.detailsTitleText}>{strings.Location}</ThisText></View>
                            <View><ThisText
                                style={styles.detailsText}>{FormUtils.getDistanceString(location.lat, location.long, item.location.lat, item.location.lng)}</ThisText></View>
                        </TouchableOpacity>
                        <View style={styles.expireDateContainer}>
                            <View><ThisText style={styles.detailsTitleText}>{strings.Expire}</ThisText></View>
                            <View><ThisText style={styles.detailsText}>{item.endDate}</ThisText></View>
                        </View>
                        {instanceUtils.showClaim(item) && !this.state.savePressed &&
                        <View style={styles.editButtonContainer}>
                            <SubmitButton
                                title={strings.Claim.toUpperCase()} color={'#2db6c8'}
                                onPress={this.saveInstance.bind(this)}/>
                        </View>
                        }
                        {instanceUtils.showRedeem(item, this.state.savePressed) &&
                        <View style={styles.editButtonContainer}>
                            <SubmitButton title={strings.Realize.toUpperCase()} color={'#2db6c8'}
                                          onPress={() => realize(item)}/>
                        </View>
                        }

                        {instanceUtils.showRedeemed(item) &&
                        <View style={styles.editButtonContainer}>
                            <SubmitButton disabled title={strings.Realized.toUpperCase()} color={'#cccccc'}
                                          onPress={() => realize(item)}/>
                        </View>}
                        {instanceUtils.showExpired(item) &&
                        <View style={styles.editButtonContainer}>
                            <SubmitButton disabled title={strings.Expired.toUpperCase()} color={'#cccccc'}
                                          onPress={() => realize(item)}/>
                        </View>}
                        {instanceUtils.showInActive(item) &&
                        <View style={styles.editButtonContainer}>
                            <ThisText style={{width: StyleUtils.scale(100) , color: '#839192'}}>{strings.InActive}</ThisText>
                        </View>}

                    </View>}

                    {!hideSocial && item.social &&
                    <View style={[styles.promotion_bottomContainer, {width: StyleUtils.getWidth()}]}>

                        {item.social && <SocialState feed comments={item.social.comments} onPressComment={comment}
                                                     like={item.social.like} likes={item.social.likes}
                                                     onPressUnLike={() => unlike(item.id, token)}
                                                     onPressLike={() => like(item.id, token)}
                                                     shareDisabled={shared}
                                                     groupChat={group && group.chat_policy === 'ON'}
                                                     sharable={item.sharable}
                                                     social={item.social}
                                                     share={item.social.share} shares={item.social.shares}
                                                     shareAction={showUsers}/>}
                    </View>}


                </View>
            </View>;
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
            marginBottom: 10,
            alignItems: 'center',
            flexDirection: 'column',
        }
    }

    createImageComponent(item, styles, categoruTitle, showActions) {
        const {hideMenu} = this.props;
        if (item.banner) {
            return <View style={[styles.promotion_image_view, {width: StyleUtils.getWidth()}]}>
                <ImageController resizeMode="cover" style={[styles.promotion_image, {width: StyleUtils.getWidth()}]}
                                 source={{uri: item.banner.uri}}>
                </ImageController>

                <LinearGradient start={{x: 1, y: 1}} end={{x: 1, y: 0}}
                                locations={[0, 0.8]}
                                colors={['#00000099', 'transparent']} style={{
                    height: (item.promotion === 'PUNCH_CARD' ? StyleUtils.relativeHeight(30, 35) : StyleUtils.relativeHeight(15, 10)),
                    position: 'absolute',
                    justifyContent: 'flex-end',
                    backgroundColor: 'transparent',
                    bottom: 1,
                    alignItems: 'flex-end',
                    width: StyleUtils.getWidth()
                }}>
                    {item.promotion === 'PUNCH_CARD' &&
                    <View style={{marginBottom: StyleUtils.scale(5)}}>
                        <PunchView numberRealized={item.realizedPunches} feed={this.props.feed}
                                   numberOfPunches={item.punches}/>
                    </View>}

                    {item.business &&
                    <BusinessHeader navigation={this.props.navigation} business={item.business}
                                    categoryTitle={categoruTitle} businessLogo={item.business.logo}
                                    businessName={item.business.name} noMargin
                                    bgColor={'transparent'}
                                    textColor={'white'}
                                    hideMenu={hideMenu}

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