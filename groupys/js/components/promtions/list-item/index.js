import React, {Component} from 'react';
import {Image, Platform} from 'react-native';
import {connect} from 'react-redux';
import {actions} from 'react-native-navigation-redux-helpers';
import {
    Container,
    Content,
    Text,
    Title,
    InputGroup,
    Input,
    Button,
    View,
    Header,
    Body,
    Right,
    ListItem,
    Thumbnail,
    Left
} from 'native-base';
import stylesPortrate from './styles'
import stylesLandscape from './styles_landscape'
import FeedUiConverter from '../../../api/feed-ui-converter'
import StyleUtils from '../../../utils/styleUtils'

let feedUiConverter = new FeedUiConverter();
import Icon from 'react-native-vector-icons/Ionicons';
import Icon2 from 'react-native-vector-icons/EvilIcons';
import Icon3 from 'react-native-vector-icons/MaterialIcons';

export default class PromotionListView extends Component {
    constructor(props) {
        super(props);
    }

    showProduct(props, item) {
        this.props.navigation.navigate('editPromotion', {item: item});
    }

    render() {
        return this.createPromotion(this.props.item);
    }

    createPromotion(promotionItem) {
        const item = feedUiConverter.createPromotionAttributes(promotionItem, promotionItem.type)
        const styles = this.createStyle();
        const colorStyle = {
            color: item.promotionColor,
            fontFamily: 'Roboto-Regular', marginLeft: 10, marginTop: 4, fontSize: 16
        }
        const promotion = <Text style={colorStyle}>{item.promotion}</Text>
        const image = this.createImageTag(item, styles);
        const editButton = <Button small style={{
            borderColor: 'white',
            backgroundColor: 'white',
            height: 55,
            width: 60,
            marginLeft: 10
        }} onPress={this.showProduct.bind(this, this.props, this.props.item)}>
            <Icon3 size={20} style={styles.productIcon} name="edit"/>


        </Button>
        const result =
            <View style={styles.promotion_container}>
                <View style={styles.promotion_card}>

                    <View style={styles.promotion_nameContainer}>
                        <View>
                            <Text style={styles.promotion_name}>{item.name}</Text>
                            <Text style={styles.promotion_desc}>{item.description}</Text>
                        </View>
                        {editButton}
                    </View>

                    <View style={styles.promotion_buttomUpperContainer}>
                        <View style={{marginLeft: 5, marginTop: 5, alignItems: 'center',}}>
                            {image}
                        </View>
                        <View style={styles.promotion_buttom_description}>
                            {promotion}
                            <Text style={styles.promotion_type}>{item.itemTitle}</Text>
                            <View style={styles.promotion_buttom_location}>
                                <Icon style={styles.promotion_location} size={25} name="md-analytics"/>
                                <View style={{flexDirection: 'column',}}>
                                    <Text style={styles.promotion_addressText} note>{item.quantity} </Text>

                                    <Text style={styles.promotion_addressText} note>Saved 0</Text>
                                    <Text style={styles.promotion_addressText} note>Redemed 0 </Text>
                                </View>

                            </View>

                        </View>
                    </View>


                </View>
            </View>
        return result;
    }

    createImageTag(item, styles) {
        if (item.banner) {
            return <Image resizeMode="cover" style={styles.promotion_image} source={{uri: item.banner.uri}}></Image>
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

