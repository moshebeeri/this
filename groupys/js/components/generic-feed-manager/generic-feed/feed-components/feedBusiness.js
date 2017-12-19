/**
 * Created by roilandshut on 23/07/2017.
 */
import React, {Component} from 'react';
import {Image,Dimensions} from 'react-native';
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
import Icon3 from 'react-native-vector-icons/MaterialIcons';
import stylesPortrate from './styles'
import stylesLandscape from './styles_lendscape'
import StyleUtils from '../../../../utils/styleUtils'
import * as componentCreator from "./feedCommonView";
import {SocialState,BusinessHeader} from '../../../../ui/index';
import FormUtils from "../../../../utils/fromUtils";
import PageRefresher from '../../../../refresh/pageRefresher'

const {width, height} = Dimensions.get('window')
export default class FeedBusiness extends Component {
    render() {
        return this.createBusiness(this.props.item, this.props.like, this.props.unlike, this.props.showUsers, this.props.comment)
    }

    showBusiness() {
        this.props.navigation.navigate("businessProfile", {businesses: this.props.item.business});
    }


    componentWillMount(){
        const { item} = this.props;
        PageRefresher.createFeedSocialState(item.id);


    }
    visited(visible){
        const { item} = this.props;
        if(visible) {
            console.log(item.id + ' visited');
            PageRefresher.visitedFeedItem(item);
        }

    }
    createBusiness(item, like, unlike, showUsers, comment) {
        const {location, refresh} = this.props;
        if (!item.name) {
            return <View></View>;
        }
        const styles = componentCreator.createStyle();
        const imageBusiness = this.createBusinessImage(item, styles);
        const result =

            <InViewPort onChange={this.visited.bind(this)} style={styles.businesses_container}>
                <View style={styles.promotion_card}>
                    <View style={{width:width-15}}>
                    <BusinessHeader  navigation={this.props.navigation} business={item.business}
                                     categoryTitle={item.categoryTitle} businessLogo={item.businessLogo}
                                     businessName={item.business.name} noMargin
                    />
                    </View>
                    <View style={{width:width-15,paddingBottom:5,backgroundColor:'white',justifyContent:'flex-start',alignItems:'flex-start'}}>
                    <Text style={styles.promotion_type}>{item.itemTitle}</Text>
                    </View>

                    {imageBusiness}

                    <View style={styles.business_bottomUpperContainer}>
                        <View style={styles.promotion_bottom_description}>


                            <View style={styles.promotion_bottom_location}>
                                <Icon3 style={styles.promotion_location} size={25} name="location-on"/>
                                <View>
                                    <Text style={styles.promotion_addressText} note>{item.businessAddress} </Text>
                                    <Text style={styles.detailsText}>
                                        {FormUtils.getDistanceString(location.lat, location.long, item.location.lat, item.location.lng)}
                                    </Text>
                                </View>
                            </View>
                        </View>
                    </View>


                    <View style={styles.promotion_bottomContainer}>
                        <SocialState feed comments={item.social.comments} onPressComment={comment}
                                     like={item.social.like} likes={item.social.likes}
                                     onPressUnLike={() => unlike(item.id)}
                                     onPressLike={() => like(item.id)}
                                     share={item.social.share} shares={item.social.shares} shareAction={showUsers}/>


                    </View>
                </View>
            </InViewPort>;
        return result;
    }

    createBusinessImage(item, styles) {
        if (item.banner && item.banner.uri) {
            return <View style={styles.promotion_image_view}>

                <Image resizeMode="cover" style={styles.promotion_image} source={{uri: item.banner.uri}}>
                </Image>
            </View>
        }
        return undefined;
    }

    getStyle() {
        if (StyleUtils.isLandscape()) {
            return stylesLandscape;
        }
        return stylesPortrate;
    }
}
