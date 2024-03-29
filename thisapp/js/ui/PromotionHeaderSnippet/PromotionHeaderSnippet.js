import React, {Component} from 'react';
import {View} from 'react-native';
import {Button, Icon, Input, Thumbnail} from 'native-base';
import styles from './styles';
import {ImageController, ThisText} from '../../ui/index';
import DateUtils from '../../utils/dateUtils'
import StyleUtils from '../../utils/styleUtils'
import strings from "../../i18n/i18n"
import SimpleLineIcons from "react-native-vector-icons/SimpleLineIcons";

let dateUtils = new DateUtils();
export default class PromotionHeaderSnippet extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const {promotion, type} = this.props;
        // const promoIcon = <ImageController style={{marginLeft:0, marginRight:12,alignItems: 'flex-start', width:18, height:18 }} source={require('../../../images/promoicon.png')}/>;
        const promoIcon = <SimpleLineIcons style={{marginLeft: 0, marginRight: 12}} size={StyleUtils.scale(18)} color={'#2db6c8'}
                                           name="tag"/>
        switch (type) {
            case "REDUCED_AMOUNT":
                let totalValue = promotion.promotionEntity.reduced_amount.values[0].price;
                let discount = promotion.promotionEntity.reduced_amount.values[0].pay;
                return <View style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginLeft: 0,
                    flexDirection: 'row'
                }}>
                    {promoIcon}
                    {promotion.banner && <ImageController thumbnail size={StyleUtils.scale(36)} source={{uri: promotion.banner.uri}}/>}
                    <View style={{flex: 1, justifyContent: 'flex-start', marginLeft: 12, alignItems: 'flex-start'}}>
                        <ThisText style={styles.promotionListLineTitleText}>{promotion.business.name}</ThisText>
                        <ThisText
                            style={styles.promotionListLineDescText}>{strings.ReduceAmountShortDescription.formatUnicorn(totalValue, discount)}</ThisText>

                    </View>
                </View>
            case "PERCENT":
                let discountOn = strings.AllStore;
                if (promotion.promotionEntity.condition.product) {
                    discountOn = promotion.promotionEntity.condition.product.name
                }
                //changed marginLeft to 0 why we dont have styles here? @yb
                //added styles - need to all other types
                return <View style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginLeft: 0,
                    flexDirection: 'row'
                }}>
                    {promoIcon}
                    {promotion.banner && <ImageController thumbnail size={30} source={{uri: promotion.banner.uri}}/>}
                    <View style={{flex: 1, justifyContent: 'flex-start', marginLeft: 12, alignItems: 'flex-start'}}>
                        <ThisText
                            style={styles.promotionListLineTitleText}>{strings.DiscountShortDescription.formatUnicorn(promotion.promotionEntity.percent.values[0], discountOn)}</ThisText>
                        <ThisText numberOfLines={1} ellipsizeMode='tail'
                                  style={styles.promotionTimeText}>{dateUtils.messageFormater(promotion.created)}</ThisText>

                    </View>
                </View>
            case "X_FOR_Y":
                return <View style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginLeft: 0,
                    flexDirection: 'row'
                }}>
                    {promoIcon}
                    {promotion.banner && <ImageController thumbnail size={30} source={{uri: promotion.banner.uri}}/>}
                    <View style={{flex: 1, justifyContent: 'flex-start', marginLeft: 12, alignItems: 'flex-start'}}>
                        <ThisText style={styles.promotionListLineTitleText}>{strings.XForYShortDescription.formatUnicorn(promotion.promotionEntity.x_for_y.values[0].pay, promotion.promotionEntity.x_for_y.values[0].eligible, promotion.promotionEntity.condition.product.name)}</ThisText>
                        <ThisText numberOfLines={1} ellipsizeMode='tail'
                                  style={styles.promotionTimeText}>{dateUtils.messageFormater(promotion.created)}</ThisText>

                    </View>
                </View>
            case "X+N%OFF":
                return <View style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginLeft: 0,
                    flexDirection: 'row'
                }}>
                    {promoIcon}
                    {promotion.banner && <ImageController thumbnail size={30} source={{uri: promotion.banner.uri}}/>}
                    <View style={{flex: 1, justifyContent: 'flex-start', marginLeft: 12, alignItems: 'flex-start'}}>
                        <ThisText style={styles.promotionListLineTitleText}>{strings.XForYPercentageOffShortDescription.formatUnicorn(promotion.promotionEntity.condition.product.name, promotion.promotionEntity.x_plus_n_percent_off.values[0].product.name, promotion.promotionEntity.x_plus_n_percent_off.values[0].eligible)}</ThisText>
                        <ThisText numberOfLines={1} ellipsizeMode='tail'
                                  style={styles.promotionTimeText}>{dateUtils.messageFormater(promotion.created)}</ThisText>

                    </View>
                </View>
            case "HAPPY_HOUR":
                return <View style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginLeft: 0,
                    flexDirection: 'row'
                }}>
                    {promoIcon}
                    {promotion.banner && <ImageController thumbnail size={30} source={{uri: promotion.banner.uri}}/>}
                    <View style={{flex: 1, justifyContent: 'flex-start', marginLeft: 12, alignItems: 'flex-start'}}>
                        <ThisText style={styles.promotionListLineTitleText}>{strings.HappyHourShortDescription.formatUnicorn(promotion.promotionEntity.happy_hour.values[0].pay, promotion.promotionEntity.condition.product.name)}</ThisText>
                        <ThisText numberOfLines={1} ellipsizeMode='tail'
                                  style={styles.promotionTimeText}>{dateUtils.messageFormater(promotion.created)}</ThisText>

                    </View>
                </View>
            case "X+Y":
                return <View style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginLeft: 0,
                    flexDirection: 'row'
                }}>
                    {promoIcon}
                    {promotion.banner && <ImageController thumbnail size={30} source={{uri: promotion.banner.uri}}/>}
                    <View style={{flex: 1, justifyContent: 'flex-start', marginLeft: 12, alignItems: 'flex-start'}}>
                        <ThisText style={styles.promotionListLineTitleText}>{strings.XYPattern.formatUnicorn(promotion.promotionEntity.x_plus_y.values[0].buy, promotion.promotionEntity.condition.product.name, promotion.promotionEntity.x_plus_y.values[0].eligible, promotion.promotionEntity.x_plus_y.values[0].product.name)}</ThisText>
                        <ThisText numberOfLines={1} ellipsizeMode='tail'
                                  style={styles.promotionTimeText}>{dateUtils.messageFormater(promotion.created)}</ThisText>

                    </View>
                </View>
            case "PUNCH_CARD":
                return <View style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginLeft: 0,
                    flexDirection: 'row'
                }}>
                    {promoIcon}

                    {promotion.banner && <ImageController thumbnail size={30} source={{uri: promotion.banner.uri}}/>}
                    <View style={{flex: 1, justifyContent: 'flex-start', marginLeft: 12, alignItems: 'flex-start'}}>
                        <ThisText style={styles.promotionListLineTitleText}>{strings.punchCardTerm.formatUnicorn(promotion.punches, promotion.promotionEntity.condition.product.name)}</ThisText>
                        <ThisText numberOfLines={1} ellipsizeMode='tail'
                                  style={styles.promotionTimeText}>{dateUtils.messageFormater(promotion.created)}</ThisText>

                    </View>
                </View>
            default:
                return <View style={styles.promotionHeader}>


                </View>;
        }
    }
}
