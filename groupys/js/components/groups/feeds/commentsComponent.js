
import React, { Component } from 'react';
import { Image,TextInput, Dimensions,Platform,View,Keyboard,TouchableNativeFeedback,TouchableOpacity,KeyboardAvoidingView} from 'react-native';

import { connect } from 'react-redux';
import { actions } from 'react-native-navigation-redux-helpers';
import { Container,Footer,Icon,Button,Text,Input ,Thumbnail} from 'native-base';
import GroupFeedHeader from './groupFeedHeader'
const {width, height} = Dimensions.get('window')
const   vw = width/100;
const  vh = height/100
import GenericFeedManager from '../../generic-feed-manager/index'
import GenericFeedItem from '../../generic-feed-manager/generic-feed'
import styles from './styles'
import Icon2 from 'react-native-vector-icons/Entypo';
import CommentApi from '../../../api/commet'

import UiTools from '../../../api/feed-ui-converter'
let uiTools = new UiTools();
let commentApi = new CommentApi();
import { bindActionCreators } from "redux";

import * as commentGroupAction from "../../../actions/commentsGroup";
import { getFeeds } from '../../../selectors/commentInstancesSelector'
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

     }

    async addDirectMessage(message){
        let user = await store.get('user');
        let messageInstance = uiTools.createMessage(user,message);
        await this.props.updateInstanceEntityComments(this.props.group._id,this.getInstance().id,messageInstance)

    }



    componentWillMount(){
        const {comments,group,actions,item} = this.props;

        actions.setNextFeeds({},group,item);

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
        const item = this.getInstance();
        const promotion = this.getBannerComponent(item);
        const colorStyle = {

            color: item.promotionColor,

            fontFamily:'Roboto-Regular' ,marginLeft:10,marginTop:4,fontSize:16
        }


        const promotionType = <Text style={colorStyle}>{item.promotion}</Text>
        const showComment = this.state.showComment;
        const arrowIcon =  this.getArrowComponent(showComment);
        const commentsView = this.createCommentView(showComment);
        const showMessageInput = this.createMessageComponent(showComment);
        const showEmoji = this.createEmojiComponent(showComment,this.state.showEmoji);
        const style = this.createStyle(showComment);




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

    createStyle(showComment) {
        if(showComment){
            return {
                height:vh*77,backgroundColor:'#ebebeb'
            }
        }

        return  {
            height: vh * 15, backgroundColor: '#ebebeb'
        };
    }

    createEmojiComponent(showComment,showEmoji) {
        if(showComment){
            return   <EmojiPicker stylw={{height:100}}visible={showEmoji}  onEmojiSelected={this.handlePick} />

        }

        return undefined;
    }

    createMessageComponent(showComment) {
        if(showComment){
            return <View style={styles.message_container}>
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
        }

        return undefined;
    }

    nextCommentPage(){
        const{actions,group,item}= this.props;
        actions.setNextFeeds(feeds[group._id][item.id],group,item)

    }

    createCommentView(showComment) {
        if(showComment){
            const { navigation,feeds,userFollower,actions,token,loadingDone,showTopLoader ,group,item} = this.props;


            return    <GenericFeedManager
                navigation={navigation}

                loadingDone = {loadingDone[group._id][item.id]}
                showTopLoader={false}
                userFollowers= {userFollower}
                feeds={feeds[group._id][item.id]}
                setNextFeeds={this.nextCommentPage.bind(this)}
                actions={actions}
                token={token}
                entity={item}
                title='Feeds'
                ItemDetail={GenericFeedItem}>

            </GenericFeedManager>

        }

        return undefined;
    }

    getArrowComponent(showComment) {
        if(showComment){
            return "chevron-small-up";

        }

        return "chevron-small-down";;
    }

    getBannerComponent(item) {

        if (item.banner) {
            return <Thumbnail square={true} size={50} source={{uri: item.banner.uri}}/>

        }
        return undefined;
    }

}

export default connect(
    state => ({
        token:state.authentication.token,
        userFollower:state.user.followers,
        feeds: getFeeds(state),
        showTopLoader:state.commentInstances.showTopLoader,
        loadingDone:state.commentInstances.groupLoadingDone,
    }),
    (dispatch) => ({
        actions: bindActionCreators(commentGroupAction, dispatch)
    })
)(CommentsComponent);



