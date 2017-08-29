
import React, { Component } from 'react';
import { Image,TextInput, Platform,View,Keyboard,TouchableNativeFeedback,TouchableOpacity,KeyboardAvoidingView} from 'react-native';

import { connect } from 'react-redux';
import { actions } from 'react-native-navigation-redux-helpers';
import { Container,Footer,Icon,Button,Text,Input ,Thumbnail} from 'native-base';
import GroupFeedHeader from './groupFeedHeader'

import GenericFeedManager from '../../generic-feed-manager/index'
import GenericFeedItem from '../../generic-feed-manager/generic-feed'
import styles from './styles'
import Icon2 from 'react-native-vector-icons/Entypo';
import CommentApi from '../../../api/commet'

import UiTools from '../../../api/feed-ui-converter'
let uiTools = new UiTools();
let commentApi = new CommentApi();
import { bindActionCreators } from "redux";

import * as commentAction from "../../../actions/comments";

import EmojiPicker from 'react-native-emoji-picker-panel'
import store from 'react-native-simple-store';
class CommentsComponent extends Component {

    constructor(props) {
        super(props);
        let showComment=false;
        if(props.showComments){
            showComment = true;
        }
        this.state = {

            messsage: '',
            showComment:showComment,
            showEmoji:false,
            iconEmoji:'emoji-neutral',
            componentHight:400,

        };
        this.handlePick = this.handlePick.bind(this);

        this.props.fetchStoreInstanceGroupComments(this.props.group._id,this.getInstance().id)
    }

    async addDirectMessage(message){
        let user = await store.get('user');
        let messageInstance = uiTools.createMessage(user,message);
        await this.props.updateInstanceEntityComments(this.props.group._id,this.getInstance().id,messageInstance)

    }

    fetchFeeds(){
        let item = this.getInstance();
        let feeds = this.props.comments['comment'+this.props.group._id+ item.id];
        if(!feeds){
            feeds = [];
        }
        this.props.fetchInstanceGroupComments(this.props.group._id,this.getInstance().id,feeds.length)

    }
    fetchTop(id){
        let item = this.getInstance();
        let feeds = this.props.comments['comment'+this.props.group._id+ item.id];
        if(!feeds){
            feeds = [];
        }
        this.props.fetchInstanceGroupComments(this.props.group._id,this.getInstance().id,feeds.length)
    }


    componentWillMount(){
        //     this.props.fetchInstanceGroupComments(this.props.navigation.state.params.group._id,this.props.navigation.state.params.instance.id)
    }



    async getAll(direction,id){
        //
        // let feed = await feedApi.getAll(direction,id,this.props.navigation.state.params.group._id);
        // return feed;
    }




    handlePick(emoji) {
        let message = this.state.messsage;
        this.fetchFeeds();
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
    hideEmoji(){
        this.setState({
            showEmoji:false,
            iconEmoji:'emoji-neutral'
        })
    }

    nextLoad(){

    }

    getInstance(){
        if(this.props.instance){
            return this.props.instance;
        }
        if(this.props.navigation.state.params.instance){
            return this.props.navigation.state.params.instance;
        }

        return this.props.item;
    }

   async _onPressButton(){
        let user = store.get('user');
       let item = this.getInstance();
       let feeds = this.props.comments['comment'+this.props.group._id+ item.id];
       if(!feeds){
           feeds = [];
       }
       let message = this.state.messsage;
       await this.addDirectMessage(message);

       this.setState({
           messsage:'',
       })
       commentApi.createComment(this.props.group._id, this.getInstance().id,message,feeds.length)



    }
    showComments(){
        let show = !this.state.showComment;
        this.setState({
            showComment:show
        })
    }
    render() {
        let item = this.getInstance();
        let promotion = undefined;
        if(item.banner){
            promotion =  <Thumbnail  square={true} size={50} source={{uri: item.banner.uri}} />

        }
        let promotionType = undefined;
        let colorStyle = {

            color: item.promotionColor,

            fontFamily:'Roboto-Regular' ,marginLeft:10,marginTop:4,fontSize:16
        }


        promotionType = <Text style={colorStyle}>{item.promotion}</Text>

        let feeds = this.props.comments['comment'+this.props.group._id+ item.id];
        if(!feeds){
            feeds = [];
        }

        let arrowIcon = "chevron-small-down";
        let commentsView = undefined;
        let showMessageInput = undefined;
        let showEmoji = undefined;
        let style = {
            height:90,backgroundColor:'#ebebeb'
        }
        if(this.state.showComment){
            style = {
                height:520,backgroundColor:'#ebebeb'
            }
            arrowIcon = "chevron-small-up";

            commentsView =
                <GenericFeedManager navigation={this.props.navigation} loadingDone = {this.props.comments['LoadingDone' + this.props.group._id]+ this.getInstance().id} showTopTimer={false} feeds={feeds} api={this} title='comments' ItemDetail={GenericFeedItem}></GenericFeedManager>

            showMessageInput =  <View behavior={'position'} style={styles.message_container}>
                <View style={ {backgroundColor:'white',  flexDirection: 'row'}}>
                    <Button   onPress={() => this._onPressButton()} style={styles.icon} transparent>

                        <Icon style={{fontSize:35,color:"#2db6c8"}} name='send' />
                    </Button>
                    <Input style={{width:300}} value={this.state.messsage}  onFocus={this.hideEmoji.bind(this)} blurOnSubmit={true} returnKeyType='done' ref="3"  onSubmitEditing={this._onPressButton.bind(this)} onChangeText={(messsage) => this.setState({messsage})} placeholder='write text' />


                    <Button   onPress={() => this.showEmoji()} style={styles.icon} transparent>

                        <Icon2 style={{fontSize:35,color:"#2db6c8"}} name={this.state.iconEmoji} />
                    </Button>

                </View>

            </View>

            showEmoji = <EmojiPicker stylw={{height:100}}visible={this.state.showEmoji}  onEmojiSelected={this.handlePick} />

        }




        return (
            <View style={style}>
                <View style={styles.comments_promotions}>
                    <View style={styles.comments_promotions}>
                        {promotion}
                    </View>
                    <View style={styles.comment_description_container}>
                        <Text style={styles.promotion_text_description}>{item.name}</Text>
                        {promotionType}
                        <Text style={styles.promotion_type}>{item.itemTitle}</Text>

                    </View>
                    <View style={styles.comment_colapse}>
                        <Button   onPress={() => this.showComments()} style={styles.icon} transparent>

                            <Icon2 style={{fontSize:35,color:"#dadada"}} name={arrowIcon}/>
                        </Button>
                    </View>
                </View>
                {commentsView}
                {showMessageInput}
                {showEmoji}
            </View>



        );
    }

}

export default connect(
    state => ({
        comments: state.comments
    }),
    dispatch => bindActionCreators(commentAction, dispatch)
)(CommentsComponent);



