import React, {Component} from 'react';
import {Image, PanResponder, TouchableHighlight} from 'react-native';
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
import strings from "../../../i18n/i18n"
import Icon2 from 'react-native-vector-icons/EvilIcons';
import Icon3 from 'react-native-vector-icons/MaterialIcons';
import stylesPortrate from './styles'
import stylesLandscape from './styles_landscape'
import StyleUtils from '../../../utils/styleUtils'
import {ThisText} from '../../../ui/index';

const ReactNative = require('react-native');
const {StyleSheet, Platform, Dimensions} = ReactNative;
const {width, height} = Dimensions.get('window');
export default class MyPromotionFeedItem extends Component {
    constructor(props) {
        super(props);
    }

    async componentWillMount() {
        const getDirectionAndColor = ({moveX, moveY, dx, dy}) => {
            const height = dx;
            const width = dy;
            const draggedDown = dy > 30;
            const draggedUp = dy < -30;
            const draggedLeft = dx < -30;
            const draggedRight = dx > 30;
            const isRed = moveY < 90 && moveY > 40 && moveX > 0 && moveX < width;
            const isBlue = moveY > (height - 50) && moveX > 0 && moveX < width;
            let dragDirection = '';
            if (draggedDown || draggedUp) {
                if (draggedDown) dragDirection += 'dragged down '
                if (draggedUp) dragDirection += 'dragged up ';
            }
            if (draggedLeft || draggedRight) {
                if (draggedLeft) dragDirection += 'dragged left '
                if (draggedRight) dragDirection += 'dragged right ';
            }
            if (isRed) return `red ${dragDirection}`
            if (isBlue) return `blue ${dragDirection}`
            if (dragDirection) return dragDirection;
        }
        this._panResponder = PanResponder.create({
            onMoveShouldSetPanResponder: (evt, gestureState) => this.onMove(evt, gestureState),
        });
    }

    realize() {
        this.props.navigation.navigate('realizePromotion', {item: this.props.item})
    }

    render() {
        const feed = this.createPromotion(this.props.item);
        return feed;
    }

    comment() {
        this.props.navigation.navigate('genericComments', {
            instance: this.props.item,
            generalId: this.props.item.generalId,
            entities: this.props.item.entities,
        })
        //TODO add comments screen
    }

    onMove(evt, gestureState) {
        if (gestureState.moveY < 300) {
            //    this.props.fetchTopList(this.props.item.fid, this.props.token, this.props.user)
        }
        return false;
    }

    createPromotion(item) {
        const styles = this.createStyle();
        const colorStyle = {
            color: item.promotionColor,
            fontFamily: 'Roboto-Regular', marginLeft: 10, marginTop: 4, fontSize: 16
        }
        const promotion = <ThisText style={colorStyle}>{item.promotion}</ThisText>
        const buisnessLogo = this.createBusinessLogi(item);
        const redeemStyle = {
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
            <View  {...this._panResponder.panHandlers} >
                <View style={styles.promotion_container}>
                    <View style={styles.promotion_card}>
                        <View style={styles.promotion_upperContainer}>
                            <View style={styles.logo_view}>
                                {buisnessLogo}
                                <View style={{flexDirection: 'column'}}>
                                    <ThisText style={styles.promotion_nameText} note>{item.businessName} </ThisText>
                                </View>
                            </View>

                        </View>

                        <View style={styles.promotion_bottomUpperContainer}>
                            <View style={styles.promotion_bottom_description}>
                                {promotion}
                                <ThisText style={styles.promotion_type}>{item.itemTitle}</ThisText>
                                <View style={styles.promotion_bottom_location}>
                                    <Icon2 style={styles.promotion_location} size={25} name="clock"/>
                                    <ThisText style={styles.promotion_addressText} note>{item.endDate} </ThisText>

                                </View>
                                <View style={styles.promotion_bottom_location}>
                                    <Icon3 style={styles.promotion_location} size={25} name="location-on"/>
                                    <ThisText style={styles.promotion_addressText} note>{item.businessAddress} </ThisText>
                                </View>
                            </View>
                        </View>
                        <View style={styles.promotion_action_container}>
                            <Button style={postStyle} onPress={this.comment.bind(this)}>


                                <ThisText>{strings.ViewPost}</ThisText>


                            </Button>
                            <Button style={redeemStyle} onPress={this.realize.bind(this)}>


                                <ThisText>{strings.Redeem}</ThisText>


                            </Button>
                        </View>
                        <View style={styles.promotion_button_space}>


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


