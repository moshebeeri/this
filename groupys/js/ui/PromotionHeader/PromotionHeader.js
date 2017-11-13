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
        const{type,titleValue,titleText,term,feed} = this.props;
        
        let titleValueStyle = styles.titleValue;
        let titleTextStyle = styles.titleText;
        let XplusYtitleValueStyle = styles.XplusYtitleValue;
        if(feed){
            titleValueStyle = styles.titleValueFeed;
            titleTextStyle = styles.titleTextFeed;
            XplusYtitleValueStyle = styles.XplusYtitleValueFeed
         }
        switch (type) {
            case "REDUCED_AMOUNT":
                return <View style={styles.promotionHeader}>
                    <View style={styles.promotionValue}>
                        <Text style={titleValueStyle}>{ILS}{titleValue}</Text>
                    </View>
                    <View style={styles.promotiontDescription}>
                        <View>
                            <Text style={titleTextStyle}>{titleText}</Text>
                        </View>
                        <View>
                            <Text style={styles.promotionTermlTextStyle}>{term}</Text>
                        </View>
                    </View>
                </View>;
            case "PERCENT":
                return <View style={styles.promotionHeader}>
                    <View style={styles.promotionValue}>
                        <Text style={titleValueStyle}>{titleValue}%</Text>
                    </View>
                    <View style={styles.promotiontDescription}>
                        <View>
                            <Text style={titleTextStyle}>{titleText}</Text>
                        </View>
                        <View>
                            <Text style={styles.promotionTermlTextStyle}>{term}</Text>
                        </View>
                    </View>
                </View>;
            case "X_FOR_Y":
                return <View style={styles.promotionHeader}>
                    <View style={styles.promotionValue}>
                        <Text style={titleValueStyle}>{ILS}{titleValue}</Text>
                    </View>
                    <View style={styles.promotiontDescription}>
                        <View>
                            <Text style={titleTextStyle}>{titleText}</Text>
                        </View>
                        <View>
                            <Text style={styles.promotionTermlTextStyle}>{term}</Text>
                        </View>
                    </View>
                </View>;
            case "X+N%OFF":
                return <View style={styles.promotionHeader}>
                    <View style={styles.promotionValue}>
                        <Text style={titleValueStyle}>{titleValue}%</Text>
                    </View>
                    <View style={styles.promotiontDescription}>
                        <View>
                            <Text style={titleTextStyle}>{titleText}</Text>
                        </View>
                        <View>
                            <Text style={styles.promotionTermlTextStyle}>{term}</Text>
                        </View>
                    </View>
                </View>;
            case "HAPPY_HOUR":
                return <View style={styles.promotionHeader}>
                    <View style={styles.promotionValue}>
                        <Text style={titleValueStyle}>{ILS}{titleValue}</Text>
                    </View>
                    <View style={styles.promotiontDescription}>
                        <View>
                            <Text style={titleTextStyle}>{titleText}</Text>
                        </View>
                        <View>
                            <Text style={styles.promotionTermlTextStyle}>{term}</Text>
                        </View>
                    </View>
                </View>;
            case "X+Y":
                return <View style={styles.promotionHeader}>
                    <View style={styles.promotionValue}>
                        <Text style={XplusYtitleValueStyle}>{titleValue}</Text>
                    </View>
                    <View style={styles.promotiontDescription}>
                        <View>
                            <Text style={titleTextStyle}>{titleText}</Text>
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
