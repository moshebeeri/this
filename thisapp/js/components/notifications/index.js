import React, {Component} from 'react';
import {connect} from 'react-redux';
import {actions} from 'react-native-navigation-redux-helpers';
import {
    Button,
    Container,
    Content,
    Fab,
    Header,
    Input,
    InputGroup,
    Left,
    ListItem,
    Right,
    Thumbnail,
    Title,
    View
} from 'native-base';
import NotificationListView from './list-view/index'
import GenericListManager from '../generic-list-manager/index'
import * as notificationAction from "../../actions/notifications";
import * as groupActions from "../../actions/groups";
import {getNotification} from '../../selectors/notificationSelector'
import {bindActionCreators} from "redux";

class Notification extends Component {
    constructor(props) {
        super(props);
    }


    componentWillMount(){
        const{rows} = this.props;
        if(!rows || (rows && rows.length === 0)){
            this.props.actions.setTopNotification();
        }


    }

    shouldComponentUpdate() {
        return this.props.isMain;
    }

    render() {
        const {notification, navigation, actions,rows,update,groupActions} = this.props;
        return (
            <View style={{flex: 1}}>


                <GenericListManager navigation={navigation} rows={rows} groupActions={groupActions} actions={actions}
                                    update={update} ItemDetail={NotificationListView}/>
            </View>


        );
    }
}

export default connect(
    state => ({
        rows: getNotification(state),
        notification: state.notification,
        update: state.notification.update,
        isMain: state.render.isMain,

    }),
    (dispatch) => ({
        actions: bindActionCreators(notificationAction, dispatch),
        groupActions: bindActionCreators(groupActions, dispatch)
    })
)(Notification);
