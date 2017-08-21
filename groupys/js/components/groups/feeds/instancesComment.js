
import React, { Component } from 'react';
import { Image,TextInput, Platform,View,ListView,Keyboard,TouchableNativeFeedback,TouchableWithoutFeedback,ScrollView,TouchableOpacity,KeyboardAvoidingView} from 'react-native';

import { connect } from 'react-redux';
import { actions } from 'react-native-navigation-redux-helpers';
import { Container,Footer,Icon,Button,Text,Input ,Thumbnail} from 'native-base';
import GroupFeedHeader from './groupFeedHeader'

import GenericFeedManager from '../../generic-feed-manager/index'
import GenericFeedItem from '../../generic-feed-manager/generic-feed'
import CommentsComponenet from './commentsComponent';
import AndroidCommentsComponenet from './andoridCommentsComponent';
import styles from './styles'
import Icon2 from 'react-native-vector-icons/Entypo';
import CommentApi from '../../../api/commet'
import NestedScrollView from 'react-native-nested-scrollview';


let commentApi = new CommentApi();
import { bindActionCreators } from "redux";

import * as commentAction from "../../../actions/comments";

import EmojiPicker from 'react-native-emoji-picker-panel'
class instancesComment extends Component {

    constructor(props) {
        super(props);


    }




    componentWillMount(){
        this.fetchFeeds();
    }
    fetchFeeds(){
        let groupid = this.props.group._id;
        this.props.fetchGroupComments(groupid);

    }
    fetchTop(id){
        let groupid = this.props.group._id;
        this.props.fetchGroupComments(groupid);
    }

    nextLoad(){

    }

    createComponent(feed){
        return <AndroidCommentsComponenet key={feed.id} navigation={this.props.navigation}
                            instance={feed}
                            group={this.props.group}/>


    }



    render() {
        let groupid = this.props.group._id;
        let feeds = this.props.comments['comment'+ groupid];
        if(feeds && feeds.length > 0) {
            feeds = feeds.sort(function (a, b) {
                let date1 = new Date( a.date);
                let date2 = new Date(b.date);
                return date1 - date2;

            })
        }
        let loadingDone = this.props.comments['LoadingDone' + groupid];

        if(loadingDone && feeds.length >0){
            if(Platform.OS == 'android'){
                let body = feeds.map(feed => this.createComponent(feed))

                return <NestedScrollView>
                    {body}
                </NestedScrollView>

            }

            return   <GenericFeedManager
                group ={this.props.group}
                navigation={this.props.navigation}
                loadingDone = {loadingDone}
                showTopTimer={false}
                feeds={feeds}
                api={this}
                title='comments'
                ItemDetail={CommentsComponenet}></GenericFeedManager>


        }
        return   <View style={styles.inputContainer}>


        </View>
    }

}

export default connect(
    state => ({
        comments: state.comments
    }),
    dispatch => bindActionCreators(commentAction, dispatch)
)(instancesComment);



