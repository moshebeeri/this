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
const {width, height} = Dimensions.get('window')
const vw = width / 100;
const vh = height / 100
let groupApi = new GroupApi();
let dateUtils = new DateUtils();
let uiConverter = new UiConverter();
export default class GenericListGroupView extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const {item, onPressItem, index} = this.props;
        const styles = this.createStyle();

        const promotion = this.createPromotion(styles, item);
        const message = this.createMessage(styles, item);
        const height = this.calcHeight(promotion, message);
        const conainerStyle = {

            alignItems: 'center',
            marginBottom: 4,
            backgroundColor: 'white'
        };
        const row = <View key={index}>
            <TouchableOpacity key={index} onPress={onPressItem}>
                <View style={conainerStyle}>
                    <GroupHeader group={item}/>


                    {promotion}
                    {message}
                </View>
            </TouchableOpacity>
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

    createPromotion(styles, item) {
        if (item.preview && item.preview.instance_activity) {
            let promotion = uiConverter.createPromotionInstance(item.preview.instance_activity.instance);
            let lastPromotion = <Text note style={styles.group_members}>{promotion.promotion}:</Text>
            let promotinoTitle = <Text note numberOfLines={2} style={styles.group_members}>{promotion.itemTitle}</Text>
            let promotionTime = <Text note
                                      style={styles.dateFont}>{dateUtils.messageFormater(item.preview.instance_activity.timestamp)}</Text>
            let promotionImage = undefined;
            if (promotion.banner && promotion.banner.uri) {
                promotionImage = <Thumbnail medium source={{uri: promotion.banner.uri}}/>
            }
            return <View style={styles.group_promotion_container}>
                <PromotionHeaderSnippet promotion={promotion}type={promotion.promotion} feed titleText={promotion.promotionTitle}
                                 titleValue={promotion.promotionValue} term={promotion.promotionTerm}/>

            </View>
        }
        return undefined;
    }


    createMessage(styles, item) {
        if (item.preview && item.preview.message_activity) {
            let user = item.preview.message_activity.user;
            let lastMessage = <Text numberOfLines={3} note
                                    style={styles.group_members}>{item.preview.message_activity.message}</Text>
            let messageTime = <Text note
                                    style={styles.dateFont}>{dateUtils.messageFormater(item.preview.message_activity.timestamp)}</Text>
            let userImage = undefined;
            if (user.pictures && user.pictures.length > 0) {
                userImage = <Thumbnail small source={{uri: user.pictures[user.pictures.length - 1].pictures[3]}}/>
            } else {
                userImage = <Thumbnail small source={require('../../../../images/client_1.png')}/>
            }
            return <View style={styles.group_message_container}>

                <View style={styles.group_image}>
                   {userImage}
                </View>
                <View style={styles.message_container}>
                    <View>
                        <Text style={{fontWeight: 'bold'}}>{user.name}</Text>
                    </View>

                    {lastMessage}

                </View>

            </View>
        }
        return undefined;
    }
}

