import React, {Component} from 'react';
import {actions} from 'react-native-navigation-redux-helpers';
import {
    Button,
    Card,
    CardItem,
    Container,
    Content,
    Footer,
    Header,
    Input,
    InputGroup,
    Item,
    Left,
    Picker,
    Right,
    Text,
    Thumbnail,
    View
} from 'native-base';
import stylesPortrate from './styles'
import stylesLandscape from './styles_landscape'
import StyleUtils from '../../../utils/styleUtils'
import Icon2 from 'react-native-vector-icons/EvilIcons';
import Icon3 from 'react-native-vector-icons/MaterialIcons';
const ReactNative = require('react-native');
const {StyleSheet, Platform, Dimensions} = ReactNative;
const {width, height} = Dimensions.get('window')
export default class MyPromotionFeedItem extends Component {
    constructor(props) {
        super(props);
    }

    componentWillMount() {
    }

    render() {
        const feed = this.createPromotion(this.props.item);
        return feed;
    }

    createPromotion(item) {
        const styles = this.createStyle();
        const colorStyle = {
            color: item.promotionColor,
            fontFamily: 'Roboto-Regular', marginLeft: 10, marginTop: 4, fontSize: 16
        }
        const promotion = <Text style={colorStyle}>{item.promotion}</Text>
        const buisnessLogo = this.createBusinessLogi(item);
        const reddemStyle = {
            flex: -1,
            justifyContent: 'center',
            marginLeft: 0,
            flexDirection: 'row',
            height: 40,
            width: width / 2,
            backgroundColor: item.promotionColor,
        };
        const postStyle = {
            flex: -1,
            justifyContent: 'center',
            marginLeft: 0,
            flexDirection: 'row',
            height: 40,
            width: width / 2,
            backgroundColor: '#363636',
        };
        let result =
            <View >
                <View style={styles.promotion_container}>
                    <View style={styles.promotion_card}>
                        <View style={styles.promotion_upperContainer}>
                            <View style={styles.logo_view}>
                                {buisnessLogo}
                                <View style={{flexDirection: 'column'}}>
                                    <Text style={styles.promotion_nameText} note>{item.businessName} </Text>
                                </View>
                            </View>

                        </View>

                        <View style={styles.promotion_buttomUpperContainer}>
                            <View style={styles.promotion_buttom_description}>
                                {promotion}
                                <Text style={styles.promotion_type}>{item.itemTitle}</Text>
                                <View style={styles.promotion_buttom_location}>
                                    <Icon2 style={styles.promotion_location} size={25} name="clock"/>
                                    <Text style={styles.promotion_addressText} note>{item.endDate} </Text>

                                </View>
                                <View style={styles.promotion_buttom_location}>
                                    <Icon3 style={styles.promotion_location} size={25} name="location-on"/>
                                    <Text style={styles.promotion_addressText} note>{item.businessAddress} </Text>
                                </View>
                            </View>
                        </View>

                    </View>
                </View>
            </View>
        return result;
    }

    createBusinessLogi(item) {
        if (item.businessLogo) {
            return <Thumbnail square={true} size={50} source={{uri: item.businessLogo}}/>
        }
        return undefined;
    }

    createStyle() {
        if (StyleUtils.isLandscape()) {
            return stylesLandscape;
        }
        return stylesPortrate;
    }
}


