import React, {Component} from "react";
import {actions} from "react-native-navigation-redux-helpers";
import GenericFeedManager from "../generic-feed-manager/index";
import GenericFeedItem from "../generic-feed-manager/generic-feed";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import * as feedsAction from "../../actions/feedsMain";
import {getFeeds} from "../../selectors/feedSelector";
import * as userAction from "../../actions/user";
import {createSelector} from "reselect";

class Feed extends Component {
    constructor(props) {
        super(props);
    }

    componentWillMount() {
        const {feeds, actions, feedState} = this.props;
        if (feedState.firstTime) {
            actions.setNextFeeds(feeds);
            this.props.userActions.fetchUsersFollowers();
        }
    }

    render() {
        const {navigation, feedState, feeds, userFollower, actions, token, user, location} = this.props;
        return (
            <GenericFeedManager
                navigation={navigation}

                loadingDone={feedState.loadingDone}
                showTopLoader={feedState.showTopLoader}
                userFollowers={userFollower}
                feeds={feeds}
                actions={actions}
                token={token}
                entity={user}
                location={location}
                title='Feeds'
                ItemDetail={GenericFeedItem}>

            </GenericFeedManager>

        );
    }
}

const mapStateToProps = state => {
    return {
        feedState: state.feeds,
        token: state.authentication.token,
        userFollower: state.user.followers,
        user: state.user.user,
        feeds: getFeeds(state),
        promoptions: state.promotions,
        location: state.phone.currentLocation
    }
}
export default connect(
    mapStateToProps,
    (dispatch) => ({
        actions: bindActionCreators(feedsAction, dispatch),
        userActions: bindActionCreators(userAction, dispatch)
    })
)(Feed);


