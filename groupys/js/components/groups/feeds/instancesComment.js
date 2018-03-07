import React, {Component} from "react";
import {Dimensions, Text, View} from "react-native";
import {connect} from "react-redux";
import {actions} from "react-native-navigation-redux-helpers";
import GenericFeedManager from "../../generic-feed-manager/index";
import {getFeeds} from "../../../selectors/commentsSelector";
import {bindActionCreators} from "redux";
import * as commentAction from "../../../actions/commentsGroup";
import {MessageBox} from '../../../ui/index';
import {Thumbnail} from 'native-base';
import GroupChat from './groupChat';
const {width, height} = Dimensions.get('window')
const vw = width / 100;
const vh = height / 100

class instancesComment extends Component {
    constructor(props) {
        super(props);
    }

    componentWillMount() {
        const {comments, group, actions} = this.props;
        if (!comments[group._id] || (comments[group._id] && comments[group._id].length === 0)) {
            actions.setNextFeeds(group);
        }
    }

    setNextFeed() {
        const {group, actions} = this.props;
        actions.setNextFeeds(group);
    }

    _onPressButton(message) {
        const {group, actions} = this.props;
        actions.sendMessage(group._id, message)
    }

    renderItem(renderItem) {
        const {user} = this.props;
        return <GroupChat key={renderItem.item.id} renderItem={renderItem} user={user}/>
    }

    render() {
        const {group, comments, navigation, actions, update, loadingDone, showTopLoader, allState} = this.props;
        return <View style={{flex: 1}}>
            <View style={{flex: 1}}>
                <GenericFeedManager feeds={comments[group._id]}
                                    scrolToEnd
                                    entity={group}
                                    initialNumToRender={7}
                                    navigation={navigation}
                                    setNextFeeds={this.setNextFeed.bind(this)}
                                    actions={actions}
                                    update={update}
                                    showTopLoader={showTopLoader[group._id]}
                                    loadingDone={loadingDone[group._id]}
                                    ItemDetail={this.renderItem.bind(this)}/>
            </View>

            <View style={{marginTop:10}}>
                <MessageBox onPress={this._onPressButton.bind(this)}/>
            </View>
        </View>
    }
}

export default connect(
    state => ({
        comments: getFeeds(state),
        loadingDone: state.comments.loadingDone,
        showTopLoader: state.comments.showTopLoader,
        update: state.comments.update,
        user: state.user.user,
    }),
    (dispatch) => ({
        actions: bindActionCreators(commentAction, dispatch)
    })
)(instancesComment);



