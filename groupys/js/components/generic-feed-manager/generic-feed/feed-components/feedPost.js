/**
 * Created by roilandshut on 23/07/2017.
 */
import React, {Component} from 'react';
import {Dimensions, Image, Platform} from 'react-native';
import InViewPort from '../../../../utils/inviewport'
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
import stylesLandscape from './styles_lendscape'
import StyleUtils from '../../../../utils/styleUtils'
import * as componentCreator from "./feedCommonView";
import {SocialState} from '../../../../ui/index';
import PageRefresher from '../../../../refresh/pageRefresher'

const {width, height} = Dimensions.get('window');
const vw = width / 100;
const vh = height / 100;
const vmin = Math.min(vw, vh);
const vmax = Math.max(vw, vh);
export default class FeedPromotion extends Component {
    constructor() {
        super();
    }

    showBusiness() {
        this.props.navigation.navigate("businessProfile", {businesses: this.props.item.business});
    }

    componentWillMount() {
        const {item} = this.props;
        PageRefresher.createFeedSocialState(item.id);
    }

    visited() {
        const {item} = this.props;
        console.log(item.id + ' visited');
        PageRefresher.visitedFeedItem(item.id);
    }

    render() {
        const {refresh, item, save, shared, like, unlike, showUsers, comment, token, location, hideSocial, realize} = this.props;
        const styles = this.createPromotionStyle();
         const image = this.createImageComponent(item, styles);
        const container = this.createContainerStyle(item);


          let promotionDetalis = styles.promotionDetails;
        if (shared) {

            promotionDetalis = styles.promotionShareDetails;
        }

        let headeerSize = 80;
        if ((Platform.OS === 'ios')) {
            headeerSize = 50;
        }
        const result =
            <InViewPort onChange={this.visited.bind(this)} style={container}>
                <View style={styles.promotion_card}>
                    <View style={{flexDirection:'row',backgroundColor:'white',flex:2,width: width - 15}}>
                        <View style={{paddingLeft:10,justifyContent:'center'}}>
                        <Thumbnail small source={item.avetar}/>
                        </View>
                        <View style={{paddingLeft:20,justifyContent:'center'}}>
                            <Text>{item.name}</Text>
                            <Text>{item.feed.activity.post.title}</Text>
                        </View>

                    </View>


                    {image}


                    <View style={{flex:2, width: width - 15, backgroundColor: 'white'}}>

                        <View style={promotionDetalis}>
                            <Text numberOfLines={4}  style={{marginRight: 10, marginLeft: 10, fontSize: 18}}>{item.feed.activity.post.text}
                            </Text>
                        </View>
                    </View>


                    <View style={styles.promotion_bottomContainer}>

                        {item.social && <SocialState feed comments={item.social.comments} onPressComment={comment}
                                                     like={item.social.like} likes={item.social.likes}
                                                     onPressUnLike={() => unlike(item.id, token)}
                                                     onPressLike={() => like(item.id, token)}
                                                     shareDisabled={shared}
                                                     share={item.social.share} shares={item.social.shares}
                                                     shareAction={showUsers}/>}
                    </View>
                </View>
            </InViewPort>;
        return result;
    }

    createColorStyle(item) {
        return {
            color: item.promotionColor,
            fontFamily: 'Roboto-Regular', marginLeft: 10, marginTop: 4, fontSize: 16
        };
    }

    createContainerStyle(item) {
        const {shared} = this.props;
        if (item.banner) {
            if (shared) {
                return {
                    flex: 1,
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