import React, {Component} from 'react';
import {Image, Text, View} from 'react-native';
import {Button, Icon, Input} from 'native-base';
import styles from './styles';

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

                    <View style={{flex: 5}}>
                        <View style={{flex: 0.2, flexDirection: 'row', margin: 5}}>
                            <View style={styles.promotionValue}>
                                <Text adjustsFontSizeToFit style={titleValueStyle}>{ILS}{discount}</Text>
                            </View>
                            <View style={styles.promotiontDescription}>
                                <View style={{justifyContent: 'space-around'}}>
                                    <Text adjustsFontSizeToFit style={titleTextStyle}>Reduced</Text>
                                    <Text adjustsFontSizeToFit style={{
                                        marginTop: -4,
                                        textDecorationLine: "line-through"
                                    }}>{ILS}{totalValue} </Text>

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
                let discountOn = 'All Store';
                if (promotion.promotionEntity.condition.product) {
                    discountOn = 'On ' + promotion.promotionEntity.condition.product.name
                }
                return <View style={styles.promotionHeader}>

                    <View style={{flex: 5}}>
                        <View style={{flex: 0.2, flexDirection: 'row', margin: 5}}>
                            <View style={styles.promotionValue}>
                                <Text adjustsFontSizeToFit
                                      style={titleValueStyle}>{promotion.promotionEntity.percent.values[0]}%</Text>
                            </View>
                            <View style={styles.promotiontDescription}>
                                <View style={{justifyContent: 'space-around'}}>
                                    <Text adjustsFontSizeToFit style={titleTextStyle}>{discountOn}</Text>

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

                </View>
            case "X_FOR_Y":
                return <View style={styles.promotionHeader}>

                    <View style={{flex: 5}}>
                        <View style={{flex: 0.2, flexDirection: 'row', margin: 5}}>
                            <View style={styles.promotionValue}>
                                <Text adjustsFontSizeToFit
                                      style={titleValueStyle}>{ILS}{promotion.promotionEntity.x_for_y.values[0].pay}</Text>
                            </View>
                            <View style={styles.promotiontDescription}>
                                <View style={{justifyContent: 'space-around'}}>
                                    <Text adjustsFontSizeToFit
                                          style={titleTextStyle}>For {promotion.promotionEntity.x_for_y.values[0].eligible} {promotion.promotionEntity.condition.product.name}</Text>

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
            case "X+N%OFF":
                return <View style={styles.promotionHeader}>

                    <View style={{flex: 5}}>
                        <View style={{flex: 0.2, flexDirection: 'row', margin: 5}}>
                            <View style={styles.promotionValue}>
                                <Text adjustsFontSizeToFit
                                      style={titleValueStyle}>{promotion.promotionEntity.x_plus_n_percent_off.values[0].eligible}%</Text>
                            </View>
                            <View style={styles.promotiontDescription}>
                                <View style={{justifyContent: 'space-around'}}>
                                    <Text adjustsFontSizeToFit
                                          style={titleTextStyle}>for {promotion.promotionEntity.x_plus_n_percent_off.values[0].product.name} </Text>

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
            case "HAPPY_HOUR":
                return <View style={styles.promotionHeader}>

                    <View style={{flex: 5}}>
                        <View style={{flex: 0.2, flexDirection: 'row', margin: 5}}>
                            <View style={styles.promotionValue}>
                                <Text adjustsFontSizeToFit style={titleValueStyle}>{ILS}{titleValue}</Text>
                            </View>
                            <View style={styles.promotiontDescription}>
                                <View style={{justifyContent: 'space-around'}}>
                                    <Text adjustsFontSizeToFit style={titleTextStyle}>During {titleText} </Text>

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
            case "X+Y":
                return <View style={styles.promotionHeader}>

                    <View style={{flex: 5}}>
                        <View style={{flex: 0.2, flexDirection: 'row', margin: 5}}>
                            <View style={styles.promotionValue}>
                                <Text adjustsFontSizeToFit
                                      style={titleValueStyle}>{promotion.promotionEntity.x_plus_y.values[0].buy}
                                    + {promotion.promotionEntity.x_plus_y.values[0].eligible}</Text>
                            </View>
                            <View style={styles.promotiontDescription}>
                                <View style={{justifyContent: 'space-around'}}>
                                    <Text adjustsFontSizeToFit
                                          style={titleTextStyle}>On {promotion.promotionEntity.x_plus_y.values[0].product.name} </Text>

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
            case "PUNCH_CARD":
                return <View style={styles.promotionHeader}>

                    <View style={{flex: 5}}>
                        <View style={{flex: 0.2, flexDirection: 'row', margin: 5}}>
                            <View style={styles.promotionValue}>
                                <Text adjustsFontSizeToFit style={titleValueStyle}>{titleText}</Text>
                            </View>
                            <View style={styles.promotiontDescription}>
                                <View style={{justifyContent: 'space-around'}}>
                                    {/*<Text adjustsFontSizeToFit style={titleTextStyle}>On {promotion.promotionEntity.x_plus_y.values[0].product.name} </Text>*/}

                                </View>
                            </View>
                        </View>
                        <View style={{flex: 11, alignItems: 'flex-start', justifyContent: 'flex-start'}}>
                            <Text numberOfLines={3} style={{marginLeft: 10}}>{promotion.description}</Text>
                        </View>
                    </View>
                    {promotion.banner && <View style={styles.promotionView}>
                        <Image resizeMode="cover" style={styles.promotionImage} source={{uri: promotion.banner.uri}}>
                        </Image>
                    </View>}

                </View>;
            default:
                return <View style={styles.promotionHeader}>


                </View>;
        }
    }
}
