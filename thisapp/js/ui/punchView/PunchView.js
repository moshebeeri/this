import React, {Component} from 'react';
import {Image, View} from 'react-native';
import {Button, Icon, Input} from 'native-base';
import styles from './styles';
import styleUtils from '../../utils/styleUtils';
import {ThisText} from '../index';
import strings from "../../i18n/i18n"
const punched = require('../../../images/punch_inner_2.png');
const punched2 = require('../../../images/punch_inner_1.png');
export default class PunchView extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const {numberOfPunches, numberRealized} = this.props;
        let row1 = this.createPunches(numberOfPunches, numberRealized);
        let row2;
        let row1Punches = Math.round(numberOfPunches / 2);
        let row2Punches = numberOfPunches - row1Punches;
        if (row1Punches > row2Punches) {
            row1 = this.createPunches(row1Punches, numberRealized,false);
            let numberRealizedRow2 = numberRealized - row1Punches
            row2 = this.createPunches(row2Punches, numberRealizedRow2,true);
        } else {
            row1 = this.createPunches(row2Punches, numberRealized,false);
            let numberRealizedRow2 = numberRealized - row1Punches
            row2 = this.createPunches(row1Punches, numberRealizedRow2,true);
        }
        return <View>
            <View style={styles.container}>{row1}</View>
            {row2 && <View style={styles.container}>{row2}</View>}
        </View>
    }

    createPunches(number, numberRealized,lastRow) {
        let row = [];
        for (i = 0; i < number; i++) {
            let isFull = false;
            if (numberRealized && i < numberRealized) {
                isFull = true;
            }
            row.push(this.createPunch(i, isFull,number,lastRow));
        }
        return row
    }

    createPunch(index, isFull,number,lastRow) {
        let style = styles.punch;
        if (this.props.feed) {
            style = styles.punchFeed;
        }
        let show1 = true;
        if (index % 2 === 0) {
            show1 = false;
        }

        const isLast = (index === number - 1) ;
        return <View key={index} style={style}>
            {isFull && show1 && <Image style={{
                width: styleUtils.scale(30),
                height: styleUtils.scale(30), alignItems: 'center', justifyContent: 'center'
            }} resizeMode="cover" source={punched}></Image>}
            {isFull && !show1 && <Image style={{
                width: styleUtils.scale(30),
                height: styleUtils.scale(30), alignItems: 'center', justifyContent: 'center'
            }} resizeMode="cover" source={punched2}></Image>}
            {isLast && lastRow &&  <View style={{
                transform: [{rotate: '45deg'}],
                position: 'absolute',


                backgroundColor: 'transparent'
            }}>
                <ThisText style={{
                    backgroundColor: 'transparent',
                    fontSize: 15,


                    fontWeight: 'bold',
                    color: '#FA0123'
                }}>{strings.Free.toUpperCase()}</ThisText>
            </View>}
        </View>
    }
}
