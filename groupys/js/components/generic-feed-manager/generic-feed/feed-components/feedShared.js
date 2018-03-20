/**
 * Created by roilandshut on 23/07/2017.
 */
import React, {Component} from 'react';
import {Dimensions} from 'react-native';
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
    Text,
    Thumbnail,
    View
} from 'native-base';
import FeedMessage from './feedMessage'
import FeedPromotion from './feedPromotion'
import FeedBusiness from './feedBusiness'
import FeedPost from './feedPost'
import strings from "../../../../i18n/i18n"
import StyleUtils from '../../../../utils/styleUtils'
import {ThisText} from '../../../../ui/index';

const {height} = Dimensions.get('window');
const vh = height / 100;
export default class FeedShared extends Component {
    constructor() {
        super();
    }

    render() {
        const {item,} = this.props;
        const container = this.createContainerStyle(item);
        return (<View style={container}>
                <View style={{
                    borderColor: '#cccccc',
                    width: StyleUtils.getWidth(),
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'flex-start',
                    backgroundColor: 'white'
                }}>
                    <ThisText style={{padding: 5, backgroundColor: 'white'}}>{item.user.name} {strings.Shared}</ThisText>
                </View>
                <View style={{flex: 10}}>
                    {this.createSharedActivity(item)}
                </View>
            </View>
        );
    }

    createContainerStyle(item) {

            return {
                flex: 1,
                width: StyleUtils.getWidth(),
                overflow: 'hidden',
                backgroundColor: 'white',
                alignItems: 'center',
                flexDirection: 'column',
                marginBottom:10,
            }

    }

    createSharedActivity(item) {
        const {refresh, like, unlike, actions,showUsers, comment, token, location, showActions,visibleFeeds,group} = this.props;
        switch (item.shared) {
            case 'PROMOTION':
                return this.createFeedView(<FeedPromotion shared refresh={refresh} token={token} comment={comment}
                                                          location={location}
                                                          visibleFeeds={visibleFeeds}
                                                          actions={actions}
                                                          showActions={showActions}
                                                          navigation={this.props.navigation} item={item.shardeActivity}
                                                          like={like} unlike={unlike}
                                                          group={group}
                                                          showUsers={showUsers}/>)

            case 'MESSAGE':
                return this.createFeedView(<FeedMessage shared token={token} navigation={this.props.navigation}
                                                        item={item.shardeActivity}/>)
            case'POST':
                return this.createFeedView(<FeedPost showActions={showActions} shared token={token}
                                                     visibleFeeds={visibleFeeds}
                                                     actions={actions}
                                                     group={group}
                                                     navigation={this.props.navigation} item={item.shardeActivity}
                                                     like={actions.like} unlike={actions.unlike}
                                                     showUsers={showUsers} comment={comment}/>)
            default:
                return this.createFeedView(<FeedBusiness shared location={location}
                                                         actions={actions}
                                                         group={group}
                                                         visibleFeeds={visibleFeeds}
                                                         token={token} refresh={refresh}
                                                         showActions={showActions}
                                                         navigation={this.props.navigation}
                                                         item={item.shardeActivity}
                                                         comment={comment} like={like} unlike={unlike}
                                                         showUsers={showUsers}
                                                         _panResponder={this._panResponder}/>)
        }
    }

    createFeedView(item) {
        if (item) {
            return <View style={{}}>
                {item}
            </View>
        }
        return <View></View>
    }
}



