import React, {Component} from "react";
import {
    Image,
    Keyboard,
    KeyboardAvoidingView,
    KeyboardAwareScrollView,
    Platform,
    TextInput,
    TouchableNativeFeedback,
    TouchableOpacity,
    View
} from "react-native";
import {connect} from "react-redux";
import {actions} from "react-native-navigation-redux-helpers";
import GroupFeedHeader from "./groupFeedHeader";
import CommentsComponenet from "./commentsComponent";
import styles from "./styles";
import {bindActionCreators} from "redux";
import * as commentAction from "../../../actions/comments";

class Comments extends Component {
    static navigationOptions = ({navigation}) => ({
        header: <GroupFeedHeader navigation={navigation} item={navigation.state.params.group}/>
    });

    constructor(props) {
        super(props);
    }

    render() {
        return <View style={styles.inputContainer}>


            <CommentsComponenet navigation={this.props.navigation}
                                instance={this.props.navigation.state.params.instance}
                                group={this.props.navigation.state.params.group}
                                showComments={true}/>
        </View>
    }
}

export default connect(
    state => ({
        comments: state.comments
    }),
    dispatch => bindActionCreators(commentAction, dispatch)
)(Comments);



