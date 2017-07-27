
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
import NestedScrollView from 'react-native-nested-scrollview';
let commentApi = new CommentApi();
import { bindActionCreators } from "redux";

import * as commentAction from "../../../actions/comments";

import EmojiPicker from 'react-native-emoji-picker-panel'
class AndroidCommentsComponent extends Component {

    constructor(props) {
        super(props);
        let showComment = false;
        if (props.showComments) {
            showComment = true;
        }
        this.state = {

            messsage: '',
            showComment: showComment,
            showEmoji: false,
            iconEmoji: 'emoji-neutral',
            componentHight: 400,

        };
        this.handlePick = this.handlePick.bind(this);
        this.fetchFeeds();
    }





    fetchFeeds(){

        this.props.fetchInstanceGroupComments(this.props.group._id,this.getInstance().id)

    }
    fetchTopList(id){
        this.props.fetchInstanceGroupComments(this.props.group._id,this.getInstance().id)
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

    _onPressButton(){
        commentApi.createComment(this.props.group._id, this.getInstance().id,this.state.messsage)

        this.setState({
            messsage:'',
        })
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

        let feeds = this.props.comments['comment'+this.props.group._id+ this.getInstance().id];
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
                height:420,backgroundColor:'#ebebeb'
            }
            arrowIcon = "chevron-small-up";

            commentsView = this.createAndroidScroller(feeds)

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


    createAndroidScroller(feeds){

        let body = feeds.map(feed => this.createComponent(feed))
        return <NestedScrollView style={{height:300}}>{body}</NestedScrollView>


    }

    createComponent(feed){
       return  <GenericFeedItem key={feed.id} userFollowers={this.props.userFollowers} group = {this.props.group}navigation={this.props.navigation} item={feed} selectApi={this}  />

    }

}

export default connect(
    state => ({
        comments: state.comments
    }),
    dispatch => bindActionCreators(commentAction, dispatch)
)(AndroidCommentsComponent);



