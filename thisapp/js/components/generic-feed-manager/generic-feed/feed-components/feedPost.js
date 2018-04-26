/**
 * Created by roilandshut on 23/07/2017.
 */
import React, {Component} from 'react';
import {Image} from 'react-native';
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
    View
} from 'native-base';
import stylesLandscape from './styles'
import StyleUtils from '../../../../utils/styleUtils'
import {ActivityReport, ImageController, SocialState, ThisText, UrlPreview, Video} from '../../../../ui/index';
import strings from "../../../../i18n/i18n"

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
    }

    shouldComponentUpdate() {
        const {item, visibleItem, shouldUpdate, visibleFeeds} = this.props;
        if (shouldUpdate) {
            return true;
        }
        let results = item.id === visibleItem;
        if (results) {
            return results
        }
        if (visibleFeeds && item.fid && visibleFeeds.includes(item.fid)) {
            return true;
        }
        return false;
    }

    visited(visible) {
        const {item, actions, group} = this.props;
        if (this.refs[item.id]) {
            this.refs[item.id].visible(visible);
        }
        if (visible) {
            if (visible && actions && actions.setSocialState) {
                // actions.setSocialState(item);
            }
            if (group) {
                actions.setVisibleItem(item.fid, group._id);
            } else {
                actions.setVisibleItem(item.fid);
            }
            if (this.itemMissingImageOrVideo(item)) {
                actions.updateFeed(item);
            }
        }
        this.setState({
            visible: visible
        })
    }

    itemMissingImageOrVideo(item) {
        if (!item.video && !item.videoId && (!item.banner || (item.banner && !item.banner.uri))) {
            return true
        }
        return false
    }

    render() {
        const {refresh, item, save, shared, like, unlike, showUsers, comment, token, showActions, group} = this.props;
        const styles = this.createPromotionStyle();
        const image = this.createImageComponent(item, styles);
        const container = this.createContainerStyle(item);
        let promotionDetalis = styles.promotionDetails;
        let titleContainerStyle = {
            flexDirection: 'row',
            backgroundColor: 'white',
            width: StyleUtils.getWidth()
        }
        let postMessageContainerStyle = {
            width: StyleUtils.getWidth(),
            backgroundColor: 'white'
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
            }
            postMessageContainerStyle = {
                borderLeftWidth: 1,
                borderColor: '#cccccc',
                marginLeft: 10,
                width: StyleUtils.getWidth() - 15,
                paddingBottom: 10,
                backgroundColor: 'white'
            };
        }
        const result =
            <InViewPort onChange={this.visited.bind(this)} style={container}>

                <View style={{backgroundColor: 'white', width: StyleUtils.getWidth()}}>

                    <View style={[titleContainerStyle, {
                        backgroundColor: 'white',
                        alignItems: 'center',
                        width: StyleUtils.getWidth()
                    }]}>
                        <View style={{marginTop: 10, paddingLeft: 10, justifyContent: 'flex-start'}}>
                            {item.avetar &&
                            <ImageController thumbnail size={StyleUtils.scale(30)} source={item.avetar}/>}
                        </View>
                        <View style={{marginTop: 10, paddingLeft: 10, alignItems: 'center'}}>
                            <ThisText
                                style={{fontSize: StyleUtils.scale(14)}}>{strings.postMessage.formatUnicorn(item.name)}</ThisText>
                        </View>
                        <View style={{
                            marginTop: 10,
                            flex: 1,
                            paddingRight: 30,
                            alignItems: 'flex-end',
                            justifyContent: 'flex-start'
                        }}>
                            <ActivityReport id={item.activityId} showActions={showActions}/>
                        </View>
                    </View>
                    <UrlPreview post={item.feed.activity.post} text={item.feed.activity.post.text}/>
                    {!this.state.containLink && <View style={postMessageContainerStyle}>

                        <View style={{width: StyleUtils.getWidth() - 15}}>
                            <ThisText
                                style={{
                                    paddingTop: StyleUtils.scale(10),
                                    marginRight: StyleUtils.scale(10),
                                    marginLeft: StyleUtils.scale(20),
                                    paddingBottom: StyleUtils.scale(10),
                                    fontSize: StyleUtils.scale(18)
                                }}>{item.feed.activity.post.text}
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
                        borderTopWidth: 1,
                        borderColor: '#cccccc',
                        width: StyleUtils.getWidth()
                    }]}>
                        <SocialState feed comments={item.social.comments} onPressComment={comment}
                                     like={item.social.like} likes={item.social.likes}
                                     onPressUnLike={() => unlike(item.id, token)}
                                     onPressLike={() => like(item.id, token)}
                                     shareDisabled={shared}
                                     groupChat={group && group.chat_policy === 'ON'}
                                     sharable={item.sharable}
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