/**
 * Created by roilandshut on 23/07/2017.
 */
import React, {Component} from 'react';
import {Dimensions, Image} from 'react-native';
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
import Icon2 from 'react-native-vector-icons/EvilIcons';
import Icon3 from 'react-native-vector-icons/MaterialIcons';
import stylesPortrate from './styles'
import stylesLandscape from './styles_lendscape'
import StyleUtils from '../../../../utils/styleUtils'
import * as componentCreator from "./feedCommonView";
import { Spinner, SocialState} from '../../../../ui/index';

const {width, height} = Dimensions.get('window')
const vw = width / 100;
const vh = height / 100
const vmin = Math.min(vw, vh);
const vmax = Math.max(vw, vh)


export default class FeedPromotion extends Component {
    constructor() {
        super();
    }

    showBussines() {
        this.props.navigation.navigate("businessProfile", {bussiness: this.props.item.business});
    }

    render() {
        const {item, save, like, unlike, showUsers, comment, token} = this.props;
        const styles = this.createPromotionStyle();
        const colorStyle = this.createColorStyle(item)
        const promotion = <Text style={colorStyle}>{item.promotion}</Text>
        const buisnessLogo = componentCreator.createBusinessLog(item, this.showBussines.bind(this));
        const saveIcon = componentCreator.createSaveButton(item, save);
        const image = this.createImageComponent(item, styles);
        const container = this.createContainerStyle(item);
        const result =
            <View style={container}>
                <View style={styles.promotion_card}>
                    <View style={styles.promotion_upperContainer}>
                        <View style={styles.logo_view}>
                            {buisnessLogo}
                            <View style={{flexDirection: 'column'}}>
                                <Text style={styles.promotion_nameText} note>{item.businessName} </Text>
                                <Text style={styles.promotion_addressText} note>{item.businessAddress} </Text>
                            </View>
                        </View>

                        <View style={styles.promotion_description}>

                            <Text style={styles.promotion_text_description}>{item.name}</Text>
                            <Text style={styles.promotion_text_description}>{item.description}</Text>

                        </View>
                    </View>
                    {image}


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


                    <View style={styles.promotion_bottomContainer}>

                       <SocialState feed comments={item.social.comments} onPressComment={comment}
                                    like={item.social.like} likes={item.social.numberLikes} onPressUnLike={() => unlike(item.id, token)} onPressLike={() => like(item.id, token)}
                                    share={item.social.share} shares={item.social.shares} shareAction={showUsers}/>
                    </View>
                </View>
            </View>
        return result;
    }

    createColorStyle(item) {
        return {
            color: item.promotionColor,
            fontFamily: 'Roboto-Regular', marginLeft: 10, marginTop: 4, fontSize: 16
        };
    }

    createContainerStyle(item) {
        if (item.banner) {
            return {
                flex: 1,
                height: 81 * vh,
                width: width,
                overflow: 'hidden',
                backgroundColor: '#b7b7b7',
                // backgroundColor:'#FFF',
                alignItems: 'center',
                flexDirection: 'column',
            }
        }
        return {
            flex: 1,
            height: 45 * vh,
            width: width,
            overflow: 'hidden',
            backgroundColor: '#b7b7b7',
            // backgroundColor:'#FFF',
            alignItems: 'center',
            flexDirection: 'column',
        };
    }

    createImageComponent(item, styles) {
        if (item.banner) {
            return <View style={styles.promotion_image_view}>

                <Image resizeMode="cover" style={styles.promotion_image} source={{uri: item.banner.uri}}>
                </Image>
            </View>
        }
        return undefined;
    }

    createPromotionStyle() {
        if (StyleUtils.isLandscape()) {
            return stylesLandscape;
        }
        return stylesPortrate;
    }
}