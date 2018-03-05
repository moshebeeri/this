import React, {Component} from 'react';
import {Dimensions, TouchableOpacity} from 'react-native';
import {actions} from 'react-native-navigation-redux-helpers';
import {
    Button,
    Container,
    Content,
    Header,
    Icon,
    Input,
    InputGroup,
    Left,
    ListItem,
    Right,
    Thumbnail,
    Title,
    View
} from 'native-base';
import stylesPortrate from './styles'
import UiConverter from '../../../api/feed-ui-converter'
import {GroupHeader, ImageController, PromotionHeaderSnippet, ThisText} from '../../../ui/index';
import strings from '../../../i18n/i18n';
import InViewPort from '../../../utils/inviewport'

const {width, height} = Dimensions.get('window');
let uiConverter = new UiConverter();
export default class GenericListGroupView extends Component {
    constructor(props) {
        super(props);
    }

    isBusiness(groupType) {
        switch (groupType) {
            case 'BUSINESS':
                return false;
            default:
                return true;
        }
    }

    shouldComponentUpdate() {
        const {visibleItem} = this.props;
        if (visibleItem) {
            return true;
        }
        return false;
    }

    visited() {
        const {item, setVisibleItem} = this.props;
        setVisibleItem(item._id);
    }

    render() {
        const {item, onPressItem, index, onPressMessageItem,} = this.props;
        const styles = this.createStyle();
        let promotionItem = this.createPromotionItem(item);
        let showBusinessHeader = this.isBusiness(item.entity_type);
        const promotion = this.createPromotion(styles, promotionItem, showBusinessHeader);
        const message = this.createMessage(styles, item);
        const post = this.createPost(styles, item);
        const containerStyle = {
            alignItems: 'center',
            backgroundColor: 'white'
        };
        const SubContainerStyle = {
            alignItems: 'center',
            backgroundColor: 'white',
            padding: 0,
        };
        const row = <InViewPort onChange={this.visited.bind(this)} key={index}>
            <View style={{marginBottom: 8}}>
                <TouchableOpacity key={index} onPress={onPressItem} style={containerStyle}>
                    <GroupHeader group={item}/>

                    {(promotion || post || message) && <View style={{
                        marginLeft: 30,
                        marginRight: 30,
                        width: width - 30,
                        justifyContent: 'flex-start',
                        borderBottomWidth: 1,
                        borderBottomColor: '#CACACA',
                        marginBottom: 10
                    }}>
                        <ThisText style={{
                            marginLeft: 4,
                            marginBottom: 2,
                            fontWeight: '200',
                            color: '#616F70',
                            fontSize: 14,
                            textAlign: 'left',
                            backgroundColor: 'white'
                        }}>{strings.LatestActivity}</ThisText>
                    </View>}

                    {promotion}
                    {post}


                </TouchableOpacity>
                <TouchableOpacity style={SubContainerStyle} onPress={onPressMessageItem}>
                    {message}

                </TouchableOpacity>
            </View>
        </InViewPort>
        return ( row

        );
    }

    createStyle() {
        return stylesPortrate;
    }

    createPromotionItem(item) {
        if (item.preview && item.preview.instance_activity && item.preview.instance_activity.instance && item.preview.instance_activity.instance.promotion) {
            return uiConverter.createPromotionInstance(item.preview.instance_activity.instance);
        }
        return undefined;
    }

    createPromotion(styles, promotion, showBusinessHeader) {
        if (promotion) {
            return <View style={styles.message_container2}>

                <PromotionHeaderSnippet business={showBusinessHeader} promotion={promotion} type={promotion.promotion}
                                        feed titleText={promotion.promotionTitle}
                                        titleValue={promotion.promotionValue} term={promotion.promotionTerm}/>


            </View>
        }
        return undefined;
    }

    createMessage(styles, item) {
        if (item.preview && item.preview.comment) {
            let user = item.preview.comment.user;
            let itemChat
            let userImage = undefined;
            if (user && user.pictures && user.pictures.length > 0) {
                itemChat = {
                    date: item.preview.comment.timestamp,
                    message: item.preview.comment.message,
                    isUser: true,
                    avetar: {uri: user.pictures[user.pictures.length - 1].pictures[3]},
                    name: user.name
                }
            } else {
                let name
                if (user) {
                    name = user.name;
                }
                itemChat = {
                    date: item.preview.comment.timestamp,
                    isUser: true,
                    message: item.preview.comment.message,
                    avetar: require('../../../../images/client_1.png'),
                    name: name
                }
            }
            const image = <ImageController thumbnail size={30} source={itemChat.avetar}/>
            return <View style={styles.group_message_container}>


                <View style={styles.message_container}>

                    <ImageController
                        style={{marginLeft: 0, marginRight: 12, alignItems: 'flex-start', width: 19, height: 18}}
                        source={require('../../../../images/chaticon.png')}/>


                    {image}

                    <View style={{marginLeft: 15, alignItems: 'flex-start'}}>

                        <ThisText style={styles.chatListLineTitleText}>{itemChat.name}</ThisText>
                        <ThisText style={styles.chatListLineDescText}>{itemChat.message}</ThisText>
                    </View>
                </View>

            </View>
        }
        return undefined;
    }

    createPost(styles, item) {
        if (item.preview && item.preview.post) {
            let user = item.preview.post.creator;
            let post
            if (user && user.pictures && user.pictures.length > 0) {
                post = {
                    date: item.preview.post.created,
                    title: item.preview.post.title,
                    message: item.preview.post.text,
                    isUser: true,
                    avetar: {uri: user.pictures[user.pictures.length - 1].pictures[3]},
                    name: user.name
                }
            } else {
                let name
                if (user) {
                    name = user.name;
                }
                post = {
                    date: item.preview.comment.timestamp,
                    isUser: true,
                    message: item.preview.post.text,
                    title: item.preview.post.title,
                    avetar: require('../../../../images/client_1.png'),
                    name: name
                }
            }
            const image = <ImageController thumbnail square size={30} source={post.avetar}/>
            return <View style={styles.group_message_container}>


                <View style={styles.post_container}>
                    <View style={{paddingTop: 5}}>
                        {image}
                    </View>

                    <View style={{padding: 5, alignItems: 'flex-start'}}>
                        <ThisText>{post.name} {strings.Posted}</ThisText>
                        <ThisText>{post.title} - {post.message}</ThisText>
                    </View>
                </View>

            </View>
        }
        return undefined;
    }
}

