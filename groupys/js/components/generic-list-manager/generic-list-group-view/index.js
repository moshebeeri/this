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
import stylesLandscape from './styles_landscape'
import StyleUtils from '../../../utils/styleUtils'
import DateUtils from '../../../utils/dateUtils';
import UiConverter from '../../../api/feed-ui-converter'
import {GroupHeader, PromotionHeaderSnippet} from '../../../ui/index';
import BusinessHeader from "../../../ui/BusinessHeader/BusinessHeader";

const {width, height} = Dimensions.get('window');
const vw = width / 100;
const vh = height / 100;
let groupApi = new GroupApi();
let dateUtils = new DateUtils();
let uiConverter = new UiConverter();
import strings from '../../../i18n/i18n';

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
        const {item, onPressItem, index,onPressMessageItem} = this.props;
        const styles = this.createStyle();
        let promotionItem = this.createPromotionItem(item);
        let showBusinessHeader = this.isBusiness(item.entity_type);
        const promotion = this.createPromotion(styles, promotionItem, showBusinessHeader);
        const message = this.createMessage(styles, item);
        const post = this.createPost(styles,item);

        const containerStyle = {
            alignItems: 'center',

            backgroundColor: 'white'
        };
        const row = <View key={index}>
            <View style={{marginBottom:10}}>
                <TouchableOpacity  key={index} onPress={onPressItem} style={containerStyle} >
                    <GroupHeader group={item}/>




                    {promotion}
                    {post}
                    {promotion && item.unreadFeeds>0 &&  <View style={{marginLeft: 30,width:width,justifyContent:'flex-start'}}>
                        <Text style={{color:'#2db6c8',fontWeight:'bold'}}>{strings.UnReadPost.formatUnicorn(item.unreadFeeds)}</Text>
                    </View>}


                </TouchableOpacity>
                <TouchableOpacity style={containerStyle} onPress={onPressMessageItem}>
                {message}
                {message &&  item.unreadMessages>0 && <View style={{marginLeft: 30,marginBottom:5,width:width,justifyContent:'flex-start'}}>
                    <Text style={{color:'#25964e',fontWeight:'bold'}}>{strings.UnReadMessages.formatUnicorn(item.unreadMessages)}</Text>
                </View>}
                </TouchableOpacity>
            </View>
        </View>
        return ( row

        );
    }

    createStyle() {
        if (StyleUtils.isLandscape()) {
            return stylesLandscape;
        }
        return stylesPortrate;
    }

    calcHeight(promotion, message) {
        if (promotion && message) {
            return 43;
        }
        if (!promotion && !message) {
            return 15
        }
        return 29;
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
            const image = <Thumbnail small source={itemChat.avetar}/>
            return <View style={styles.group_message_container}>


                <View style={styles.message_container}>

                    {image}

                    <View style={{padding: 2, alignItems: 'flex-start'}}>
                        <Text>{itemChat.name}</Text>
                        <Text>{itemChat.message}</Text>
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
            const image = <Thumbnail square small source={post.avetar}/>
            return <View style={styles.group_message_container}>


                <View style={styles.post_container}>
                    <View style={{paddingTop:5}}>
                     {image}
                    </View>

                    <View style={{padding: 5, alignItems: 'flex-start'}}>
                        <Text>{post.name} {strings.Posted}</Text>
                        <Text>{post.title} - {post.message}</Text>
                    </View>
                </View>

            </View>
        }
        return undefined;
    }
}

