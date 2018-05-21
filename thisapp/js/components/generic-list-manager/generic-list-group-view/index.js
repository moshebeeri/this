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
import DateUtils from '../../../utils/dateUtils'
import StyleUtils from '../../../utils/styleUtils'
import formUtils from '../../../utils/fromUtils'
import SimpleLineIcons from "react-native-vector-icons/SimpleLineIcons";
import Ionicons from "react-native-vector-icons/Ionicons";
import withPreventDoubleClick from '../../../ui/TochButton/TouchButton';

const TouchableOpacityFix = withPreventDoubleClick(TouchableOpacity);
let dateUtils = new DateUtils();

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





    render() {
        const {item, onPressItem, index, onPressMessageItem,unReadMessage} = this.props;
        const styles = this.createStyle();
        let promotionItem = this.createPromotionItem(item);
        let showBusinessHeader = this.isBusiness(item.entity_type);
        const promotion = this.createPromotion(styles, promotionItem, showBusinessHeader);
        const message = this.createMessage(styles, item,unReadMessage);
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


        const row = <View  key={index}>
            <View style={{marginBottom: 8}}>
                <TouchableOpacityFix key={index} onPress={() => onPressItem(item)} style={containerStyle}>
                    <GroupHeader group={item} showUnfollow/>

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
                            fontSize: StyleUtils.scale(14),
                            textAlign: 'left',
                            backgroundColor: 'white'
                        }}>{strings.LatestActivity}</ThisText>
                    </View>}

                    {promotion}
                    {post}


                </TouchableOpacityFix>
                <TouchableOpacityFix style={SubContainerStyle} onPress={() => onPressMessageItem(item)}>
                    {message}

                </TouchableOpacityFix>
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

    createMessage(styles, item,unReadMessage) {
        const{chatTyping,user} = this.props;

        let groupTyping = undefined;
        if (chatTyping) {
            groupTyping = formUtils.getGroupTyping(chatTyping[item ._id],user);
        }
        let styleNotification = {
            position: 'absolute',
            bottom: 18,
            right: -40,
            borderRadius: 10,
            width: 20,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#2db6c8'
        };
        let unreadMessages = unReadMessage[item._id] ;
        if (item.preview && item.preview.comment) {
            let user = item.preview.comment.user;
            let itemChat
            let userImage = undefined;
            if (user && user.pictures && user.pictures.length > 0) {
                itemChat = {
                    date: item.preview.comment.created,
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
                    date: item.preview.comment.created,
                    isUser: true,
                    message: item.preview.comment.message,
                    avetar: require('../../../../images/client_1.png'),
                    name: name
                }


            }
            const image = <ImageController thumbnail size={StyleUtils.scale(30)} source={itemChat.avetar}/>
            let renderUnread = false;
            if(unreadMessages && unreadMessages > 0){
                renderUnread = true;
            }
            return <View style={styles.group_message_container}>


                <View style={styles.message_container}>


                    <SimpleLineIcons size={StyleUtils.scale(18)} style={{marginRight:12,}}color={'#2db6c8'}
                                     name="bubble"/>

                    {image}

                    <View style={{marginLeft: 15, alignItems: 'flex-start'}}>

                        <ThisText  numberOfLines={1} ellipsizeMode='tail'  style={styles.chatListLineTitleText}>{itemChat.message}</ThisText>
                        <View style={{flexDirection:'row'}}>
                        <ThisText style={styles.chatListLineDescText}>{dateUtils.messageFormater(item.preview.comment.created)}</ThisText>
                            {groupTyping && <View style={{marginLeft:10,marginRight:10,backgroundColor:'white',justifyContent:'center',alignItems:'flex-start'}}><ThisText style={{ backgroundColor:'white',fontSize:14,justifyContent:'center',alignItems:'center',fontWeight: '300', color: '#2db6c8'}}>{strings.typingMessage.formatUnicorn(groupTyping)}</ThisText></View>}

                        </View>
                        { renderUnread && <View style={styleNotification}><ThisText style={[styles.chatListLineDescText,{color:'white',fontWeight:'bold'}]}>{unreadMessages}</ThisText></View>}

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
            const image = <ImageController thumbnail small size={30} source={post.avetar}/>
            return <View style={styles.group_message_container}>

                <View style={styles.message_container}>

                <Ionicons size={30} style={{marginRight:12,}}color={'#2db6c8'}
                                 name="ios-person-outline"/>


                        {image}


                    <View style={{padding: 5, alignItems: 'flex-start'}}>
                        <ThisText style={styles.chatListLineTitleText}>{strings.postMessage.formatUnicorn(post.name)}</ThisText>
                        <ThisText style={{width:250}}ellipsizeMode={'tail'} numberOfLines={1}>{post.message}</ThisText>
                    </View>
                </View>

            </View>
        }
        return undefined;
    }
}

