
import React, { Component } from 'react';
import { Image,TextInput, Platform,View,Keyboard,TouchableNativeFeedback,TouchableOpacity,KeyboardAvoidingView} from 'react-native';

import { connect } from 'react-redux';
import { actions } from 'react-native-navigation-redux-helpers';
import { Container,Footer,Icon,Button,Text,Input ,Thumbnail} from 'native-base';
import GroupFeedHeader from './groupFeedHeader'

import GenericFeedManager from '../../generic-feed-manager/index'
import GenericFeedItem from '../../generic-feed-manager/generic-feed'
import CommentsComponenet from './commentsComponent';

import styles from './styles'
import Icon2 from 'react-native-vector-icons/Entypo';
import CommentApi from '../../../api/commet'

let commentApi = new CommentApi();
import { bindActionCreators } from "redux";

import * as commentAction from "../../../actions/comments";

import EmojiPicker from 'react-native-emoji-picker-panel'
class Comments extends Component {
    static navigationOptions = ({ navigation }) => ({

        header:   <GroupFeedHeader navigation = {navigation} item={navigation.state.params.group}/>

    });
    constructor(props) {
        super(props);

    }






    render() {
        return    <KeyboardAvoidingView behavior={'position'} style={styles.inputContainer}>


        <CommentsComponenet navigation={this.props.navigation}
                                   instance={this.props.navigation.state.params.instance}
                                   group={this.props.navigation.state.params.group}/>
        </KeyboardAvoidingView>
    }

}

export default connect(
    state => ({
        comments: state.comments
    }),
    dispatch => bindActionCreators(commentAction, dispatch)
)(Comments);



