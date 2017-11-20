import React, {Component} from 'react';
import {Image, Text, View} from 'react-native';
import {Button, Icon, Input} from 'native-base';
import styles from './styles';
import {PunchView} from '../index'

const ILS = '₪';
export default class PromotionHeaderSnippet extends Component {
    constructor(props) {
        super(props);
    }


    render() {
        const {promotion, type, titleValue, titleText, term, business} = this.props;
        let titleValueStyle = styles.titleValue;
        let titleTextStyle = styles.titleText;
        let XplusYtitleValueStyle = styles.XplusYtitleValue;
        let puncCardtitleValue = styles.puncCardtitleValue;
        if (business) {
            titleValueStyle = styles.titleValueFeed;
            titleTextStyle = styles.titleTextFeed;
            XplusYtitleValueStyle = styles.XplusYtitleValueFeed;
            puncCardtitleValue = styles.puncCardtitleValueFeed;
        }
        switch (type) {
            case "REDUCED_AMOUNT":
                let totalValue = promotion.promotionEntity.reduced_amount.values[0].price * promotion.promotionEntity.reduced_amount.quantity;
                let discount = promotion.promotionEntity.reduced_amount.values[0].pay;
                return <View style={styles.promotionHeader}>

                    <View style={{flex:5}}>
                        <View style={{flex: 0.2, flexDirection: 'row', margin: 5}}>
                            <View style={styles.promotionValue}>
                                <Text adjustsFontSizeToFit style={titleValueStyle}>{ILS}{discount}</Text>
                            </View>
                            <View style={styles.promotiontDescription}>
                                <View style={{justifyContent: 'space-around'}}>
                                    <Text adjustsFontSizeToFit style={titleTextStyle}>Reduced</Text>
                                    <Text adjustsFontSizeToFit style={{marginTop: -4,   textDecorationLine: "line-through"}}>{ILS}{totalValue} </Text>

                                </View>
                            </View>
                        </View>
                        <View style={{flex: 11, alignItems: 'flex-start', justifyContent: 'flex-start'}}>
                            <Text numberOfLines={3} style={{marginLeft: 10}}>{promotion.description}</Text>
                        </View>
                    </View>
                    <View style={styles.promotionView}>
                        <Image resizeMode="cover" style={styles.promotionImage} source={{uri: promotion.banner.uri}}>
                        </Image>
                    </View>

                </View>;
            case "PERCENT":
                return <View style={styles.promotionHeader}>
                    <View style={styles.promotionValue}>
                        <Text adjustsFontSizeToFit style={titleValueStyle}>{titleValue}%</Text>
                    </View>
                    <View style={styles.promotiontDescription}>
                        <View>
                            <Text adjustsFontSizeToFit style={titleTextStyle}>{titleText}</Text>
                        </View>
                        <View>
                            <Text adjustsFontSizeToFit style={styles.promotionTermlTextStyle}>{term}</Text>
                        </View>
                    </View>
                </View>;
            case "X_FOR_Y":
                return <View style={styles.promotionHeader}>
                    <View style={styles.promotionValue}>
                        <Text adjustsFontSizeToFit style={titleValueStyle}>{ILS}{titleValue}</Text>
                    </View>
                    <View style={styles.promotiontDescription}>
                        <View>
                            <Text adjustsFontSizeToFit style={titleTextStyle}>{titleText}</Text>
                        </View>
                        <View>
                            <Text adjustsFontSizeToFit style={styles.promotionTermlTextStyle}>{term}</Text>
                        </View>
                    </View>
                </View>;
            case "X+N%OFF":
                return <View style={styles.promotionHeader}>
                    <View style={styles.promotionValue}>
                        <Text adjustsFontSizeToFit style={titleValueStyle}>{titleValue}%</Text>
                    </View>
                    <View style={styles.promotiontDescription}>
                        <View>
                            <Text adjustsFontSizeToFit style={titleTextStyle}>{titleText}</Text>
                        </View>
                        <View>
                            <Text adjustsFontSizeToFit style={styles.promotionTermlTextStyle}>{term}</Text>
                        </View>
                    </View>
                </View>;
            case "HAPPY_HOUR":
                return <View style={styles.promotionHeader}>
                    <View style={styles.promotionValue}>
                        <Text numberOfLines={1} allowFontScaling={true} adjustsFontSizeToFit
                              style={titleValueStyle}>{ILS}{titleValue}</Text>
                    </View>
                    <View style={styles.promotiontHappyDescription}>
                        <View style={{flex: 0.4}}>
                            <Text allowFontScaling={true} adjustsFontSizeToFit={true}
                                  style={styles.titleHappyTextFeed}>{titleText}</Text>
                        </View>
                        <View View style={{flex: 1}}>
                            <Text allowFontScaling={true} adjustsFontSizeToFit={true} numberOfLines={3}
                                  style={styles.promotionTermlTextStyle}>{term}</Text>
                        </View>
                    </View>
                </View>;
            case "X+Y":
                return <View style={styles.promotionHeader}>
                    <View style={styles.promotionValue}>
                        <Text allowFontScaling={true} adjustsFontSizeToFit
                              style={XplusYtitleValueStyle}>{titleValue}</Text>
                    </View>
                    <View style={styles.promotiontDescription}>
                        <View>
                            <Text adjustsFontSizeToFit style={titleTextStyle}>{titleText}</Text>
                        </View>
                        <View>
                            <Text adjustsFontSizeToFit style={styles.promotionTermlTextStyle}>{term}</Text>
                        </View>
                    </View>
                </View>;
            case "PUNCH_CARD":
                return <View style={styles.promotionPunchHeader}>
                    <View style={styles.promotionPunchValue}>
                        <Text adjustsFontSizeToFit style={puncCardtitleValue}>{titleText}</Text>
                    </View>
                    <PunchView feed numberOfPunches={term}/>
                </View>;
            default:
                return <View style={styles.promotionHeader}>


                </View>;
        }
    }
}
