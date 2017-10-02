import React, {Component} from "react";
import {
    Image,
    TextInput,
    Dimensions,
    Platform,
    View,
    ListView,
    Keyboard,
    TouchableNativeFeedback,
    TouchableWithoutFeedback,
    ScrollView,
    TouchableOpacity,
    KeyboardAvoidingView
} from "react-native";
import {connect} from "react-redux";
import {actions} from "react-native-navigation-redux-helpers";
import GenericFeedManager from "../../generic-feed-manager/index";
import CommentsComponenet from "./commentsComponent";
import NestedScrollView from "react-native-nested-scrollview";
import {getFeeds} from "../../../selectors/commentsSelector";
import {bindActionCreators} from "redux";
import * as commentAction from "../../../actions/comments";
const {width, height} = Dimensions.get('window')
const vw = width / 100;
const vh = height / 100
class instancesComment extends Component {
    constructor(props) {
        super(props);
    }

    componentWillMount() {
        const {comments, group, actions} = this.props;
        actions.setNextFeeds(comments[group._id], undefined, group);
    }

    renderItem(item) {
        const {navigation, group} = this.props
        return <CommentsComponenet key={item.id} navigation={navigation} group={group} item={item} index={item.index}/>
    }

    render() {
        const {group, comments, navigation, actions, update, loadingDone, showTopLoader, allState} = this.props;
        if (Platform.OS == 'android') {
            if (comments[group._id]) {
                const body = comments[group._id].map(feed => this.renderItem(feed))
                return <NestedScrollView  >

                    {body}
                </NestedScrollView>
            } else {
                return <NestedScrollView  >


                </NestedScrollView>
            }
        }
        if (!comments[group._id]) {
            return <GenericFeedManager feeds={new Array()}
                                       entity={group}
                                       navigation={navigation}
                                       actions={actions}
                                       update={update}
                                       showTopLoader={showTopLoader[group._id]}
                                       loadingDone={loadingDone[group._id]}
                                       ItemDetail={this.renderItem.bind(this)}/>
        }
        return <GenericFeedManager feeds={comments[group._id]}
                                   entity={group}
                                   navigation={navigation}
                                   actions={actions}
                                   update={update}
                                   showTopLoader={showTopLoader[group._id]}
                                   loadingDone={loadingDone[group._id]}
                                   ItemDetail={this.renderItem.bind(this)}/>
    }
}
export default connect(
    state => ({
        comments: getFeeds(state),
        loadingDone: state.comments.loadingDone,
        showTopLoader: state.comments.showTopLoader,
        update: state.comments.update
    }),
    (dispatch) => ({
        actions: bindActionCreators(commentAction, dispatch)
    })
)(instancesComment);



