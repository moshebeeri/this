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
    Text,
    Thumbnail,
    Title,
    View
} from 'native-base';
import GroupApi from "../../../api/groups"
import stylesPortrate from './styles'
import DateUtils from '../../../utils/dateUtils';
import UiConverter from '../../../api/feed-ui-converter'
import {GroupHeader, PromotionHeaderSnippet,ImageController,ThisText} from '../../../ui/index';
import strings from '../../../i18n/i18n';
import styles from "../../../ui/PromotionHeaderSnippet/styles";

const {width, height} = Dimensions.get('window');
const vw = width / 100;
const vh = height / 100;
let groupApi = new GroupApi();
let dateUtils = new DateUtils();
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

    render() {
        const {item, onPressItem, index, onPressMessageItem} = this.props;
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
            padding:0,
        };

        const row = <View key={index}>
            <View style={{marginBottom: 8}}>
                <TouchableOpacity key={index} onPress={onPressItem} style={containerStyle}>
                    <GroupHeader group={item}/>

                    {(promotion || post || message) && <View style={{marginLeft: 30, marginRight:30, width: width-30, justifyContent: 'flex-start', borderBottomWidth:1, borderBottomColor:'#CACACA', marginBottom:10}}>
                        <ThisText style={{marginLeft: 4, marginBottom:2, fontWeight:'200', color:'#616F70', fontSize:14, textAlign:'left', backgroundColor:'white'}}>{strings.LatestActivity}</ThisText>
                   </View>}

                    {promotion}
                    {post}
                    {promotion && item.unreadFeeds > 0 &&
                    <View style={{marginLeft: 30, width: width, justifyContent: 'flex-start'}}>
                        <ThisText style={{
                            color: '#2db6c8',
                            fontWeight: 'bold'
                        }}>{strings.UnReadPost.formatUnicorn(item.unreadFeeds)}</ThisText>
                    </View>}


                </TouchableOpacity>
                <TouchableOpacity style={SubContainerStyle} onPress={onPressMessageItem}>
                    {message}
                    {message && item.unreadMessages > 0 &&
                    <View style={{marginLeft: 30, marginBottom: 5, width: width, justifyContent: 'flex-start', backgroundColor:'white'}}>
                        <ThisText style={{
                            color: '#25964e',
                            fontWeight: 'bold'
                        }}>{strings.UnReadMessages.formatUnicorn(item.unreadMessages)}</ThisText>
                    </View>}
                </TouchableOpacity>
            </View>
        </View>
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

                    <ImageController style={{marginLeft:0, marginRight:12,alignItems: 'flex-start', width:19, height:18 }} source={require('../../../../images/chaticon.png')}/>




                    {image}

                    <View style={{marginLeft:15, alignItems: 'flex-start'}}>

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

