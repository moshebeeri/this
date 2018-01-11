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
                    <Text style={{padding: 5, backgroundColor: 'white'}}>{item.user.name} {strings.Shared}</Text>
                </View>
                <View style={{flex: 10}}>
                    {this.createSharedActivity(item)}
                </View>
            </View>
        );
    }

    createContainerStyle(item) {
        if (item.banner) {
            return {
                flex: 1,
                height: 91 * vh,
                width: StyleUtils.getWidth(),
                overflow: 'hidden',
                backgroundColor: '#cccccc',
                // backgroundColor:'#FFF',
                alignItems: 'center',
                flexDirection: 'column',
            }
        }
        switch (item.shared) {
            case 'PROMOTION':
                return {
                    flex: 1,
                    height: 80 * vh,
                    width: StyleUtils.getWidth(),
                    overflow: 'hidden',
                    backgroundColor: '#cccccc',
                    // backgroundColor:'#FFF',
                    alignItems: 'center',
                    flexDirection: 'column',
                };
            case'POST':
                return {
                    flex: 1,
                    height: 80 * vh,
                    width: StyleUtils.getWidth(),
                    overflow: 'hidden',
                    backgroundColor: '#cccccc',
                    // backgroundColor:'#FFF',
                    alignItems: 'center',
                    flexDirection: 'column',
                };
        }

    }

    createSharedActivity(item) {
        const {refresh, like, unlike, showUsers, comment, token, location, showActions} = this.props;
        switch (item.shared) {
            case 'PROMOTION':
                return this.createFeedView(<FeedPromotion shared refresh={refresh} token={token} comment={comment}
                                                          location={location}
                                                          showActions={showActions}
                                                          navigation={this.props.navigation} item={item.shardeActivity}
                                                          like={like} unlike={unlike}
                                                          showUsers={showUsers}/>)
            case 'MESSAGE':
                return this.createFeedView(<FeedMessage shared token={token} navigation={this.props.navigation}
                                                        item={item.shardeActivity}/>)
            case'POST':
                return this.createFeedView(<FeedPost showActions={showActions} shared token={token}
                                                     navigation={this.props.navigation} item={item.shardeActivity}
                                                     like={actions.like} unlike={actions.unlike}
                                                     showUsers={showUsers} comment={comment}/>)
            default:
                return this.createFeedView(<FeedBusiness shared location={location} token={token} refresh={refresh}
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
            return item
        }
        return <View></View>
    }
}



