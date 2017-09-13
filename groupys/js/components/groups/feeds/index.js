
import React, { Component } from 'react';
import { Image,TextInput, Platform,View,Keyboard,TouchableNativeFeedback,TouchableOpacity,BackHandler} from 'react-native';

import { connect } from 'react-redux';
import { actions } from 'react-native-navigation-redux-helpers';
import { Container,Footer,Icon,Button,Text,Input } from 'native-base';
import GroupFeedHeader from './groupFeedHeader'


import GenericFeedManager from '../../generic-feed-manager/index'
import GenericFeedItem from '../../generic-feed-manager/generic-feed'
import styles from './styles'
import Icon2 from 'react-native-vector-icons/Entypo';
import FeedApi from '../../../api/feed'
let feedApi = new FeedApi();
import store from 'react-native-simple-store';
import { bindActionCreators } from "redux";

import * as feedsAction from "../../../actions/feeds";
import UiTools from '../../../api/feed-ui-converter'
let uiTools = new UiTools();
import GroupApi from "../../../api/groups"
let groupApi = new GroupApi();
import EmojiPicker from 'react-native-emoji-picker-panel'

import InstanceComment from './instancesComment';
class GroupFeed extends Component {
    static navigationOptions = ({ navigation }) => ({
        header:   <GroupFeedHeader navigation = {navigation} role = {navigation.state.params.role} item={navigation.state.params.group}/>

    });
  constructor(props) {
    super(props);
      this.state = {

          messsage: '',
          showEmoji:false,
          iconEmoji:'emoji-neutral',
          showChat:false

      };
      this.handlePick = this.handlePick.bind(this);
        this.props.fetchGroupFeedsFromStore(this.props.navigation.state.params.group._id);

  }






    componentWillMount(){
        BackHandler.addEventListener('hardwareBackPress', this.handleBack.bind(this));

        this.fetchFeeds();
    }

    handleBack(){
        this.props.fetchGroups();
    }


     async getAll(direction,id){

      let feed = await feedApi.getAll(direction,id,this.props.navigation.state.params.group._id);
      return feed;
    }



    fetchFeeds(){
         let groupid = this.props.navigation.state.params.group._id;
         let groupFeeds = 'groups'+ groupid;

        let feeds = this.props.feeds[groupFeeds];
        if(feeds){
            feeds = feeds.filter(function (feed) {
                return feed.id != '100'

            })
        }
         if(feeds && feeds.length > 0 ){
             this.props.fetchGroupFeeds(groupid, 'GET_GROUP_FEEDS', feeds, this);

         }else {
             this.props.fetchGroupFeeds(groupid, 'GET_GROUP_FEEDS', new Array(), this);
         }
    }
    fetchTop(id){
        let groupid = this.props.navigation.state.params.group._id;
        let groupFeeds = 'groups'+ groupid;
        if(this.props.feeds[groupFeeds] && this.props.feeds[groupFeeds].length >0) {
            let feeds = this.props.feeds[groupFeeds];
            if(feeds){
                feeds = feeds.filter(function (feed) {
                    return feed.id != '100'

                })
            }

            this.props.fetchGroupTop(groupid, 'GET_GROUP_FEEDS', feeds, feeds[0].id, this);

        }
    }

    async _onPressButton(){
        let groupid = this.props.navigation.state.params.group._id;


        let message = this.state.messsage;
        if(message) {
            this.setState({
                messsage: '',
                showEmoji: false,
                iconEmoji: 'emoji-neutral'
            })

            let featchTop =false;
            let groupFeeds = 'groups'+ groupid;
            let feeds = this.props.feeds[groupFeeds];

            if(feeds){
                feeds = feeds.filter(function (feed) {
                    return feed.id != '100'

                })
            }
            if(feeds && feeds.length >0) {
                featchTop = true;
            }

            await this.addDirectMessage(message);
            await groupApi.meesage(groupid, message);
            if(featchTop){
                await this.fetchTop(0);
            }else{
                await this.fetchFeeds();
            }
        }



    }

