import React, {Component} from 'react';
import {actions} from 'react-native-navigation-redux-helpers';
import {
    Button,
    Card,
    CardItem,
    Container,
    Content,
    Footer,
    Header,
    Input,
    InputGroup,
    Item,
    Left,
    Picker,
    Right,
    Thumbnail,
    View
} from 'native-base';
import FeedMessage from './feed-components/feedMessage'
import FeedPromotion from './feed-components/feedPromotion'
import FeedShared from './feed-components/feedShared'
import FeedBusiness from './feed-components/feedBusiness'
import FeedWelcome from './feed-components/feedWelcome'
import FeedPost from './feed-components/feedPost'

export default class GenericFeedItem extends Component {
    constructor(props) {
        super(props);
    }

    async componentWillMount() {
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

    commentShare() {
        if (this.props.group) {
            this.props.navigation.navigate('InstanceGroupComments', {
                group: this.props.group,
                instance: this.props.item.shardeActivity,
            })
            return;
        }
        this.props.navigation.navigate('genericComments', {
            instance: this.props.item.shardeActivity,
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
        const {item, actions, token, location, showActions, visibleItem,realize,visibleFeeds} = this.props;
        const showUsers = this.showUsers.bind(this);
        const comment = this.comment.bind(this);
        switch (item.itemType) {
            case 'EMPTY':
                return this.createFeedView(undefined);
            case 'PROMOTION':

                if(realize){
                    let isRealized = this.checkIfRealized(item);
                    return this.createFeedView(<FeedPromotion showActions={showActions} refresh={actions.refresh}
                                                              isRealized={isRealized}
                                                              visibleFeeds={visibleFeeds}
                                                              realize={realize}
                                                              token={token} comment={comment}
                                                              location={location} actions={actions}
                                                              visibleItem={visibleItem}
                                                              navigation={this.props.navigation} item={item}
                                                              like={actions.like} unlike={actions.unlike}
                                                              showUsers={showUsers} save={actions.saveFeed}/>)

                }
                return this.createFeedView(<FeedPromotion showActions={showActions} refresh={actions.refresh}
                                                          token={token} comment={comment}
                                                          location={location} actions={actions}
                                                          visibleItem={visibleItem}
                                                          visibleFeeds={visibleFeeds}
                                                          navigation={this.props.navigation} item={item}
                                                          like={actions.like} unlike={actions.unlike}
                                                          showUsers={showUsers} save={actions.saveFeed}/>)
            case 'SHARE':
                return this.createFeedView(<FeedShared showActions={showActions} visibleItem={visibleItem}
                                                       actions={actions} refresh={actions.refresh} token={token}
                                                       comment={this.commentShare.bind(this)}
                                                       location={location}
                                                       visibleFeeds={visibleFeeds}
                                                       navigation={this.props.navigation} item={item}
                                                       like={actions.like} unlike={actions.unlike}
                                                       showUsers={showUsers}/>)
            case 'MESSAGE':
                return this.createFeedView(<FeedMessage token={token} navigation={this.props.navigation} item={item}/>)
            case'POST':
                return this.createFeedView(<FeedPost visibleItem={visibleItem} showActions={showActions} token={token}
                                                     navigation={this.props.navigation} item={item} like={actions.like}
                                                     unlike={actions.unlike}
                                                     visibleFeeds={visibleFeeds}
                                                     showUsers={showUsers} actions={actions} comment={comment}/>)
            case 'WELCOME':
                return this.createFeedView(<FeedWelcome token={token} navigation={this.props.navigation} item={item}/>)
            default:
                return this.createFeedView(<FeedBusiness visibleItem={visibleItem} actions={actions}
                                                         showActions={showActions} location={location} token={token}
                                                         refresh={actions.refresh}
                                                         visibleFeeds={visibleFeeds}
                                                         navigation={this.props.navigation} item={item}
                                                         comment={comment} like={actions.like} unlike={actions.unlike}
                                                         showUsers={showUsers} save={actions.saveFeed}
                                                         _panResponder={this._panResponder}/>)
        }
    }

    createFeedView(item) {
        if (item) {
            return <View key={this.props.item.id}
                         style={{backgroundColor: '#cccccc'}}  >
                {item}
            </View>
        }
        return <View></View>
    }

    checkIfRealized(feed) {
        let savedinstance = feed;
        if (feed.savedInstance) {
            savedinstance = feed.savedInstance;
        }
        if (savedinstance.savedData && savedinstance.savedData && savedinstance.savedData.other) {
            return true;
        }
        if (savedinstance.savedData && savedinstance.savedData.punch_card && savedinstance.savedData.punch_card.number_of_punches) {
            let remainPunches = savedinstance.savedData.punch_card.number_of_punches - savedinstance.savedData.punch_card.redeemTimes.length;
            return remainPunches === 0;
        }
        return false;
    }
}


