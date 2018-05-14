import React, {Component} from 'react';
import {Text, View} from 'react-native';
import {Button, Icon, Input} from 'native-base';
import styles from './styles';
import {ThisText} from '../index'
import StyleUtils from '../../utils/styleUtils'

const ILS = '₪';
export default class PromotionHeader extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const {item, type, titleValue, titleValue1, titleValue2, titleText, term, feed, columnStyle} = this.props;
        let fontColor = '#e65100';
        if (feed) {
            fontColor = '#2db6c8';
        }
        let titleValueStyle = styles.titleValueFeed;
        let titleTextStyle = styles.titleTextFeed;
        let happyHourTextStyle = styles.titleFeedHappyTextFeed
        let puncCardtitleValue = styles.puncCardtitleValueFeed;
        let promotionHeader = styles.promotionHeader;
        let promotionValue = styles.promotionValue;
        let promotiontDescription = styles.promotiontDescription;
        let promotionTermStyle = styles.promotionTermlTextStyle;
        if (columnStyle) {
            titleValueStyle = styles.titleValueColumnFeed;
            titleTextStyle = styles.titleTextColumnFeed;
            promotionHeader = styles.promotionHeaderColumn;
            promotionValue = styles.promotionColumnValue;
            promotiontDescription = styles.promotiontColumnDescription
            promotionTermStyle = styles.promotionColumnTermlTextStyle;
        }
        switch (type) {
            case "REDUCED_AMOUNT":
                return <View style={[promotionHeader, {width: StyleUtils.getWidth()}]}>
                    <View style={promotionValue}>

                        <ThisText style={[titleValueStyle, {color: fontColor}]}>{ILS}{titleValue}</ThisText>
                    </View>
                    <View style={promotiontDescription}>
                        <View style={{flex: 1}}>
                            <ThisText style={[titleTextStyle, {color: fontColor}]}>{titleText}</ThisText>
                        </View>
                        <View style={{flex: 1}}>
                            <ThisText style={promotionTermStyle}>{term}</ThisText>
                        </View>
                    </View>
                </View>;
            case "PERCENT":
                return <View style={[promotionHeader, {width: StyleUtils.getWidth()}]}>
                    <View style={promotionValue}>
                        <Text style={[titleValueStyle, {color: fontColor}]}>{titleValue}%</Text>

                    </View>
                    <View style={promotiontDescription}>
                        <View style={{flex: 1}}>
                            <ThisText style={[titleTextStyle, {color: fontColor}]}>{titleText}</ThisText>
                        </View>
                        <View style={{flex: 1}}>
                            <ThisText q style={promotionTermStyle}>{term}</ThisText>
                        </View>
                    </View>
                </View>;
            case "X_FOR_Y":
                return <View style={[promotionHeader, {width: StyleUtils.getWidth()}]}>
                    <View style={promotionValue}>
                        <ThisText style={[titleValueStyle, {color: fontColor}]}>{ILS}{titleValue}</ThisText>
                    </View>
                    <View style={promotiontDescription}>
                        <View style={{flex: 1}}>
                            <ThisText style={[titleTextStyle, {color: fontColor}]}>{titleText}</ThisText>
                        </View>
                        <View style={{flex: 1}}>
                            <ThisText style={promotionTermStyle}>{term}</ThisText>
                        </View>
                    </View>
                </View>;
            case "X+N%OFF":
                return <View style={[promotionHeader, {width: StyleUtils.getWidth()}]}>
                    <View style={promotionValue}>
                        <ThisText style={[titleValueStyle, {color: fontColor}]}>{titleValue}%</ThisText>
                    </View>
                    <View style={promotiontDescription}>
                        <View style={{flex: 1}}>
                            <ThisText style={[titleTextStyle, {color: fontColor}]}>{titleText}</ThisText>
                        </View>
                        <View style={{flex: 1}}>
                            <ThisText style={promotionTermStyle}>{term}</ThisText>
                        </View>
                    </View>
                </View>;
            case "HAPPY_HOUR":
                return <View style={[promotionHeader, {width: StyleUtils.getWidth()}]}>
                    <View style={promotionValue}>
                        <ThisText numberOfLines={1} allowFontScaling={true}
                                  style={[titleValueStyle, {color: fontColor}]}>{ILS}{titleValue}</ThisText>
                    </View>
                    <View style={styles.promotiontHappyDescription}>
                        <View style={{flex: 1, justifyContent: 'flex-start'}}>
                            <ThisText allowFontScaling={true} adjustsFontSizeToFit
                                      style={[happyHourTextStyle, {color: fontColor}]}>{titleText}</ThisText>
                        </View>
                        <View style={{flex: 1}}>
                            <ThisText allowFontScaling={true} adjustsFontSizeToFit numberOfLines={3}
                                      style={promotionTermStyle}>{term}</ThisText>
                        </View>
                    </View>
                </View>;
            case "X+Y":
                return <View style={[promotionHeader, {width: StyleUtils.getWidth()}]}>
                    {titleValue1 ?
                        <View style={promotionValue}>
                            <ThisText allowFontScaling={true}
                                      style={[titleValueStyle, {
                                          color: {fontColor},
                                          fontSize: StyleUtils.scale(20)
                                      }]}>{titleValue1}</ThisText>
                            <ThisText allowFontScaling={true}
                                      style={[titleValueStyle, {
                                          color: {fontColor},
                                          fontSize: StyleUtils.scale(20)
                                      }]}>+</ThisText>
                            <ThisText allowFontScaling={true}
                                      style={[titleValueStyle, {
                                          color: {fontColor},
                                          fontSize: StyleUtils.scale(20)
                                      }]}>{titleValue2}</ThisText>


                        </View> :
                        <View style={promotionValue}>
                            <ThisText allowFontScaling={true}
                                      style={[titleValueStyle, {color: fontColor}]}>{titleValue}</ThisText>
                        </View>}

                    <View style={promotiontDescription}>
                        <View style={{flex: 1}}>
                            <ThisText style={[titleTextStyle, {color: fontColor}]}>{titleText}</ThisText>
                        </View>
                        <View style={{flex: 1}}>
                            <ThisText style={promotionTermStyle}>{term}</ThisText>
                        </View>
                    </View>
                </View>;
            case "PUNCH_CARD":
                return <View style={[styles.promotionPunchHeader, {width: StyleUtils.getWidth()}]}>
                    <View style={styles.promotionPunchValue}>
                        <ThisText style={[puncCardtitleValue, {color: fontColor}]}>{titleText}</ThisText>
                    </View>

                </View>;
            default:
                return <View style={promotionHeader}>


                </View>;
        }
    }
}
