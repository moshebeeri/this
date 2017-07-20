
import React, { Component } from 'react';
import { Image,TextInput, Platform,View,Keyboard} from 'react-native';

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

import { bindActionCreators } from "redux";

import * as feedsAction from "../../../actions/feeds";

import GroupApi from "../../../api/groups"
let groupApi = new GroupApi();
import EmojiPicker from 'react-native-emoji-picker-panel'
class GroupFeed extends Component {
    static navigationOptions = ({ navigation }) => ({
        header:   <GroupFeedHeader navigation = {navigation} item={navigation.state.params.group}/>

    });
  constructor(props) {
    super(props);
      this.state = {

          messsage: '',
          showEmoji:false,
          iconEmoji:'emoji-neutral'

      };
      this.handlePick = this.handlePick.bind(this);


  }






    componentWillMount(){
      this.fetchFeeds();
    }



     async getAll(direction,id){

      let feed = await feedApi.getAll(direction,id,this.props.navigation.state.params.group._id);
      return feed;
    }



    fetchFeeds(){
         let groupid = this.props.navigation.state.params.group._id;
         let goupfeeds = 'groups'+ groupid;
         if(!this.props.feeds[goupfeeds]){
             this.props.fetchGroupFeeds(groupid, 'GET_GROUP_FEEDS', new Array(), this);
         }else {
             this.props.fetchGroupFeeds(groupid, 'GET_GROUP_FEEDS', this.props.feeds[goupfeeds], this);
         }
    }
    fetchTop(id){
        let groupid = this.props.navigation.state.params.group._id;
        let groupFeeds = 'groups'+ groupid;

        this.props.fetchGroupTop(groupid,'GET_GROUP_FEEDS',this.props.feeds[groupFeeds],this.props.feeds[groupFeeds][0].id,this);
    }

    async _onPressButton(){
        let groupid = this.props.navigation.state.params.group._id;
        let groupFeeds = 'groups'+ groupid;
        await groupApi.meesage(groupid,this.state.messsage);
        this.props.fetchGroupTop(groupid,'GET_GROUP_FEEDS',this.props.feeds[groupFeeds],this.props.feeds[groupFeeds][0].id,this);
        this.setState({
            messsage:'',
            showEmoji:false,
            iconEmoji:'emoji-neutral'
        })


    }
    handlePick(emoji) {
      let message = this.state.messsage;

        this.setState({
            messsage: message + emoji ,
        });
    }


    showEmoji(){
        Keyboard.dismiss();
        let show = !this.state.showEmoji;
        this.setState({
            showEmoji:show,
            iconEmoji:"keyboard"

        })
    }
    hideEmoji(){
        this.setState({
            showEmoji:false,
            iconEmoji:'emoji-neutral'
        })
    }

    render() {
        let feeds = this.props.feeds['groups'+this.props.navigation.state.params.group._id];
        if(!feeds){
            feeds = [];
        }

        let showTop = this.props.feeds['showTopLoader'+this.props.navigation.state.params.group._id];
        if(!showTop){
            showTop = false;
        }
        return (
        <Container>

            <View style={styles.headerTabContainer}>
                <View style={styles.headerTabInnerContainer}>
                <View style={styles.promotionTab}>
                    <Text style={styles.group_promotion_text}>Promotions</Text>
                </View>
                    <View style={styles.chatTab}>
                        <Text style={styles.group_chat_text}>Chat</Text>
                    </View>
                </View>

            </View>
            <GenericFeedManager loadingDone = {this.props.feeds['grouploadingDone' + this.props.navigation.state.params.group._id]} showTopTimer={showTop} feeds={feeds} api={this} title='Feeds' ItemDetail={GenericFeedItem}></GenericFeedManager>

            <View style={styles.itemborder}>
                <View style={ {backgroundColor:'white',  flexDirection: 'row'}}>
                    <Button   onPress={() => this._onPressButton()} style={styles.icon} transparent>

                        <Icon style={{fontSize:35,color:"#2db6c8"}} name='send' />
                    </Button>
                    <Input value={this.state.messsage}  onFocus={this.hideEmoji.bind(this)} blurOnSubmit={true} returnKeyType='done' ref="3"   onChangeText={(messsage) => this.setState({messsage})} placeholder='write text' />



                    <Button   onPress={() => this.showEmoji()} style={styles.icon} transparent>

                        <Icon2 style={{fontSize:35,color:"#2db6c8"}} name={this.state.iconEmoji} />
                    </Button>

                </View>

            </View>
            <EmojiPicker stylw={{height:100}}visible={this.state.showEmoji}  onEmojiSelected={this.handlePick} />


        </Container>



        );
    }

}

export default connect(
    state => ({
        feeds: state.feeds
    }),
    dispatch => bindActionCreators(feedsAction, dispatch)
)(GroupFeed);



