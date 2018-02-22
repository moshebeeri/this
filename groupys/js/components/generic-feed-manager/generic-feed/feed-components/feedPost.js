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
import stylesLandscape from './styles'
import StyleUtils from '../../../../utils/styleUtils'
import {ActivityReport, SocialState, UrlPreview, Video} from '../../../../ui/index';
import PageRefresher from '../../../../refresh/pageRefresher'
import {ThisText} from '../../../../ui/index';

const {width, height} = Dimensions.get('window');
const vh = height / 100;
export default class FeedPost extends Component {
    constructor() {
        super();
        this.state = {
            containLink: false
        }
    }

    async componentWillMount() {
        const {item} = this.props;
        let containLink = await StyleUtils.containLink(item.feed.activity.post.text);
        this.setState({
            containLink: containLink,
            visible: false,
        })
        PageRefresher.createFeedSocialState(item.id);
    }

    visited(visible) {
        const {item,actions} = this.props;
        if (this.refs[item.id]) {
            this.refs[item.id].visible(visible);
        }
        if (visible) {
            if (visible && actions && actions.setSocialState) {
                actions.setSocialState(item);
            }
        }
        this.setState({
            visible: visible
        })
    }

    render() {
        const {refresh, item, save, shared, like, unlike, showUsers, comment, token, showActions} = this.props;
        const styles = this.createPromotionStyle();
        const image = this.createImageComponent(item, styles);
        const container = this.createContainerStyle(item);
        let promotionDetalis = styles.promotionDetails;
        let titleContainerStyle = {
            flexDirection: 'row',
            backgroundColor: 'white',
            height: 80,
            width: StyleUtils.getWidth()
        }
        let postMessageContainerStyle = {

            width: StyleUtils.getWidth(),
            paddingBottom: 10,
            backgroundColor:'white'
        };
        if (shared) {
            titleContainerStyle = {
                borderLeftWidth: 1,
                borderTopWidth: 1,
                borderColor: '#cccccc',
                marginLeft: 10,
                flexDirection: 'row',
                backgroundColor: 'white',
                height: 80,
                width: StyleUtils.getWidth()
            }
            promotionDetalis = styles.promotionShareDetails;
            postMessageContainerStyle = {

                borderLeftWidth: 1,
                borderColor: '#cccccc',
                marginLeft: 10,
                width: StyleUtils.getWidth(),
                paddingBottom: 10,
                backgroundColor: 'white'
            };
        }
        let headeerSize = 80;
        if ((Platform.OS === 'ios')) {
            headeerSize = 50;
        }
        const result =
            <InViewPort onChange={this.visited.bind(this)} style={container}>

                <View style={[styles.promotion_card, {backgroundColor: 'white', width: StyleUtils.getWidth()}]}>

                    <View style={[titleContainerStyle, {width: StyleUtils.getWidth()}]}>
                        <View style={{marginTop: 10, paddingLeft: 10, justifyContent: 'flex-start'}}>
                            <Thumbnail square meduim source={item.avetar}/>
                        </View>
                        <View style={{marginTop: 10, paddingLeft: 10, alignItems: 'flex-start'}}>
                            <ThisText>{item.name}</ThisText>
                            <ThisText style={{width: 240, alignItems: 'flex-start'}}>{item.feed.activity.post.title}</ThisText>
                        </View>
                        <View style={{marginTop: 10, flex: 1, paddingRight: 10, alignItems: 'flex-end', justifyContent: 'flex-start'}}>
                            <ActivityReport id={item.activityId} showActions={showActions}/>
                        </View>
                    </View>
                    <UrlPreview text={item.feed.activity.post.text}/>
                    {!this.state.containLink && <View style={postMessageContainerStyle}>

                        <View style={[promotionDetalis, {width: StyleUtils.getWidth() - 15}]}>
                            <ThisText numberOfLines={4}
                                  style={{marginRight: 10, marginLeft: 10, fontSize: 18}}>{item.feed.activity.post.text}
                            </ThisText>
                        </View>
                    </View>}
                    {image}
                    {item.video &&
                    <Video height={250} ref={item.id} width={StyleUtils.getWidth()} muted={false} url={item.video}/>}
                    {!shared && item.videoId &&
                    <Video height={250} source={'YOUTUBE'} reference={item.id} width={StyleUtils.getWidth()}
                           muted={false}
                           videoId={item.videoId}/>}
                    {shared && item.videoId &&
                    <Video height={250} source={'YOUTUBE'} reference={item.id} width={StyleUtils.getWidth()}
                           muted={false}
                           videoId={item.videoId}/>
                    }

                    {item.social && <View style={[styles.post_bottomContainer, {
                        backgroundColor: 'white',
                        borderTopWidth:1,
                        borderColor:'#cccccc',
                        width: StyleUtils.getWidth()
                    }]}>
                        <SocialState feed comments={item.social.comments} onPressComment={comment}
                                     like={item.social.like} likes={item.social.likes}
                                     onPressUnLike={() => unlike(item.id, token)}
                                     onPressLike={() => like(item.id, token)}
                                     shareDisabled={shared}
                                     share={item.social.share} shares={item.social.shares}
                                     shareAction={showUsers}/>
                    </View>}


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
        let addHight = 0;
        if (this.state.containLink) {
            addHight = 150;
        }
        return {
            flex: 1,
            width: StyleUtils.getWidth(),
            overflow: 'hidden',
            backgroundColor: 'white',
            alignItems: 'center',
            flexDirection: 'column',
            marginBottom: 10,
        }
        // if (item.banner) {
        //     if (shared) {
        //         return {
        //             flex: 1,
        //             width: StyleUtils.getWidth(),
        //             overflow: 'hidden',
        //             backgroundColor: 'white',
        //             alignItems: 'center',
        //             flexDirection: 'column',
        //         }
        //     }
        //     return {
        //         flex: 1,
        //         height: 77 * vh+ addHight,
        //         width: StyleUtils.getWidth(),
        //         overflow: 'hidden',
        //         backgroundColor: 'white',
        //         marginBottom: 10,
        //         // backgroundColor:'#FFF',
        //         alignItems: 'center',
        //         flexDirection: 'column',
        //     }
        // }
        // if (item.video || item.videoId) {
        //     if (shared) {
        //         return {
        //             width: StyleUtils.getWidth(),
        //             overflow: 'hidden',
        //             backgroundColor: 'yellow',
        //             // backgroundColor:'#FFF',
        //             marginBottom: 10,
        //             alignItems: 'center',
        //             flexDirection: 'column',
        //         }
        //     }
        //     return {
        //         flex: 1,
        //         height: 77 * vh + addHight,
        //         width: StyleUtils.getWidth(),
        //         overflow: 'hidden',
        //         backgroundColor: 'white',
        //         marginBottom: 10,
        //         // backgroundColor:'#FFF',
        //         alignItems: 'center',
        //         flexDirection: 'column',
        //     }
        // }
        // return {
        //     flex: 1,
        //     height: 45 * vh + addHight,
        //     width: StyleUtils.getWidth(),
        //     overflow: 'hidden',
        //     backgroundColor: 'white',
        //     marginBottom: 10,
        //     // backgroundColor:'#FFF',
        //     alignItems: 'center',
        //     flexDirection: 'column',
        // };
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
        return stylesLandscape;
    }
}