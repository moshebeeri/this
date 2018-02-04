import React, {Component} from 'react';
import {Image, Text, View} from 'react-native';
import {Button, Icon, Input, Thumbnail} from 'native-base';
import styles from './styles';

import strings from "../../i18n/i18n"

const ILS = '₪';
export default class PromotionHeaderSnippet extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const {promotion, type, titleValue, titleText, term, business} = this.props;


        switch (type) {
            case "REDUCED_AMOUNT":
                let totalValue = promotion.promotionEntity.reduced_amount.values[0].price * promotion.promotionEntity.reduced_amount.quantity;
                let discount = promotion.promotionEntity.reduced_amount.values[0].pay;
                return <View style={{flex:1,justifyContent:'center',alignItems:'center',marginLeft:15,flexDirection: 'row'}}>
                    {promotion.banner && <Thumbnail square small source={{uri: promotion.banner.uri}}/>}
                    <View style={{flex:1,justifyContent:'flex-start',marginLeft:5,alignItems:'flex-start'}}>
                        <Text>{promotion.business.name}</Text>
                        <Text>{strings.ReduceAmountShortDescription.formatUnicorn(totalValue,discount)}</Text>

                    </View>
                </View>
            case "PERCENT":
                let discountOn = strings.AllStore;
                if (promotion.promotionEntity.condition.product) {
                    discountOn = promotion.promotionEntity.condition.product.name
                }
                return <View style={{flex:1,justifyContent:'center',alignItems:'center',marginLeft:15,flexDirection: 'row'}}>
                    {promotion.banner &&  <Thumbnail square small source={{uri: promotion.banner.uri}}/>}
                        <View style={{flex:1,justifyContent:'flex-start',marginLeft:5,alignItems:'flex-start'}}>
                            <Text>{promotion.business.name}</Text>
                            <Text>{strings.DiscountShortDescription.formatUnicorn(promotion.promotionEntity.percent.values[0],discountOn)}</Text>

                        </View>
                    </View>
            case "X_FOR_Y":
                return <View style={{flex:1,justifyContent:'center',alignItems:'center',marginLeft:15,flexDirection: 'row'}}>
                    {promotion.banner &&  <Thumbnail square small source={{uri: promotion.banner.uri}}/>}
                    <View style={{flex:1,justifyContent:'flex-start',marginLeft:5,alignItems:'flex-start'}}>
                        <Text>{promotion.business.name}</Text>
                        <Text>{strings.XForYShortDescription.formatUnicorn(promotion.promotionEntity.x_for_y.values[0].pay,promotion.promotionEntity.x_for_y.values[0].eligible,promotion.promotionEntity.condition.product.name)}</Text>

                    </View>
                </View>


            case "X+N%OFF":

                return <View style={{flex:1,justifyContent:'center',alignItems:'center',marginLeft:15,flexDirection: 'row'}}>
                    {promotion.banner &&   <Thumbnail square small source={{uri: promotion.banner.uri}}/>}
                    <View style={{flex:1,justifyContent:'flex-start',marginLeft:5,alignItems:'flex-start'}}>
                        <Text>{promotion.business.name}</Text>
                        <Text>{strings.XForYPercentageOffShortDescription.formatUnicorn(promotion.condition.product.name,promotion.promotionEntity.x_plus_n_percent_off.values[0].product.name,promotion.promotionEntity.x_plus_n_percent_off.values[0].eligible)}</Text>

                    </View>
                </View>

            case "HAPPY_HOUR":
                return <View style={{flex:1,justifyContent:'center',alignItems:'center',marginLeft:15,flexDirection: 'row'}}>
                    {promotion.banner && <Thumbnail square small source={{uri: promotion.banner.uri}}/>}
                    <View style={{flex:1,justifyContent:'flex-start',marginLeft:5,alignItems:'flex-start'}}>
                        <Text>{promotion.business.name}</Text>
                        <Text>{strings.HappyHourShortDescription.formatUnicorn(promotion.promotionEntity.happy_hour.values[0].pay,promotion.promotionEntity.condition.product.name)}</Text>

                    </View>
                </View>

            case "X+Y":
                return <View style={{flex:1,justifyContent:'center',alignItems:'center',marginLeft:15,flexDirection: 'row'}}>
                    {promotion.banner &&   <Thumbnail square small source={{uri: promotion.banner.uri}}/>}
                    <View style={{flex:1,justifyContent:'flex-start',marginLeft:5,alignItems:'flex-start'}}>
                        <Text>{promotion.business.name}</Text>
                        <Text>{strings.XYPattern.formatUnicorn(promotion.x_plus_y.values[0].buy, promotion.condition.product.name, promotion.x_plus_y.values[0].eligible, promotion.x_plus_y.values[0].product.name)}</Text>

                    </View>
                </View>

            case "PUNCH_CARD":
                return <View style={{flex:1,justifyContent:'center',alignItems:'center',marginLeft:15,flexDirection: 'row'}}>
                    {promotion.banner &&   <Thumbnail square small source={{uri: promotion.banner.uri}}/>}
                    <View style={{flex:1,justifyContent:'flex-start',marginLeft:5,alignItems:'flex-start'}}>
                        <Text>{promotion.business.name}</Text>
                        <Text>{strings.punchCardTerm.formatUnicorn(promotion.punches)}</Text>

                    </View>
                </View>
            default:
                return <View style={styles.promotionHeader}>


                </View>;
        }
    }
}
