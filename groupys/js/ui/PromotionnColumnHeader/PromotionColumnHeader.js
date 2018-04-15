import React, {Component} from 'react';
import {View} from 'react-native';
import {Button, Icon, Input} from 'native-base';
import styles from './styles';
import {PunchView, ThisText} from '../index'
import StyleUtils from "../../utils/styleUtils";

const ILS = '₪';
export default class PromotionColumnHeader extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const {type, titleValue, titleText, term, item} = this.props;
        switch (type) {
            case "PERCENT":
            case "X+N%OFF":
                return <View style={{
                    marginTop: 5,
                    flex: 2,
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: StyleUtils.getWidth() - 30,
                    backgroundColor: 'white'
                }}>

                    <ThisText style={{color: '#2db6c8', fontSize: StyleUtils.scale(50),}}>{titleValue}%</ThisText>

                    <ThisText style={styles.titleTextFeed}>{titleText}</ThisText>

                    <ThisText style={styles.promotionTermlTextStyle}>{term}</ThisText>

                </View>;
            case "HAPPY_HOUR":
            case "X_FOR_Y":
            case "REDUCED_AMOUNT":
                return <View style={{
                    marginTop: 5,
                    flex: 2,
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: StyleUtils.getWidth() - 30,
                    backgroundColor: 'white'
                }}>

                    <ThisText style={{color: '#2db6c8', fontSize: StyleUtils.scale(50),}}>{ILS}{titleValue}</ThisText>

                    <ThisText style={styles.titleTextFeed}>{titleText}</ThisText>

                    <ThisText style={styles.promotionTermlTextStyle}>{term}</ThisText>

                </View>;
            case "X+Y":
                return <View style={{
                    marginTop: 5,
                    flex: 2,
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: StyleUtils.getWidth() - 30,
                    backgroundColor: 'white'
                }}>

                    <ThisText style={{color: '#2db6c8', fontSize: StyleUtils.scale(50),}}>{titleValue}</ThisText>

                    <ThisText style={styles.titleTextFeed}>{titleText}</ThisText>

                    <ThisText style={styles.promotionTermlTextStyle}>{term}</ThisText>

                </View>;
            case "PUNCH_CARD":
                return <View style={[styles.promotionPunchHeader, {width: StyleUtils.getWidth() - 15}]}>
                    <View style={[styles.promotionPunchValue, {alignItems:'center'}]}>
                        <ThisText style={styles.puncCardtitleFeedValue}>{titleText}</ThisText>
                        <View style={{marginBottom:StyleUtils.scale(10)}}>
                        <PunchView feed numberRealized={item.realizedPunches} numberOfPunches={item.punches}/>
                        </View>
                    </View>

                </View>;
            default:
                return <View style={promotionHeader}>


                </View>;
        }
    }
}
