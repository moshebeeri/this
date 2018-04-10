import React, {Component} from 'react';
import {Image} from 'react-native';
import {actions} from 'react-native-navigation-redux-helpers';
import {
    Button,
    Container,
    Content,
    Header,
    Input,
    InputGroup,
    Left,
    ListItem,
    Right,
    Thumbnail,
    Title,
    View
} from 'native-base';
import stylesPortrate from './styles'
import FeedUiConverter from '../../../api/feed-ui-converter'
import StyleUtils from '../../../utils/styleUtils'
import FormUtils from "../../../utils/fromUtils";
import InViewPort from '../../../utils/inviewport'
import {PromotionHeader, SocialState, SubmitButton, ThisText} from '../../../ui/index';
import strings from "../../../i18n/i18n"
import navigationUtils from '../../../utils/navigationUtils'

let feedUiConverter = new FeedUiConverter();
export default class PromotionListView extends Component {
    constructor(props) {
        super(props);
    }

    showProduct(props, item) {
        navigationUtils.doNavigation(this.props.navigation, 'editPromotion', {item: item});
    }

    render() {
        return this.createPromotion(this.props.item);
    }

    createImageTage(item, styles) {
        if (item.banner) {
            return <View style={[styles.promotionImageContainer, {width: StyleUtils.getWidth()}]}>

                <Image resizeMode="cover" style={styles.promotion_image} source={{uri: item.banner.uri}}/>
            </View>
        }
        return <View/>
    }

    componentWillMount() {
        const {item, businessId} = this.props;
    }

    visited(visible) {
        const {item} = this.props;
        if (visible) {
            //    PageRefresher.visitedBusinessPromotion(item._id);
        }
    }

    createPromotion(promotionItem) {
        const {location} = this.props;
        const item = feedUiConverter.createPromotionAttributes(promotionItem, promotionItem.type)
        if (!item) {
            return <View/>
        }
        const styles = this.createStyle();
        const result =
            <InViewPort onChange={this.visited.bind(this)} key={promotionItem._id} style={[styles.promotion_container, {
                marginTop: 0.5,
                marginBottom: 9.5,
                width: StyleUtils.getWidth()
            }]}>


                {this.createImageTage(item, styles)}

                <View style={[styles.promotion_card, {padding: 5, width: StyleUtils.getWidth()}]}>

                    <PromotionHeader item={item} type={promotionItem.type} titleText={item.promotionTitle}
                                     titleValue={item.promotionValue} term={item.promotionTerm}/>


                    <View style={[styles.promotionDetailsContainer, {width: StyleUtils.getWidth()}]}>
                        <View style={styles.promotionLoctionContainer}>
                            <View><ThisText style={styles.detailsTitleText}>{strings.Location}</ThisText></View>
                            {promotionItem.location && <View><ThisText
                                style={styles.detailsText}>{FormUtils.getDistanceString(location.lat, location.long, promotionItem.location.lat, promotionItem.location.lng)}</ThisText>
                            </View>}
                        </View>
                        <View style={styles.expireDateContainer}>
                            <View><ThisText style={styles.detailsTitleText}>{strings.Expire}</ThisText></View>
                            <View><ThisText style={styles.detailsText}>{item.endDate}</ThisText></View>
                        </View>
                        <View style={styles.editButtonContainer}>
                            <SubmitButton title={strings.Edit.toUpperCase()} color="#e65100"
                                          onPress={this.showProduct.bind(this, this.props, this.props.item)}/>
                        </View>
                    </View>
                    <View style={[styles.promotionAnalyticsContainer, {width: StyleUtils.getWidth()}]}>

                        <View style={styles.promotionTotalsAttribute}>
                            <ThisText style={styles.detailsTitleText}>{strings.Total} </ThisText>
                            <ThisText style={styles.promotion_addressText} note>{item.quantity} </ThisText>

                        </View>
                        {promotionItem.social_state && <View style={styles.promotionSavedsAttribute}>

                            <ThisText style={styles.detailsTitleSavedText}>{strings.Saved}</ThisText>
                            <ThisText style={styles.promotion_addressText_saved}
                                      note>{promotionItem.social_state.saves}</ThisText>

                        </View>}
                        {promotionItem.social_state && <View style={styles.promotionAnalyticsAttribute}>

                            <ThisText style={styles.detailsTitleText}>{strings.Used}</ThisText>
                            <ThisText style={styles.promotion_addressText}
                                      note>{promotionItem.social_state.realizes}</ThisText>

                        </View>}

                    </View>

                    {promotionItem.social_state &&
                    <View style={{paddingTop: 5}}>
                        <SocialState disabled shares={promotionItem.social_state.shares}
                                     likes={promotionItem.social_state.likes}
                                     comments={promotionItem.social_state.comments}/>
                    </View>}


                </View>
            </InViewPort>
        return result;
    }

    createImageTag(item, styles) {
        if (item.banner) {
            return <Image resizeMode="cover" style={styles.promotion_image} source={{uri: item.banner.uri}}></Image>
        }
        return undefined;
    }

    createStyle() {
        return stylesPortrate;
    }
}
