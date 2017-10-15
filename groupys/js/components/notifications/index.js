import React, {Component} from 'react';
import {Image, Platform} from 'react-native';
import {connect} from 'react-redux';
import {actions} from 'react-native-navigation-redux-helpers';
import {
    Container,
    Content,
    Fab,
    Text,
    Title,
    InputGroup,
    Input,
    Button,
    View,
    Header,
    Body,
    Right,
    ListItem,
    Thumbnail,
    Left
} from 'native-base';
import NotificationListView from './list-view/index'
import GenericListManager from '../generic-list-manager/index'
import * as notificationAction from "../../actions/notifications";
import * as groupActions from "../../actions/groups";
import {bindActionCreators} from "redux";

class Notification extends Component {
    constructor(props) {
        super(props);
    }

    componentWillMount() {
        const {actions} = this.props;
        actions.onEndReached();
    }

    renderItem(item) {
        const {groupActions, actions,navigation} = this.props;
        return <NotificationListView navigation={navigation} item={item} actions={actions} groupActions={groupActions}/>
    }

    render() {
        const {notification, navigation, actions} = this.props;
        return (
            <GenericListManager navigation={navigation} rows={notification.notification} actions={actions}
                                update={notification.update} ItemDetail={this.renderItem.bind(this)}/>


        );
    }
}

export default connect(
    state => ({
        notification: state.notification
    }),
    (dispatch) => ({
        actions: bindActionCreators(notificationAction, dispatch),
        groupActions: bindActionCreators(groupActions, dispatch)
    })
)(Notification);
