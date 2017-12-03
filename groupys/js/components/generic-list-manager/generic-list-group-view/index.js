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
        const {item, onPressItem, index} = this.props;
        const styles = this.createStyle();
        let promotionItem = this.createPromotionItem(item);
        let showBusinessHeader = this.isBusiness(item.entity_type);

        const promotion = this.createPromotion(styles, promotionItem,showBusinessHeader);
        const message = this.createMessage(styles, item);
        const containerStyle = {
            alignItems: 'center',
            marginBottom: 4,
            backgroundColor: 'white'
        };
        const row = <View key={index}>
            <TouchableOpacity key={index} onPress={onPressItem}>
                <View style={containerStyle}>
                    <GroupHeader group={item}/>

                    {showBusinessHeader && promotionItem &&
                    <View style={{marginLeft:10,flex:1,alignItems:'flex-start',justifyContent:'flex-start'}}>
                        <BusinessHeader small navigation={this.props.navigation} business={promotionItem.business}
                                        businessLogo={promotionItem.businessLogo}
                                        businessName={promotionItem.businessName}/>
                    </View>
                    }
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

    createPromotionItem(item) {
        if (item.preview && item.preview.instance_activity) {
            return uiConverter.createPromotionInstance(item.preview.instance_activity.instance);
        }
        return undefined;
    }

    createPromotion(styles, promotion,showBusinessHeader) {
        if (promotion) {
            return <View style={styles.group_promotion_container}>

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
            let lastMessage = <Text numberOfLines={3} note
                                    style={styles.group_members}>{item.preview.comment.message}</Text>
            let messageTime = <Text note
                                    style={styles.dateFont}>{dateUtils.messageFormater(item.preview.comment.timestamp)}</Text>
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

