import React, {Component} from 'react';
import {Dimensions, Text, View} from 'react-native';
import {Button, Icon, Input} from 'native-base';
import styles from './styles';
import {PunchView} from '../index'

const {width, height} = Dimensions.get('window')
const ILS = '₪';
export default class PromotionColumnHeader extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const {type, titleValue, titleText, term} = this.props;
        switch (type) {

            case "PERCENT":
            case "X+N%OFF":
                return <View style={{
                    marginTop: 5,
                    flex: 2,
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: width - 30,
                    backgroundColor: 'white'
                }}>

                    <Text style={{color: '#2db6c8', fontSize: 50,}}>{titleValue}%</Text>

                    <Text style={styles.titleTextFeed}>{titleText}</Text>

                    <Text style={styles.promotionTermlTextStyle}>{term}</Text>

                </View>;


            case "HAPPY_HOUR":
            case "X_FOR_Y":

            case "REDUCED_AMOUNT":
                return <View style={{
                    marginTop: 5,
                    flex: 2,
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: width - 30,
                    backgroundColor: 'white'
                }}>

                    <Text style={{color: '#2db6c8', fontSize: 50,}}>{ILS}{titleValue}</Text>

                    <Text style={styles.titleTextFeed}>{titleText}</Text>

                    <Text style={styles.promotionTermlTextStyle}>{term}</Text>

                </View>;
            case "X+Y":
                return <View style={{
                    marginTop: 5,
                    flex: 2,
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: width - 30,
                    backgroundColor: 'white'
                }}>

                    <Text style={{color: '#2db6c8', fontSize: 50,}}>{titleValue}</Text>

                    <Text style={styles.titleTextFeed}>{titleText}</Text>

                    <Text style={styles.promotionTermlTextStyle}>{term}</Text>

                </View>;
            case "PUNCH_CARD":
                return <View style={styles.promotionPunchHeader}>
                    <View style={styles.promotionPunchValue}>
                        <Text style={styles.puncCardtitleValue}>{titleText}</Text>
                    </View>
                    <PunchView feed numberOfPunches={term}/>
                </View>;
            default:
                return <View style={promotionHeader}>


                </View>;
        }
    }
}
