/**
 * Created by roilandshut on 23/07/2017.
 */
import React, {Component} from 'react';
import {Dimensions, Image} from 'react-native';
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
import {SocialState, SubmitButton,PromotionSeperator,PromotionHeader} from '../../../../ui/index';
import FormUtils from "../../../../utils/fromUtils";

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
        const {refresh,item, save, shared,like, unlike, showUsers, comment, token, location} = this.props;

        const styles = this.createPromotionStyle();
        const colorStyle = this.createColorStyle(item)
        const buisnessLogo = componentCreator.createBusinessLog(item, this.showBussines.bind(this));
        const image = this.createImageComponent(item, styles);
        const container = this.createContainerStyle(item);
        let claimDisabled = true;
        if (item.showsave) {
            claimDisabled = false
        }
        let promotionUpperContainer = styles.promotion_upperContainer;
        let logtyle = styles.logo_view;
        let promotaionDesc = styles.promotiosDescription;
        let promotionDetalis = styles.promotionDetails;

        if(shared){
            promotionUpperContainer = styles.promotioSharedUpperContainer;
            logtyle = styles.logoSharedview;
            promotaionDesc = styles.promotiosShareDescription;
             promotionDetalis = styles.promotionShareDetails;
        }
        const result =
            <InViewPort  onChange={() => refresh(item.id,item.social)} style={container}>
                <View style={styles.promotion_card}>
                    <View style={promotionUpperContainer}>
                        <View style={logtyle}>
                            {buisnessLogo}
                            <View style={{flexDirection: 'column'}}>
                                <Text style={styles.promotion_nameText} note>{item.businessName} </Text>
                                <Text style={styles.promotion_addressText} note>{item.business.categoryTitle}</Text>
                            </View>
                        </View>


                    </View>
                    {image}


                    <View style={{flex:3.7,width:width-15,backgroundColor:'white'}}>
                        <View style={promotaionDesc}>
                            <PromotionHeader type={item.promotion}  feed titleText={item.promotionTitle} titleValue={item.promotionValue} term={item.promotionTerm}/>
                        </View>
                        <View style={promotionDetalis}>
                            <Text style={{marginRight:10,marginLeft:10,fontSize:18}}>{item.name} - {item.description}</Text>
                        </View>
                    </View>
                    {!shared && <View style={styles.promotiosSeperator}>
                        <PromotionSeperator/>
                    </View>}

                    {!shared && <View style={styles.promotionDetailsContainer}>
                        <View style={styles.promotionLoctionContainer}>
                            <View><Text style={styles.detailsTitleText}>Location</Text></View>
                            <View><Text
                                style={styles.detailsText}>{FormUtils.getDistanceFromLatLonInKm(location.lat, location.long, item.location.lat, item.location.lng)}
                                km away</Text></View>
                        </View>
                        <View style={styles.expireDateContainer}>
                            <View><Text style={styles.detailsTitleText}>Expire</Text></View>
                            <View><Text style={styles.detailsText}>{item.endDate}</Text></View>
                        </View>
                        <View style={styles.editButtonContainer}>
                            <SubmitButton title="CLAIM" color={'#2db6c8'}
                                          disabled={claimDisabled} onPress={() => save(item.id)}/>
                        </View>
                    </View>}


                    <View style={styles.promotion_bottomContainer}>

                        {item.social && <SocialState feed comments={item.social.comments} onPressComment={comment}
                                     like={item.social.like} likes={item.social.likes}
                                     onPressUnLike={() => unlike(item.id, token)}
                                     onPressLike={() => like(item.id, token)}
                                     share={item.social.share} shares={item.social.shares} shareAction={showUsers}/>}
                    </View>
                </View>
            </InViewPort>
        return result;
    }

    createColorStyle(item) {
        return {
            color: item.promotionColor,
            fontFamily: 'Roboto-Regular', marginLeft: 10, marginTop: 4, fontSize: 16
        };
    }

    createContainerStyle(item) {
        const{shared}  = this.props;

        if (item.banner) {
            if(shared){
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