import React, {Component} from 'react';
import {
    Image,
    TextInput,
    Platform,
    View,
    Keyboard,
    TouchableNativeFeedback,
    TouchableOpacity,
    KeyboardAvoidingView
} from 'react-native';
import {connect} from 'react-redux';
import {actions} from 'react-native-navigation-redux-helpers';
import {Container, Footer, Icon, Button, Text, Input, Thumbnail} from 'native-base';
import CommentsComponenet from './commentsComponent';
import styles from './styles'
import CommentApi from '../../api/commet'

let commentApi = new CommentApi();
import {bindActionCreators} from "redux";
import * as commentAction from "../../actions/comments";
import EmojiPicker from 'react-native-emoji-picker-panel'

class GenericComments extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return <View behavior={'position'} style={styles.inputContainer}>


            <CommentsComponenet navigation={this.props.navigation}
                                instance={this.props.navigation.state.params.instance}
                                entities={this.props.navigation.state.params.entities}
                                generalId={this.props.navigation.state.params.generalId}
                                showComments={true}/>
        </View>
    }
}

export default connect(
    state => ({
        comments: state.comments
    }),
    dispatch => bindActionCreators(commentAction, dispatch)
)(GenericComments);



