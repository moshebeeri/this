import React, {Component} from 'react';
import {Dimensions, Text, View} from 'react-native';
import {Button, Icon, Input} from 'native-base';
import styles from './styles';
import {PunchView} from '../index'
import StyleUtils from '../../utils/styleUtils'

const {width, height} = Dimensions.get('window')
const ILS = '₪';
export default class PromotionHeader extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const {type, titleValue, titleText, term, feed, columnStyle} = this.props;
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

                        <Text style={titleValueStyle}>{ILS}{titleValue}</Text>
                    </View>
                    <View style={promotiontDescription}>
                        <View style={{flex: 1}}>
                            <Text style={titleTextStyle}>{titleText}</Text>
                        </View>
                        <View style={{flex: 1}}>
                            <Text style={promotionTermStyle}>{term}</Text>
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
                            <Text style={titleTextStyle}>{titleText}</Text>
                        </View>
                        <View style={{flex: 1}}>
                            <Text q style={promotionTermStyle}>{term}</Text>
                        </View>
                    </View>
                </View>;
            case "X_FOR_Y":
                return <View style={[promotionHeader, {width: StyleUtils.getWidth()}]}>
                    <View style={promotionValue}>
                        <Text style={titleValueStyle}>{ILS}{titleValue}</Text>
                    </View>
                    <View style={promotiontDescription}>
                        <View style={{flex: 1}}>
                            <Text style={titleTextStyle}>{titleText}</Text>
                        </View>
                        <View style={{flex: 1}}>
                            <Text style={promotionTermStyle}>{term}</Text>
                        </View>
                    </View>
                </View>;
            case "X+N%OFF":
                return <View style={[promotionHeader, {width: StyleUtils.getWidth()}]}>
                    <View style={promotionValue}>
                        <Text style={titleValueStyle}>{titleValue}%</Text>
                    </View>
                    <View style={promotiontDescription}>
                        <View style={{flex: 1}}>
                            <Text style={titleTextStyle}>{titleText}</Text>
                        </View>
                        <View style={{flex: 1}}>
                            <Text style={promotionTermStyle}>{term}</Text>
                        </View>
                    </View>
                </View>;
            case "HAPPY_HOUR":
                return <View style={[promotionHeader, {width: StyleUtils.getWidth()}]}>
                    <View style={promotionValue}>
                        <Text numberOfLines={1} allowFontScaling={true} style={titleValueStyle}>{ILS}{titleValue}</Text>
                    </View>
                    <View style={styles.promotiontHappyDescription}>
                        <View style={{flex: 1, justifyContent: 'flex-start'}}>
                            <Text allowFontScaling={true} adjustsFontSizeToFit
                                  style={happyHourTextStyle}>{titleText}</Text>
                        </View>
                        <View style={{flex: 1}}>
                            <Text allowFontScaling={true} adjustsFontSizeToFit numberOfLines={3}
                                  style={promotionTermStyle}>{term}</Text>
                        </View>
                    </View>
                </View>;
            case "X+Y":
                return <View style={[promotionHeader, {width: StyleUtils.getWidth()}]}>
                    <View style={promotionValue}>
                        <Text allowFontScaling={true} style={titleValueStyle}>{titleValue}</Text>
                    </View>
                    <View style={promotiontDescription}>
                        <View style={{flex: 1}}>
                            <Text style={titleTextStyle}>{titleText}</Text>
                        </View>
                        <View style={{flex: 1}}>
                            <Text style={promotionTermStyle}>{term}</Text>
                        </View>
                    </View>
                </View>;
            case "PUNCH_CARD":
                return <View style={[styles.promotionPunchHeader, {width: StyleUtils.getWidth()}]}>
                    <View style={styles.promotionPunchValue}>
                        <Text style={puncCardtitleValue}>{titleText}</Text>
                    </View>
                    <PunchView feed={feed} numberOfPunches={term}/>
                </View>;
            default:
                return <View style={promotionHeader}>


                </View>;
        }
    }
}
