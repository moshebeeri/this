import React, {Component} from "react";
import {actions} from "react-native-navigation-redux-helpers";
import GenericFeedManager from "../generic-feed-manager/index";
import GenericFeedItem from "../generic-feed-manager/generic-feed";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import * as feedsAction from "../../actions/feedsMain";
import {getFeeds} from "../../selectors/feedSelector";
import * as userAction from "../../actions/user";
import Icon2 from "react-native-vector-icons/Ionicons";
import {createSelector} from "reselect";
import {View,I18nManager} from 'react-native';
import {Fab,} from 'native-base';

class Feed extends Component {
    constructor(props) {
        super(props);
    }

    componentWillMount() {
        const {feeds, actions, firstTime} = this.props;
        if (firstTime) {
            actions.setNextFeeds(feeds);
            this.props.userActions.fetchUsersFollowers();
        }
    }

    navigateToAdd() {
        this.props.navigation.navigate('PostForm')
    }

    render() {
        const {navigation, loadingDone, showTopLoader, feeds, userFollower, actions, token, user, location} = this.props;
        let icon = <Icon2 active size={40} name="md-create"/>;

        return (
            <View style={{flex: 1,backgroundColor:'red'}}>

                <GenericFeedManager
                    navigation={navigation}

                    loadingDone={loadingDone}
                    showTopLoader={showTopLoader}
                    userFollowers={userFollower}
                    feeds={feeds}
                    actions={actions}
                    token={token}
                    entity={user}
                    location={location}
                    title='Feeds'
                    ItemDetail={GenericFeedItem}>

                </GenericFeedManager>
                <Fab

                    direction="right"
                    active={false}
                    containerStyle={{marginLeft: 10}}
                    style={{backgroundColor: "#2db6c8"}}
                    position="bottomRight"
                    onPress={() => this.navigateToAdd()}>
                    {icon}

                </Fab>
            </View>

        );
    }
}

const mapStateToProps = state => {
    return {
        loadingDone:state.feeds.loadingDone,
        firstTime:state.feeds.firstTime,
        updated: state.feeds.updated,
        token: state.authentication.token,
        showTopLoader:state.feeds.showTopLoader,
        userFollower: state.user.followers,
        user: state.user.user,
        feeds: getFeeds(state),
        location: state.phone.currentLocation
    }
};

export default connect(
    mapStateToProps,
    (dispatch) => ({
        actions: bindActionCreators(feedsAction, dispatch),
        userActions: bindActionCreators(userAction, dispatch)
    })
)(Feed);