    async addDirectMessage(message){
        let user = await store.get('user');
        let messageInstance = uiTools.createMessage(user,message);
        await this.props.directAddMessage(this.props.navigation.state.params.group,messageInstance)

    }
    handlePick(emoji) {
      let message = this.state.messsage;

        this.setState({
            messsage: message + emoji ,
        });
    }


    showEmoji(){

        let show = !this.state.showEmoji;
        if(show) {
            this.setState({
                showEmoji: show,
                iconEmoji: "keyboard"

            })
        }else{
            Keyboard.dismiss();
            this.setState({
                showEmoji: show,
                iconEmoji: "emoji-neutral"

            })
        }
    }

    updateFeed(feed){
        this.props.updateGroupFeed(feed,this.props.navigation.state.params.group);
    }
    hideEmoji(){
        this.setState({
            showEmoji:false,
            iconEmoji:'emoji-neutral'
        })
    }

    selectPromotions(){
        this.setState({
            showChat: false
        })
    }

    selectChat(){

        this.setState({
            showChat: true
        })
    }

    nextLoad(){

    }
    render() {

       // let body = this.createGroupFeeds();
        let promotionStyle = styles.נpromotionButtonOn;
        let textPromotionStyle = styles.group_text_on;
        let textChatStyle = styles.group_text_off;
        let chatStyle = styles.נchatButtonOFf
        if(this.state.showChat){
            body = <InstanceComment navigation={this.props.navigation} group={this.props.navigation.state.params.group}/>
             promotionStyle = styles.promotionButtonOff;
             chatStyle = styles.chatButtonOn
             textPromotionStyle = styles.group_text_off;
             textChatStyle = styles.group_text_on;
        }


        return (
        <Container style={{ backgroundColor:'#ebebeb'}}>

            <View style={styles.headerTabContainer}>
                <View style={styles.headerTabInnerContainer}>
                    <TouchableOpacity onPress={this.selectPromotions.bind(this)}>
                <View style={promotionStyle}>
                    <Text style={textPromotionStyle}>Posts</Text>
                </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={this.selectChat.bind(this)}>
                    <View style={chatStyle}>
                        <Text style={textChatStyle}>Promotions</Text>
                    </View>
                    </TouchableOpacity>
                </View>



            </View>


        </Container>



        );
    }


    createGroupFeeds(){
        let feeds = this.props.feeds['groups'+this.props.navigation.state.params.group._id];
        if(!feeds){
            feeds = [];
        }


        let showTop = this.props.feeds['showTopLoader'+this.props.navigation.state.params.group._id];
        if(!showTop){
            showTop = false;


        }
        return  <View style={styles.inputContainer}>
            <GenericFeedManager group ={this.props.navigation.state.params.group} navigation={this.props.navigation} loadingDone = {this.props.feeds['grouploadingDone' + this.props.navigation.state.params.group._id]} showTopTimer={showTop} feeds={feeds} api={this} title='Feeds' ItemDetail={GenericFeedItem}></GenericFeedManager>

            <View style={styles.itemborder}>
                <View style={ {backgroundColor:'white',  flexDirection: 'row'}}>
                    <Button   onPress={() => this._onPressButton()} style={styles.icon} transparent>

                        <Icon style={{fontSize:35,color:"#2db6c8"}} name='send' />
                    </Button>
                    <Input value={this.state.messsage}  onFocus={this.hideEmoji.bind(this)} blurOnSubmit={true} returnKeyType='done' ref="3"  onSubmitEditing={this._onPressButton.bind(this)} onChangeText={(messsage) => this.setState({messsage})} placeholder='write text' />


                    <Button   onPress={() => this.showEmoji()} style={styles.icon} transparent>

                        <Icon2 style={{fontSize:35,color:"#2db6c8"}} name={this.state.iconEmoji} />
                    </Button>

                </View>

            </View>
            <EmojiPicker stylw={{height:100}}visible={this.state.showEmoji}  onEmojiSelected={this.handlePick} />
        </View>
    }

}

export default connect(
    state => ({
        feeds: state.feeds
    }),
    dispatch => bindActionCreators(feedsAction, dispatch)
)(GroupFeed);



