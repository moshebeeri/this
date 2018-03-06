import React, {Component} from "react";
import {actions} from "react-native-navigation-redux-helpers";
import GenericFeedManager from "../generic-feed-manager/index";
import GenericFeedItem from "../generic-feed-manager/generic-feed";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import * as feedsAction from "../../actions/feedsMain";
import {getFeeds} from "../../selectors/feedSelector";
import * as userAction from "../../actions/user";
import * as activityAction from "../../actions/activity";
import Icon2 from "react-native-vector-icons/Ionicons";
import {createSelector} from "reselect";
import {View} from 'react-native';
import {Fab,} from 'native-base';

var Analytics = require('react-native-firebase-analytics');

class Feed extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showFab: true,
            renderNow: true
        }
    }

    componentWillMount() {
        const {feeds, actions} = this.props;
        if (!feeds || feeds.length === 0) {
            actions.setNextFeeds(feeds);
        }
        this.props.userActions.fetchUsersFollowers();
    }

    shouldComponentUpdate() {
        if (this.props.currentScreen === 'home') {

            return true;
        }
        return false;
    }

    componentWillUnmount() {
    }

    navigateToAdd() {
        this.props.navigation.navigate('PostForm')
    }

    showFab(show) {
        this.setState({
            showFab: show
        })
    }

    render() {
        const {activityAction, navigation, loadingDone, showTopLoader, feeds, userFollower, actions, token, user, location, nextBulkLoad, visibleItem,visibleFeeds} = this.props;
        let icon = <Icon2 active size={40} name="md-create"/>;
        return (
            <View style={{flex: 1, backgroundColor: '#cccccc'}}>

                <GenericFeedManager
                    navigation={navigation}
                    visibleItem={visibleItem}
                    visibleFeeds={visibleFeeds}
                    loadingDone={loadingDone}
                    showTopLoader={showTopLoader}
                    userFollowers={userFollower}
                    feeds={feeds}
                    actions={actions}
                    token={token}
                    nextBulkLoad={nextBulkLoad}
                    entity={user}
                    location={location}
                    showFab={this.showFab.bind(this)}
                    activityAction={activityAction}
                    title='Feeds'
                    ItemDetail={GenericFeedItem}>

                </GenericFeedManager>
                {this.state.showFab && <Fab

                    direction="right"
                    active={false}
                    containerStyle={{marginLeft: 10}}
                    style={{backgroundColor: "#2db6c8"}}
                    position="bottomRight"
                    onPress={() => this.navigateToAdd()}>
                    {icon}

                </Fab>}
            </View>

        );
    }
}

const mapStateToProps = state => {
    return {
        loadingDone: state.feeds.loadingDone,
        shouldRender: state.feeds.shouldRender,
        firstTime: state.feeds.firstTime,
        updated: state.feeds.updated,
        renderFeed: state.feeds.renderFeed,
        nextBulkLoad: state.feeds.nextBulkLoad,
        token: state.authentication.token,
        showTopLoader: state.feeds.showTopLoader,
        userFollower: state.user.followers,
        user: state.user.user,
        feeds: getFeeds(state),
        location: state.phone.currentLocation,
        visibleItem: state.feeds.visibleFeed,
        visibleFeeds: state.feeds.visibleFeeds,
        selectedTab: state.mainTab.selectedTab,
        currentScreen: state.render.currentScreen,
    }
};
export default connect(
    mapStateToProps,
    (dispatch) => ({
        actions: bindActionCreators(feedsAction, dispatch),
        activityAction: bindActionCreators(activityAction, dispatch),
        userActions: bindActionCreators(userAction, dispatch)
    })
)(Feed);


