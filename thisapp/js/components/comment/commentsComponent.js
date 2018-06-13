import React, {Component} from "react";
import {View} from "react-native";
import {connect} from "react-redux";
import {actions} from "react-native-navigation-redux-helpers";
import {Button, Icon, Input, Thumbnail} from "native-base";
import GenericFeedManager from "../generic-feed-manager/index";
import styles from "./styles";
import {bindActionCreators} from "redux";
import * as commentEntitiesAction from "../../actions/commentsEntities";
import {getFeeds} from "../../selectors/commentsEntitiesSelector";
import {ChatMessage, MessageBox, PromotionHeader} from '../../ui/index';
import StyleUtils from "../../utils/styleUtils";

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
        if (group) {
            actions.fetchTopComments(group, item);
        } else {
            actions.setNextFeeds(item.entities, item.generalId);

        }
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
        } else {
            if (message) {
                actions.sendMessage(item.entities, item.generalId, message);
            }
        }
    }

    render() {
        const item = this.getInstance();
        let promotionHeader;
        if (item.promotion) {
            promotionHeader =
                <View style={[styles.comments_promotions, {width: StyleUtils.getWidth()}]}>

                    <PromotionHeader item={item} type={item.promotion} feed titleText={item.promotionTitle}
                                     titleValue={item.promotionValue} term={item.promotionTerm}/>


                </View>;
        }
        const commentsView = this.createCommentView(true, item);
        return (
            <View style={{
                width: StyleUtils.getWidth(),
                marginBottom: 5,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#E6E6E6',
                flex:2,
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
        const {actions} = this.props;
        actions.setNextFeeds(item.entities, item.generalId)
    }

    createCommentView(showComment, item) {
        const {navigation, feeds, userFollower, actions, token, loadingDone} = this.props;
        if (showComment) {
            return <GenericFeedManager
                navigation={navigation}
                color='white'
                loadingDone={loadingDone[item.generalId]}
                showTopLoader={false}
                userFollowers={userFollower}
                feeds={feeds[item.generalId]}
                setNextFeeds={this.nextCommentPage.bind(this)}
                actions={actions}
                token={token}
                title='Feeds'
                noLegacy={true}
                ItemDetail={this.renderItem.bind(this)}>

            </GenericFeedManager>;
        }
        return undefined;
    }

    renderItem(renderItem) {
        let item = renderItem.item;
        const {user} = this.props;
        let isUser = item.actor === user._id;
        let messageItem = {
            name: item.name,
            id: item.id,
            avetar: item.logo,
            message: item.description,
            date: item.date,
            isUser: isUser
        };
        let showDelete = this.checkDeletePermissions()
        return <ChatMessage  showDelete={showDelete} key={item.id} deleteMessage={this.deleteMessage.bind(this)}
                            item={messageItem}/>
    }

    checkDeletePermissions(){
        const {user} = this.props;
        const instance = this.getInstance();
        if(instance.business){
            return instance.business.creator._id === user._id;
        }

        return false;
    }
    deleteMessage(messageItem){
        const instance = this.getInstance();
        if(instance.business){
            this.props.actions.deleteMessage(messageItem.id,instance.id,instance.business._id)
        }

    }
}

export default connect(
    state => ({
        token: state.authentication.token,
        userFollower: state.user.followers,
        user: state.user.user,
        feeds: getFeeds(state),
        showTopLoader: state.entityComments.showTopLoader,
        loadingDone: state.entityComments.loadingDone,
    }),
    (dispatch) => ({
        actions: bindActionCreators(commentEntitiesAction, dispatch)
    })
)(CommentsComponent);



