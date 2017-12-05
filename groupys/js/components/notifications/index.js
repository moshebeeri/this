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
        const {groupActions, actions, navigation} = this.props;
        return <NotificationListView navigation={navigation} item={item} actions={actions} groupActions={groupActions}/>
    }

    render() {
        const {notification, navigation, actions} = this.props;
        return (
            <View style={{flex: 1}}>


                <GenericListManager navigation={navigation} rows={notification.notification} actions={actions}
                                    update={notification.update} ItemDetail={this.renderItem.bind(this)}/>
            </View>


        );
    }
}

/*
                   <YouTube
                    videoId="BY6VntTmtIo"   // The YouTube video ID
                    play={true}             // control playback of video with true/false
                    fullscreen={false}       // control whether the video should play in fullscreen or inline
                    loop={false}             // control whether the video should loop when ended
//
//                    onReady={e => this.setState({ isReady: true })}
//                    onChangeState={e => this.setState({ status: e.state })}
//                    onChangeQuality={e => this.setState({ quality: e.quality })}
//                    onError={e => this.setState({ error: e.error })}
//
style={{ alignSelf: 'stretch', height: 300 }}
/>
* */
export default connect(
    state => ({
        notification: state.notification
    }),
    (dispatch) => ({
        actions: bindActionCreators(notificationAction, dispatch),
        groupActions: bindActionCreators(groupActions, dispatch)
    })
)(Notification);
