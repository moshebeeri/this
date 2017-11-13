import React, {Component} from 'react';
import {View,Text} from 'react-native';
import {Button, Icon, Input} from 'native-base';
import styles from './styles';
const ILS = '₪';
export default class PromotionHeader extends Component {
    constructor(props) {
        super(props);
    }




    render() {
        const{type,titleValue,titleText,term} = this.props;
        switch (type) {
            case "REDUCED_AMOUNT":
                return <View style={styles.promotionHeader}>
                    <View style={styles.promotionValue}>
                        <Text style={styles.titleValue}>{ILS}{titleValue}</Text>
                    </View>
                    <View style={styles.promotiontDescription}>
                        <View>
                            <Text style={styles.titleText}>{titleText}</Text>
                        </View>
                        <View>
                            <Text style={styles.promotionTermlTextStyle}>{term}</Text>
                        </View>
                    </View>
                </View>;
            case "PERCENT":
                return <View style={styles.promotionHeader}>
                    <View style={styles.promotionValue}>
                        <Text style={styles.titleValue}>{titleValue}%</Text>
                    </View>
                    <View style={styles.promotiontDescription}>
                        <View>
                            <Text style={styles.titleText}>{titleText}</Text>
                        </View>
                        <View>
                            <Text style={styles.promotionTermlTextStyle}>{term}</Text>
                        </View>
                    </View>
                </View>;
            case "X_FOR_Y":
                return <View style={styles.promotionHeader}>
                    <View style={styles.promotionValue}>
                        <Text style={styles.titleValue}>{ILS}{titleValue}</Text>
                    </View>
                    <View style={styles.promotiontDescription}>
                        <View>
                            <Text style={styles.titleText}>{titleText}</Text>
                        </View>
                        <View>
                            <Text style={styles.promotionTermlTextStyle}>{term}</Text>
                        </View>
                    </View>
                </View>;
            case "X+N%OFF":
                return <View style={styles.promotionHeader}>
                    <View style={styles.promotionValue}>
                        <Text style={styles.titleValue}>{titleValue}%</Text>
                    </View>
                    <View style={styles.promotiontDescription}>
                        <View>
                            <Text style={styles.titleText}>{titleText}</Text>
                        </View>
                        <View>
                            <Text style={styles.promotionTermlTextStyle}>{term}</Text>
                        </View>
                    </View>
                </View>;
            case "HAPPY_HOUR":
                return <View style={styles.promotionHeader}>
                    <View style={styles.promotionValue}>
                        <Text style={styles.titleValue}>{ILS}{titleValue}</Text>
                    </View>
                    <View style={styles.promotiontDescription}>
                        <View>
                            <Text style={styles.titleText}>{titleText}</Text>
                        </View>
                        <View>
                            <Text style={styles.promotionTermlTextStyle}>{term}</Text>
                        </View>
                    </View>
                </View>;
            case "X+Y":
                return <View style={styles.promotionHeader}>
                    <View style={styles.promotionValue}>
                        <Text style={styles.XplusYtitleValue}>{titleValue}</Text>
                    </View>
                    <View style={styles.promotiontDescription}>
                        <View>
                            <Text style={styles.titleText}>{titleText}</Text>
                        </View>
                        <View>
                            <Text style={styles.promotionTermlTextStyle}>{term}</Text>
                        </View>
                    </View>
                </View>;
            case "PUNCH_CARD":
                return <View style={styles.promotionPunchHeader}>
                    <View style={styles.promotionPunchValue}>
                        <Text style={styles.puncCardtitleValue}>{titleText}</Text>
                    </View>
                    <PunchView numberOfPunches={promotion.punches}/>
                </View>;
            default:
                return <View style={styles.promotionHeader}>


                </View>;
        }
    }
}
