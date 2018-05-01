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
        let titleValueStyle = styles.titleValue;
        let titleTextStyle = styles.titleText;
        let XplusYtitleValueStyle = styles.XplusYtitleValue;
        let puncCardtitleValue = styles.puncCardtitleValue;
        let happyHourTextStyle = styles.titleHappyTextFeed
        if (feed) {
            titleValueStyle = styles.titleValueFeed;
            titleTextStyle = styles.titleTextFeed;
            happyHourTextStyle = styles.titleFeedHappyTextFeed
            XplusYtitleValueStyle = styles.XplusYtitleValueFeed;
            puncCardtitleValue = styles.puncCardtitleValueFeed;
        }
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

                        <ThisText style={titleValueStyle}>{ILS}{titleValue}</ThisText>
                    </View>
                    <View style={promotiontDescription}>
                        <View style={{flex: 1}}>
                            <ThisText style={titleTextStyle}>{titleText}</ThisText>
                        </View>
                        <View style={{flex: 1}}>
                            <ThisText style={promotionTermStyle}>{term}</ThisText>
                        </View>
                    </View>
                </View>;
            case "PERCENT":
                return <View style={[promotionHeader, {width: StyleUtils.getWidth()}]}>
                    <View style={promotionValue}>
                        <Text style={titleValueStyle}>{titleValue}%</Text>

                    </View>
                    <View style={promotiontDescription}>
                        <View style={{flex: 1}}>
                            <ThisText style={titleTextStyle}>{titleText}</ThisText>
                        </View>
                        <View style={{flex: 1}}>
                            <ThisText q style={promotionTermStyle}>{term}</ThisText>
                        </View>
                    </View>
                </View>;
            case "X_FOR_Y":
                return <View style={[promotionHeader, {width: StyleUtils.getWidth()}]}>
                    <View style={promotionValue}>
                        <ThisText style={titleValueStyle}>{ILS}{titleValue}</ThisText>
                    </View>
                    <View style={promotiontDescription}>
                        <View style={{flex: 1}}>
                            <ThisText style={titleTextStyle}>{titleText}</ThisText>
                        </View>
                        <View style={{flex: 1}}>
                            <ThisText style={promotionTermStyle}>{term}</ThisText>
                        </View>
                    </View>
                </View>;
            case "X+N%OFF":
                return <View style={[promotionHeader, {width: StyleUtils.getWidth()}]}>
                    <View style={promotionValue}>
                        <ThisText style={titleValueStyle}>{titleValue}%</ThisText>
                    </View>
                    <View style={promotiontDescription}>
                        <View style={{flex: 1}}>
                            <ThisText style={titleTextStyle}>{titleText}</ThisText>
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
                                  style={titleValueStyle}>{ILS}{titleValue}</ThisText>
                    </View>
                    <View style={styles.promotiontHappyDescription}>
                        <View style={{flex: 1, justifyContent: 'flex-start'}}>
                            <ThisText allowFontScaling={true} adjustsFontSizeToFit
                                      style={happyHourTextStyle}>{titleText}</ThisText>
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
                            <ThisText allowFontScaling={true} style={[titleValueStyle,{fontSize:StyleUtils.scale(20)}]}>{titleValue1}</ThisText>
                            <ThisText allowFontScaling={true} style={[titleValueStyle,{fontSize:StyleUtils.scale(20)}]}>+</ThisText>
                            <ThisText allowFontScaling={true} style={[titleValueStyle,{fontSize:StyleUtils.scale(20)}]}>{titleValue2}</ThisText>


                        </View> :
                        <View style={promotionValue}>
                            <ThisText allowFontScaling={true} style={titleValueStyle}>{titleValue}</ThisText>
                        </View>}

                    <View style={promotiontDescription}>
                        <View style={{flex: 1}}>
                            <ThisText style={titleTextStyle}>{titleText}</ThisText>
                        </View>
                        <View style={{flex: 1}}>
                            <ThisText style={promotionTermStyle}>{term}</ThisText>
                        </View>
                    </View>
                </View>;
            case "PUNCH_CARD":
                return <View style={[styles.promotionPunchHeader, {width: StyleUtils.getWidth()}]}>
                    <View style={styles.promotionPunchValue}>
                        <ThisText style={puncCardtitleValue}>{titleText}</ThisText>
                    </View>

                </View>;
            default:
                return <View style={promotionHeader}>


                </View>;
        }
    }
}
