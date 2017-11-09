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
import stylesLandscape from './styles_landscape'
import FeedUiConverter from '../../../api/feed-ui-converter'
import StyleUtils from '../../../utils/styleUtils'
import FormUtils from "../../../utils/fromUtils";
import {PunchView, SocialState, SubmitButton} from '../../../ui/index';

const ILS = '₪';
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
            return <View style={styles.promotionImageContainer}>
                <Image resizeMode="cover" style={styles.promotion_image} source={{uri: item.banner.uri}}></Image>
            </View>
        }
        return <View/>
    }

    createPromotion(promotionItem) {
        const {location} = this.props;
        const item = feedUiConverter.createPromotionAttributes(promotionItem, promotionItem.type)
        if(!item){
            return <View></View>
        }
        const styles = this.createStyle();
        const result =
            <View key={promotionItem._id}style={styles.promotion_container}>
                {this.createImageTage(item, styles)}

                <View style={styles.promotion_card}>

                    {this.createPromotionHeader(item, promotionItem.type, styles)}
                    <View style={styles.promotionInformation}>
                        <Text style={styles.promotionInfoTextI}>{item.name} - {item.description}</Text>
                    </View>
                    <View style={styles.promotionDetailsContainer}>
                        <View style={styles.promotionLoctionContainer}>
                            <View><Text style={styles.detailsTitleText}>Location</Text></View>
                            <View><Text
                                style={styles.detailsText}>{FormUtils.getDistanceFromLatLonInKm(location.lat, location.long, promotionItem.location.lat, promotionItem.location.lng)}
                                km away</Text></View>
                        </View>
                        <View style={styles.expireDateContainer}>
                            <View><Text style={styles.detailsTitleText}>Expire</Text></View>
                            <View><Text style={styles.detailsText}>{item.endDate}</Text></View>
                        </View>
                        <View style={styles.editButtonContainer}>
                            <SubmitButton title="EDIT" color="#e65100"
                                          onPress={this.showProduct.bind(this, this.props, this.props.item)}/>
                        </View>
                    </View>
                    <View style={styles.promotionAnalyticsContainer}>
                        <View style={styles.promotionAnalyticsAttribute}>
                            <Text >TOTAL </Text>
                            <Text style={styles.promotion_addressText} note>{item.quantity} </Text>

                        </View>
                        <View style={styles.promotionAnalyticsAttribute}>

                            <Text >SAVED</Text>
                            <Text style={styles.promotion_addressText}
                                note>{promotionItem.social_state.saves}</Text>

                        </View>
                        <View style={styles.promotionAnalyticsAttribute}>

                            <Text >USED</Text>
                            <Text style={styles.promotion_addressText} note>{promotionItem.social_state.realizes}</Text>

                        </View>

                    </View>

                    <SocialState disabled shares={promotionItem.social_state.shares}
                                 likes={promotionItem.social_state.likes} comments={0}/>


                </View>
            </View>
        return result;
    }

    createPromotionHeader(promotion, type, styles) {
        switch (type) {
            case "REDUCED_AMOUNT":
                return <View style={styles.promotionHeader}>
                    <View style={styles.promotionValue}>
                        <Text style={styles.titleValue}>{ILS}{promotion.promotionValue}</Text>
                    </View>
                    <View style={styles.promotiontDescription}>
                        <View>
                            <Text style={styles.titleText}>{promotion.promotionTitle}</Text>
                        </View>
                        <View>
                            <Text style={styles.promotionTermlTextStyle}>{promotion.promotionTerm}</Text>
                        </View>
                    </View>
                </View>;
            case "PERCENT":
                return <View style={styles.promotionHeader}>
                    <View style={styles.promotionValue}>
                        <Text style={styles.titleValue}>{promotion.promotionValue}%</Text>
                    </View>
                    <View style={styles.promotiontDescription}>
                        <View>
                            <Text style={styles.titleText}>{promotion.promotionTitle}</Text>
                        </View>
                        <View>
                            <Text style={styles.promotionTermlTextStyle}>{promotion.promotionTerm}</Text>
                        </View>
                    </View>
                </View>;
            case "X_FOR_Y":
                return <View style={styles.promotionHeader}>
                    <View style={styles.promotionValue}>
                        <Text style={styles.titleValue}>{ILS}{promotion.promotionValue}</Text>
                    </View>
                    <View style={styles.promotiontDescription}>
                        <View>
                            <Text style={styles.titleText}>{promotion.promotionTitle}</Text>
                        </View>
                        <View>
                            <Text style={styles.promotionTermlTextStyle}>{promotion.promotionTerm}</Text>
                        </View>
                    </View>
                </View>;
            case "X+N%OFF":
                return <View style={styles.promotionHeader}>
                    <View style={styles.promotionValue}>
                        <Text style={styles.titleValue}>{promotion.promotionValue}%</Text>
                    </View>
                    <View style={styles.promotiontDescription}>
                        <View>
                            <Text style={styles.titleText}>{promotion.promotionTitle}</Text>
                        </View>
                        <View>
                            <Text style={styles.promotionTermlTextStyle}>{promotion.promotionTerm}</Text>
                        </View>
                    </View>
                </View>;
            case "HAPPY_HOUR":
                return <View style={styles.promotionHeader}>
                    <View style={styles.promotionValue}>
                        <Text style={styles.titleValue}>{ILS}{promotion.promotionValue}</Text>
                    </View>
                    <View style={styles.promotiontDescription}>
                        <View>
                            <Text style={styles.titleText}>{promotion.promotionTitle}</Text>
                        </View>
                        <View>
                            <Text style={styles.promotionTermlTextStyle}>{promotion.promotionTerm}</Text>
                        </View>
                    </View>
                </View>;
            case "X+Y":
                return <View style={styles.promotionHeader}>
                    <View style={styles.promotionValue}>
                        <Text style={styles.XplusYtitleValue}>{promotion.promotionValue}</Text>
                    </View>
                    <View style={styles.promotiontDescription}>
                        <View>
                            <Text style={styles.titleText}>{promotion.promotionTitle}</Text>
                        </View>
                        <View>
                            <Text style={styles.promotionTermlTextStyle}>{promotion.promotionTerm}</Text>
                        </View>
                    </View>
                </View>;
            case "PUNCH_CARD":
                return <View style={styles.promotionPunchHeader}>
                    <View style={styles.promotionPunchValue}>
                        <Text style={styles.puncCardtitleValue}>{promotion.promotionTitle}</Text>
                    </View>
                    <PunchView numberOfPunches={promotion.punches}/>
                </View>;
            default:
                return <View style={styles.promotionHeader}>


                </View>;
        }
    }

    createImageTag(item, styles) {
        if (item.banner) {
            return <Image resizeMode="cover" style={styles.promotion_image} source={{uri: item.banner.uri}}></Image>
        }
        return undefined;
    }

    createStyle() {
        if (StyleUtils.isLandscape()) {
            return stylesLandscape;
        }
        return stylesPortrate;
    }
}

