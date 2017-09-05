import React, {Component} from 'react';
import {Image, Platform,TouchableNativeFeedback,Dimensions,TouchableHighlight,TouchableOpacity} from 'react-native';
import {connect} from 'react-redux';
import {actions} from 'react-native-navigation-redux-helpers';
import {Container, Content, Text,Title, InputGroup, Input, Button, Icon, View,Header, Body, Right, ListItem, Thumbnail,Left} from 'native-base';
const {width, height} = Dimensions.get('window')
const   vw = width/100;
const  vh = height/100

import GroupApi from "../../../api/groups"
let groupApi = new GroupApi();

import stylesPortrate from './styles'
import stylesLandscape from './styles_landscape'
import StyleUtils from '../../../utils/styleUtils'

import DateUtils from '../../../utils/dateUtils';
let dateUtils = new DateUtils();

import UiConverter from '../../../api/feed-ui-converter'
let uiConverter = new UiConverter();
export default class GenericListGroupView extends Component {


    constructor(props) {
        super(props);

    }


     showGroupFeeds(props,group){
        groupApi.touch(group._id);
        this.props.navigation.navigate('GroupFeed',{group:group,role:this.props.item.role});
    }

    showUsers(show){
        let users = this.props.user.followers;
        if(users) {
            this.props.navigation.navigate('SelectUsersComponent', {
                users: users,
                selectUsers: this.selectUsers.bind(this)
            })
        }

    }

    render() {
        let styles = stylesPortrate
        if(StyleUtils.isLandscape()){
            styles = stylesLandscape;
        }

        let row = undefined
        let image =  <Thumbnail large square   source={require('../../../../images/client_1.png')}/>

        let promotion = this.createPromotion(styles);
        let message = this.createMessage(styles);
        let height = this.calcHeight(promotion,message);
        let conainerStyle = {  width :width  ,
            height: vh*height,
            alignItems:'center',
            marginBottom: 4,

            backgroundColor:'white'};

        let group = this.props.item;
        if(group.pictures && group.pictures.length > 0) {
            if(group.pictures[0].pictures[3]) {
                image = <Thumbnail large square source={{uri: group.pictures[0].pictures[3]}}/>
            }

        }else{
            if(group.entity && group.entity.business ){
                if(group.entity.business.pictures[0].pictures[3]) {
                    image = <Thumbnail large square source={{uri: group.entity.business.pictures[0].pictures[3]}}/>
                }


            }
        }



            row = <TouchableOpacity  onPress={this.showGroupFeeds.bind(this,this.props,group)}  >
                    <View style = {conainerStyle}>
                    <View style = {styles.group_description}>
                        <View style = {styles.group_image}>
                        {image}
                        </View>
                        <View style={styles.group_name}>
                        <Text  style={styles.group_name_text}>{group.name}</Text>

                        </View>

                    </View>

                        {message}
                        {promotion}

                 </View>
                </TouchableOpacity>


        return ( row

        );


    }

    calcHeight(promotion,message){
        if(promotion && message){
            return 43;
        }

        if(!promotion && !message){
            return 15
        }

        return 29;
    }
    createPromotion(styles){
        if(this.props.item.preview && this.props.item.preview.instance_activity) {
            let promotion = uiConverter.createPromontionInstance(this.props.item.preview.instance_activity.instance);
            let lastPromotion = <Text note style={styles.group_members}>{promotion.promotion}:</Text>
            let  promotinoTitle = <Text note numberOfLines={2} style={styles.group_members}>{promotion.itemTitle}</Text>
            let  promotionTime = <Text note
                                  style={styles.dateFont}>{dateUtils.messageFormater(this.props.item.preview.instance_activity.timestamp)}</Text>
            let promotionImage = undefined;
            if(promotion.banner && promotion.banner.uri) {
                promotionImage = <Thumbnail medium source={{uri: promotion.banner.uri}}/>

            }
            return <View style={styles.group_promotion_container}>
                <View style={styles.group_image}>
                    <Text style={styles.latest_text}>Last promotion</Text>
                    {promotionImage}
                </View>
                <View style={styles.group_name}>
                    {lastPromotion}
                    {promotinoTitle}
                </View>
                <View style={styles.date_container}>
                    {promotionTime}
                </View>
            </View>
        }
        return undefined;

    }

    createMessage(styles){

        if(this.props.item.preview && this.props.item.preview.message_activity ) {
            let user = this.props.item.preview.message_activity.user;

            let  lastMessage = <Text numberOfLines={3} note
                                style={styles.group_members}>{ this.props.item.preview.message_activity.message}</Text>
            let  messageTime = <Text note
                                style={styles.dateFont}>{dateUtils.messageFormater(this.props.item.preview.message_activity.timestamp)}</Text>
            let userImage = undefined;
            if (user.pictures && user.pictures.length > 0) {
                userImage = <Thumbnail medium source={{uri: user.pictures[user.pictures.length - 1].pictures[3]}}/>


            } else {
                userImage = <Thumbnail medium source={require('../../../../images/client_1.png')}/>

            }

            return <View style={styles.group_message_container}>

                <View style={styles.group_image}>
                    <Text style={styles.latest_text}>Last message</Text>
                    {userImage}
                </View>
                <View style={styles.message_container}>
                    <View style={styles.message_date_container}>
                        {messageTime}
                    </View>
                    {lastMessage}

                </View>

            </View>
        }
        return undefined;
    }
}

