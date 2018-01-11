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
    Text,
    Thumbnail,
    Title,
    View
} from 'native-base';
import stylesPortrate from './styles'
import FeedUiConverter from '../../../api/feed-ui-converter'
import StyleUtils from '../../../utils/styleUtils'
import FormUtils from "../../../utils/fromUtils";
import {PromotionHeader, SocialState, SubmitButton} from '../../../ui/index';
import strings from "../../../i18n/i18n"

let feedUiConverter = new FeedUiConverter();
export default class PromotionListView extends Component {
    constructor(props) {
        super(props);
    }

    showProduct(props, item) {
        this.props.navigation.navigate('editPromotion', {item: item});
    }

    render() {
        return this.createPromotion(this.props.item);
    }

    createImageTage(item, styles) {
        if (item.banner) {
            return <View style={[styles.promotionImageContainer, {width: StyleUtils.getWidth()}]}>

                <Image resizeMode="cover" style={styles.promotion_image} source={{uri: item.banner.uri}}></Image>
            </View>
        }
        return <View/>
    }

    createPromotion(promotionItem) {
        const {location} = this.props;
        const item = feedUiConverter.createPromotionAttributes(promotionItem, promotionItem.type)
        if (!item) {
            return <View></View>
        }
        const styles = this.createStyle();
        const result =
            <View key={promotionItem._id} style={[styles.promotion_container, {width: StyleUtils.getWidth()}]}>


                {this.createImageTage(item, styles)}

                <View style={[styles.promotion_card, {width: StyleUtils.getWidth()}]}>

                    <PromotionHeader type={promotionItem.type} titleText={item.promotionTitle}
                                     titleValue={item.promotionValue} term={item.promotionTerm}/>

                    <View style={[styles.promotionInformation, {width: StyleUtils.getWidth()}]}>


                        <Text style={styles.promotionInfoTextI}>{item.name} - {item.description}</Text>
                    </View>
                    <View style={styles.promotionDetailsContainer}>
                        <View style={styles.promotionLoctionContainer}>
                            <View><Text style={styles.detailsTitleText}>{strings.Location}</Text></View>
                            <View><Text
                                style={styles.detailsText}>{FormUtils.getDistanceString(location.lat, location.long, promotionItem.location.lat, promotionItem.location.lng)}</Text></View>
                        </View>
                        <View style={styles.expireDateContainer}>
                            <View><Text style={styles.detailsTitleText}>{strings.Expire}</Text></View>
                            <View><Text style={styles.detailsText}>{item.endDate}</Text></View>
                        </View>
                        <View style={styles.editButtonContainer}>
                            <SubmitButton title={strings.Edit.toUpperCase()} color="#e65100"
                                          onPress={this.showProduct.bind(this, this.props, this.props.item)}/>
                        </View>
                    </View>
                    <View style={[styles.promotionAnalyticsContainer, {width: StyleUtils.getWidth()}]}>

                        <View style={styles.promotionAnalyticsAttribute}>
                            <Text>{strings.Total.toUpperCase()} </Text>
                            <Text style={styles.promotion_addressText} note>{item.quantity} </Text>

                        </View>
                        <View style={styles.promotionAnalyticsAttribute}>

                            <Text>{strings.Saved.toUpperCase()}</Text>
                            <Text style={styles.promotion_addressText}
                                  note>{promotionItem.social_state.saves}</Text>

                        </View>
                        <View style={styles.promotionAnalyticsAttribute}>

                            <Text>{strings.Used.toUpperCase()}</Text>
                            <Text style={styles.promotion_addressText} note>{promotionItem.social_state.realizes}</Text>

                        </View>

                    </View>

                    <SocialState disabled shares={promotionItem.social_state.shares}
                                 likes={promotionItem.social_state.likes}
                                 comments={promotionItem.social_state.comments}/>


                </View>
            </View>
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
