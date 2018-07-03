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
import navigationUtils from '../../utils/navigationUtils'
import getStore from "../../store";
import * as actionsConst from "../../reducers/reducerActions";
const reduxStore = getStore();
class Feed extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showFab: true,
            renderNow: true
        }
        navigator.geolocation.getCurrentPosition((position) => {
            reduxStore.dispatch({
                type: actionsConst.SET_LOCATION,
                currentLocation: {lat: position.coords.latitude, long: position.coords.longitude}
            });
        })
    }

    componentWillMount() {
        const {feeds, actions} = this.props;

        if (!feeds || feeds.length === 0) {
            actions.setNextFeeds(feeds);
        }else{
            actions.loadingFeedsDone();
        }
        this.props.userActions.fetchUsersFollowers();
    }

    //TODO: let roi know this is better then componentWillMount that will be deprected in nnext version
    // componentDidMount() {
    //     const {feeds, actions} = this.props;
    //     if (!feeds || feeds.length === 0) {
    //         actions.setNextFeeds(feeds);
    //     }
    //     this.props.userActions.fetchUsersFollowers();
    // }

    shouldComponentUpdate() {
        return this.props.updated;
    }


    componentDidUpdate(){
        this.props.actions.finishUpdate();
    }


    refreshTop() {
        //TODO: Do it with saga
        console.log('refreshing')
        this.setState({refreshing: true})
        this.props.actions.setTopFeeds();
        this.setState({refreshing: false})
    }

    componentWillUnmount() {
    }

    navigateToAdd() {
        navigationUtils.doNavigation(this.props.navigation, 'PostForm');
    }

    showFab(show) {
        this.setState({
            showFab: show
        })
    }

    realize(item) {
        navigationUtils.doNavigation(this.props.navigation, 'realizePromotion', {item: item});
    }

    render() {
        const {activityAction, navigation, loadingDone, showTopLoader, feeds, userFollower, actions, token, user, location, nextBulkLoad, visibleItem, visibleFeeds,shouldUpdateFeeds,phone} = this.props;
        let icon = <Icon2 active size={40} name="md-create"/>;
        return (
            <View style={{flex: 1, backgroundColor: '#cccccc'}}>

                <GenericFeedManager
                    navigation={navigation}
                    shouldUpdateFeeds={shouldUpdateFeeds}
                    visibleItem={visibleItem}
                    visibleFeeds={visibleFeeds}
                    loadingDone={loadingDone}
                    realize={this.realize.bind(this)}
                    showTopLoader={showTopLoader}
                    refreshing={this.state.refreshing}
                    onRefresh={this.refreshTop.bind(this)}
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
        shouldUpdateFeeds : state.feeds.shouldUpdateFeeds,
        location: state.phone.currentLocation,
        phone:  state.phone,
        visibleItem: state.feeds.visibleFeed,
        visibleFeeds: state.feeds.visibleFeeds,
        isMain: state.render.isMain,
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


