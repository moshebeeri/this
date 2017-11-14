import React, {Component} from 'react';
import {Image, Platform, PanResponder, TouchableHighlight} from 'react-native';
import {connect} from 'react-redux';
import {actions} from 'react-native-navigation-redux-helpers';
import {
    Container,
    Content,
    Text,
    InputGroup,
    Input,
    Thumbnail,
    Button,
    Picker,
    Right,
    Item,
    Left,
    Header,
    Footer,
    Body,
    View,
    Card,
    CardItem
} from 'native-base';
import FeedMessage from './feed-components/feedMessage'
import FeedPromotion from './feed-components/feedPromotion'
import FeedBusiness from './feed-components/feedBusiness'
import FeedWelcome from './feed-components/feedWelcome'

export default class GenericFeedItem extends Component {
    constructor(props) {
        super(props);
    }

    async componentWillMount() {
        const getDirectionAndColor = ({moveX, moveY, dx, dy}) => {
            const height = dx;
            const width = dy;
            const draggedDown = dy > 30;
            const draggedUp = dy < -30;
            const draggedLeft = dx < -30;
            const draggedRight = dx > 30;
            const isRed = moveY < 90 && moveY > 40 && moveX > 0 && moveX < width;
            const isBlue = moveY > (height - 50) && moveX > 0 && moveX < width;
            let dragDirection = '';
            if (draggedDown || draggedUp) {
                if (draggedDown) dragDirection += 'dragged down '
                if (draggedUp) dragDirection += 'dragged up ';
            }
            if (draggedLeft || draggedRight) {
                if (draggedLeft) dragDirection += 'dragged left '
                if (draggedRight) dragDirection += 'dragged right ';
            }
            if (isRed) return `red ${dragDirection}`
            if (isBlue) return `blue ${dragDirection}`
            if (dragDirection) return dragDirection;
        }
        this._panResponder = PanResponder.create({
            onMoveShouldSetPanResponder: (evt, gestureState) => this.onMove(evt, gestureState),
        });
    }

    showUsers(show) {
        let users = this.props.userFollowers;
        if (users) {
            this.props.navigation.navigate('SelectUsersComponent', {
                users: users,
                selectUsers: this.selectUsers.bind(this)
            })
        }
    }

    comment() {
        if (this.props.group) {
            this.props.navigation.navigate('InstanceGroupComments', {
                group: this.props.group,
                instance: this.props.item,
            })
            return;
        }
        this.props.navigation.navigate('genericComments', {
            instance: this.props.item,
            generalId: this.props.item.generalId,
            entities: this.props.item.entities,
        })
    }

    selectUsers(users) {
        let activityId = this.props.item.social.activityId;
        this.props.actions.shareActivity(this.props.item.id, activityId, users, this.props.token)
    }

    onMove(evt, gestureState) {
        if (gestureState.moveY < 300) {
            this.props.fetchTopList(this.props.item.fid, this.props.token, this.props.user)
        }
        return false;
    }

    render() {
        const {item, actions, token,location} = this.props;
        const showUsers = this.showUsers.bind(this);
        const comment = this.comment.bind(this);
        switch (item.itemType) {
            case 'PROMOTION':
                return this.createFeedView(<FeedPromotion token={token} comment={comment}  location={location}
                                                          navigation={this.props.navigation} item={item}
                                                          like={actions.like} unlike={actions.unlike}
                                                          showUsers={showUsers} save={actions.saveFeed}/>)
            case 'MESSAGE':
                return this.createFeedView(<FeedMessage token={token} navigation={this.props.navigation} item={item}/>)
            case 'WELCOME':
                return this.createFeedView(<FeedWelcome token={token} navigation={this.props.navigation} item={item}/>)
            default:
                return this.createFeedView(<FeedBusiness location={location} token={token} navigation={this.props.navigation} item={item}
                                                         comment={comment} like={actions.like} unlike={actions.unlike}
                                                         showUsers={showUsers} save={actions.saveFeed}
                                                         _panResponder={this._panResponder}/>)
        }
    }

    createFeedView(item) {
        if (item) {
            return <View  {...this._panResponder.panHandlers} >
                {item}
            </View>
        }
        return <View></View>
    }
}


