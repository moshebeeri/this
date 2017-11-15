import React, {Component} from "react";
import {Dimensions, Platform, View} from "react-native";
import {connect} from "react-redux";
import {actions} from "react-native-navigation-redux-helpers";
import {Button, Icon, Input, Thumbnail} from "native-base";
import GenericFeedManager from "../generic-feed-manager/index";
import GenericFeedItem from "../generic-feed-manager/generic-feed";
import styles from "./styles";
import {bindActionCreators} from "redux";
import NestedScrollView from "react-native-nested-scrollview";
import * as commentEntitiesAction from "../../actions/commentsEntities";
import {getFeeds} from "../../selectors/commentsEntitiesSelector";
import {BusinessHeader, MessageBox, PromotionHeader} from '../../ui/index';

const {width, height} = Dimensions.get('window')
const vw = width / 100;
const vh = height / 100

class CommentsComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            messsage: '',
        };
    }

    componentWillMount() {
        const item = this.getInstance();
        const {navigation, actions} = this.props;
        actions.fetchTopComments(item.entities, item.generalId);
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
        if (message) {
            actions.sendMessage(item.entities, item.generalId, message);
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

        let promotionHeader ;
        if(item.promotion) {
             promotionHeader = <View style={styles.comments_promotions}>
                <PromotionHeader type={item.promotion} feed titleText={item.promotionTitle}
                                 titleValue={item.promotionValue} term={item.promotionTerm}/>


            </View>;
        }
        const commentsView = this.createCommentView(true, item);
        return (
            <View style={{
                width: width - 15,
                marginTop:5,
                marginBottom:5,
                 backgroundColor: 'white',
                flex:1,
            }}>
                {promotionHeader}
                <View style={{flex:9}}>

                    <View  style={{flex:10}}>
                    {commentsView}
                    </View>
                    <View >
                        <MessageBox onPress={this._onPressButton.bind(this)}/>
                    </View>
                </View>
            </View>



        );
    }

    nextCommentPage() {
        const item = this.getInstance();
        const {actions, group} = this.props;
        actions.setNextFeeds(feeds[item.generalId], item.entities, item.generalId)
    }

    createCommentView(showComment, item) {
        const {navigation, feeds, userFollower, actions, token, loadingDone, showTopLoader, group} = this.props;
        if (Platform.OS == 'android') {
            return this.createAndroidScroller(feeds[item.generalId], 30)
        }
        if (showComment) {
            return <GenericFeedManager
                navigation={navigation}

                loadingDone={loadingDone[group._id][item.id]}
                showTopLoader={false}
                userFollowers={userFollower}
                feeds={feeds[group._id][item.id]}
                setNextFeeds={this.nextCommentPage.bind(this)}
                actions={actions}
                token={token}
                entity={item}
                group={group}
                title='Feeds'
                ItemDetail={GenericFeedItem}>

            </GenericFeedManager>
        }
        return undefined;
    }

    createAndroidScroller(feeds, size) {
        if (feeds && feeds.length > 0) {
            let body = feeds.map(feed => this.renderItem(feed))
            return <NestedScrollView style={{height: vh * size}}>{body}</NestedScrollView>
        } else {
            return <NestedScrollView style={{height: vh * size}}></NestedScrollView>
        }
    }

    renderItem(item) {
        const {navigation, token, userFollowers, group, actions, entity} = this.props;
        return <GenericFeedItem
            key={item.id}
            user={entity}
            token={token}
            userFollowers={userFollowers}
            group={group}
            navigation={navigation}
            item={item}
            fetchTopList={this.fetchTopList.bind(this)}
            actions={actions}/>
    }

    async fetchTopList(id) {
        const item = this.getInstance();
        const {token, feeds, group, actions} = this.props;
        if (id == feeds[item.generalId][0].fid) {
            actions.fetchTop(feeds[item.generalId], token, item.entities, item.generalId)
        }
    }
}

export default connect(
    state => ({
        token: state.authentication.token,
        userFollower: state.user.followers,
        feeds: getFeeds(state),
        showTopLoader: state.commentInstances.showTopLoader,
        loadingDone: state.commentInstances.groupLoadingDone,
    }),
    (dispatch) => ({
        actions: bindActionCreators(commentEntitiesAction, dispatch)
    })
)(CommentsComponent);



