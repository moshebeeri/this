import React, {Component} from "react";
import {Dimensions, Text, View} from "react-native";
import {connect} from "react-redux";
import {actions} from "react-native-navigation-redux-helpers";
import GenericFeedManager from "../../generic-feed-manager/index";
import {getFeeds} from "../../../selectors/commentsSelector";
import {bindActionCreators} from "redux";
import * as commentAction from "../../../actions/commentsGroup";
import {MessageBox,ChatPreviewPromotion} from '../../../ui/index';
import {Thumbnail} from 'native-base';
import GroupChat from './groupChat';
import * as groupAction from "../../../actions/groups";
import * as instanceGroupComments from "../../../actions/instanceGroupComments";
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
        const {group, actions,instance,instanceGroupActions} = this.props;
        if(instance){
            this.props.groupActions.clearReplyInstance();
            instanceGroupActions.sendMessage(group._id, instance.id, message);
        }else {
            actions.sendMessage(group._id, message)
        }
    }

    cancelReply(){
        this.props.groupActions.clearReplyInstance();
    }
    renderItem(renderItem) {
        const {user,navigation,groupActions} = this.props;
        return <GroupChat actions={groupActions} navigation={navigation} key={renderItem.item.id} renderItem={renderItem} user={user}/>
    }n

    render() {
        const {group, instance,comments, navigation, actions, update, loadingDone, showTopLoader, allState} = this.props;
        return <View style={{flex: 1}}>
            <View style={{flex: 1}}>
                <GenericFeedManager feeds={comments[group._id]}
                                    scrolToEnd
                                    entity={group}
                                    initialNumToRender={7}
                                    chat
                                    navigation={navigation}
                                    setNextFeeds={this.setNextFeed.bind(this)}
                                    actions={actions}
                                    update={update}
                                    showTopLoader={showTopLoader[group._id]}
                                    loadingDone={loadingDone[group._id]}
                                    ItemDetail={this.renderItem.bind(this)}/>
            </View>

            <View>

            </View>
            <View style={{marginTop:10}}>
                {instance && instance.feed && instance.feed.activity  && instance.feed.activity.post && <ChatPreviewPromotion  isPost cancelReply={this.cancelReply.bind(this)} title={instance.feed.activity.post.creator.name} text={instance.feed.activity.post.text}/>}

                {instance  && instance.promotionTerm &&  <ChatPreviewPromotion  cancelReply={this.cancelReply.bind(this)}  title={instance.businessName}  text={instance.promotionTerm}/>}
                <MessageBox onPress={this._onPressButton.bind(this)}/>
            </View>
        </View>
    }
}

export default connect(
    state => ({
        comments: getFeeds(state),
        loadingDone: state.comments.loadingDone,
        instance: state.comments.replyInstance,
        showTopLoader: state.comments.showTopLoader,
        update: state.comments.update,
        user: state.user.user,
    }),
    (dispatch) => ({
        actions: bindActionCreators(commentAction, dispatch),
        groupActions: bindActionCreators(groupAction, dispatch),
        instanceGroupActions: bindActionCreators(instanceGroupComments, dispatch)
    })
)(instancesComment);



