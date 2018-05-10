import React, {Component} from "react";
import {Dimensions, View} from "react-native";
import {connect} from "react-redux";
import {actions} from "react-native-navigation-redux-helpers";
import GenericFeedManager from "../../generic-feed-manager/index";
import {bindActionCreators} from "redux";
import * as groupAction from "../../../actions/groups";
import {getFeeds} from "../../../selectors/groupFeedsSelector";
import * as commentAction from "../../../actions/commentsGroup";
import * as activityAction from "../../../actions/activity";
import styles from './styles'
import {Fab, Thumbnail} from "native-base";
import GenericFeedItem from "../../generic-feed-manager/generic-feed";
import Icon2 from "react-native-vector-icons/Ionicons";
import navigationUtils from '../../../utils/navigationUtils'

class GroupFeedComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {showFab: true}
    }

    componentWillMount() {
        const group = this.props.navigation.state.params.group;
        if (group.entity && group.entity.business) {
            this.props.actions.setGroupFollowers(group._id, group.entity.business._id);
        } else {
            this.props.actions.setGroupFollowers(group._id);
        }
    }

    allowPost(group) {
        switch (group.entity_type) {
            case 'USER':
                return true;
            case 'BUSINESS':
                if (group.role && (group.role === "owner" || group.role === "OWNS" || group.role === "Admin" )) {
                    return true;
                }
                return false;
            default:
                return false;
        }
    }

    refreshTop() {
        const group = this.props.navigation.state.params.group;
        this.setState({refreshing: true});
        this.props.actions.setTopFeeds(group);
        this.setState({refreshing: false});
    }

    navigateToAdd() {
        const group = this.props.navigation.state.params.group;
        navigationUtils.doNavigation(this.props.navigation, 'PostForm', {group: group});
    }

    showFab(show) {
        this.setState({
            showFab: show
        })
    }

    realize(item) {
        navigationUtils.doNavigation(this.props.navigation, 'realizePromotion', {item: item})
    }

    render() {
        const {visibleFeeds, navigateToChat, navigation, activityAction, group, feeds, userFollower, actions, token, loadingDone, location, showTopLoader, postUpdateed,shouldUpdateFeeds} = this.props;
        const icon = <Icon2 active size={40} name="md-create"/>;
        return <View style={styles.inputContainer}>
            <GenericFeedManager
                navigation={navigation}
                shouldUpdateFeeds={shouldUpdateFeeds}
                realize={this.realize.bind(this)}
                visibleFeeds={visibleFeeds}
                loadingDone={loadingDone[group._id]}
                showTopLoader={showTopLoader[group._id]}
                userFollowers={userFollower}
                feeds={feeds[group._id]}
                navigateToChat={navigateToChat}
                actions={actions}
                token={token}
                entity={group}
                group={group}
                refreshing={this.state.refreshing}
                onRefresh={this.refreshTop.bind(this)}
                location={location}
                showFab={this.showFab.bind(this)}
                activityAction={activityAction}
                title='Feeds'
                ItemDetail={GenericFeedItem}>

            </GenericFeedManager>
            {this.allowPost(group) && this.state.showFab && <Fab

                direction="right"
                active={false}
                containerStyle={{marginLeft: 10}}
                style={{backgroundColor: "#2db6c8"}}
                position="bottomRight"
                onPress={() => this.navigateToAdd()}>
                {icon}

            </Fab>}

        </View>
    }
}

export default connect(
    state => ({
        token: state.authentication.token,
        userFollower: state.user.followers,
        feeds: getFeeds(state),
        showTopLoader: state.groups.showTopLoader,
        loadingDone: state.groups.loadingDone,
        postUpdated: state.postForm,
        location: state.phone.currentLocation,
        visibleFeeds: state.groups.visibleFeeds,
        shouldUpdateFeeds : state.feeds.shouldUpdateFeeds,
    }),
    (dispatch) => ({
        actions: bindActionCreators(groupAction, dispatch),
        activityAction: bindActionCreators(activityAction, dispatch),
        commentGroupAction: bindActionCreators(commentAction, dispatch)
    })
)(GroupFeedComponent);



