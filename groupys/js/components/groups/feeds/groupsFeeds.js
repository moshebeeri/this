import React, {Component} from "react";
import {Dimensions, View,Text} from "react-native";
import {connect} from "react-redux";
import {actions} from "react-native-navigation-redux-helpers";
import GenericFeedManager from "../../generic-feed-manager/index";
import {bindActionCreators} from "redux";
import * as groupAction from "../../../actions/groups";

import {getFeeds} from "../../../selectors/groupFeedsSelector";
import * as commentAction from "../../../actions/commentsGroup";
import styles from './styles'
import { Fab} from "native-base";
import GenericFeedItem from "../../generic-feed-manager/generic-feed";
import Icon2 from "react-native-vector-icons/Ionicons";
import {Thumbnail} from 'native-base';
const {width, height} = Dimensions.get('window')
const vw = width / 100;
const vh = height / 100
import strings from '../../../i18n/i18n';
class GroupFeedComponent extends Component {
    constructor(props) {
        super(props);
    }

    componentWillMount() {

    }

    allowPost(group) {
        switch (group.entity_type) {
            case 'USERS':
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
    navigateToAdd() {
        const group = this.props.navigation.state.params.group;
        this.props.navigation.navigate('PostForm', {group: group})
    }


    render() {
        const {navigation, group,feeds, userFollower, actions, token, loadingDone, location, showTopLoader,postUpdated} = this.props;

        const icon = <Icon2 active size={40} name="md-create"/>;
        return <View style={styles.inputContainer}>
            <GenericFeedManager
                navigation={navigation}

                loadingDone={loadingDone[group._id]}
                showTopLoader={showTopLoader[group._id]}
                userFollowers={userFollower}
                feeds={feeds[group._id]}
                actions={actions}
                token={token}
                entity={group}
                group={group}
                location={location}
                title='Feeds'
                ItemDetail={GenericFeedItem}>

            </GenericFeedManager>
            {this.allowPost(group) && <Fab

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
        location: state.phone.currentLocation
    }),
    (dispatch) => ({
        actions: bindActionCreators(groupAction, dispatch),
        commentGroupAction: bindActionCreators(commentAction, dispatch)
    })
)(GroupFeedComponent);



