import React, {Component} from "react";
import {Dimensions, View} from "react-native";
import {connect} from "react-redux";
import {actions} from "react-native-navigation-redux-helpers";
import {Button, Icon, Input, Thumbnail} from "native-base";
import GenericFeedManager from "../../generic-feed-manager/index";
import styles from "./styles";
import {bindActionCreators} from "redux";
import * as instanceGroupComments from "../../../actions/instanceGroupComments";
import {getFeeds} from "../../../selectors/commentInstancesSelector";
import {ChatMessage, MessageBox, PromotionHeader} from '../../../ui/index';
import StyleUtils from "../../../utils/styleUtils";

const {width} = Dimensions.get('window')

class CommentsComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            messsage: '',
        };
    }

    componentWillMount() {
        const item = this.getInstance();
        const {group, actions} = this.props;
        actions.setNextFeeds(group, item);
        actions.startListenForChat(group, item);
    }

    getInstance() {
        if (this.props.instance) {
            return this.props.instance;
        }
        if (this.props.navigation.state.params.instance) {
            return this.props.navigation.state.params.instance;
        }
        return this.props.item;
    }

    _onPressButton(message) {
        const item = this.getInstance();
        const {group, actions} = this.props;
        if (group && message) {
            actions.sendMessage(group._id, item.id, message);
        }
    }

    getBusiness(item) {
        if (item.business) {
            return item.business
        }
        return item;
    }

    render() {
        const item = this.getInstance();
        let promotionHeader;
        if (item.promotion) {
            promotionHeader = <View style={[styles.comments_promotions, {width: StyleUtils.getWidth() - 15}]}>
                <PromotionHeader item={item} type={item.promotion} feed titleText={item.promotionTitle}
                                 titleValue={item.promotionValue} term={item.promotionTerm}/>


            </View>;
        }
        const commentsView = this.createCommentView(true, item);
        return (
            <View style={{
                width: StyleUtils.getWidth(),

                marginBottom: 5,
                backgroundColor: '#E6E6E6',
                alignItems: 'center',
                justifyContent: 'center',
                flex: 1,
            }}>
                {promotionHeader}
                <View style={{flex: 9}}>

                    <View style={{flex: 10}}>
                        {commentsView}
                    </View>
                    <View>
                        <MessageBox onPress={this._onPressButton.bind(this)}/>
                    </View>
                </View>
            </View>



        );
    }

    nextCommentPage() {
        const item = this.getInstance();
        const {actions, group, feeds} = this.props;
        actions.setNextFeeds(group, item)
    }

    createCommentView(showComment, item) {
        const {navigation, feeds, userFollower, actions, token, loadingDone, showTopLoader, group, user} = this.props;
        if (!feeds[group._id]) {
            return <View></View>
        }
        if (showComment) {
            return <GenericFeedManager
                navigation={navigation}
                color='white'
                loadingDone={loadingDone[group._id][item.id]}
                showTopLoader={false}
                userFollowers={userFollower}
                feeds={feeds[group._id][item.id]}
                setNextFeeds={this.nextCommentPage.bind(this)}
                actions={actions}
                token={token}
                group={group}
                title='Feeds'
                ItemDetail={this.renderItem.bind(this)}>

            </GenericFeedManager>
        }
        return undefined;
    }

    renderItem(renderItem) {
        const {user} = this.props;
        if (!user) {
            return <View></View>
        }
        let item = renderItem.item;
        let isUser = item.actor === user._id;
        let messageItem = {
            name: item.name,
            avetar: item.logo,
            message: item.description,
            date: item.date,
            isUser: isUser
        };
        return <ChatMessage key={item.id}
                            item={messageItem}/>
    }

    async fetchTopList(id) {
        const item = this.getInstance();
        const {token, feeds, group, actions} = this.props;
        if (id === feeds[group._id][item.id][0].fid) {
            actions.fetchTop(feeds, token, item, group)
        }
    }
}

export default connect(
    state => ({
        token: state.authentication.token,
        userFollower: state.user.followers,
        feeds: getFeeds(state),
        user: state.user.user,
        showTopLoader: state.commentInstances.showTopLoader,
        loadingDone: state.commentInstances.groupLoadingDone,
    }),
    (dispatch) => ({
        actions: bindActionCreators(instanceGroupComments, dispatch)
    })
)(CommentsComponent);



