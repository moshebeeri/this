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


import FeedWelcome from './feedWelcome'
import strings from "../../../../i18n/i18n"

const {width, height} = Dimensions.get('window');
const vw = width / 100;
const vh = height / 100;
const vmin = Math.min(vw, vh);
const vmax = Math.max(vw, vh);
export default class FeedShared extends Component {
    constructor() {
        super();
    }

    render() {
        const {refresh, item, save, like, unlike, showUsers, comment, token, location} = this.props;
        const container = this.createContainerStyle(item);
        return (<View style={container}>
                <View style={{width:width-15,flex:1,justifyContent:'center',alignItems:'flex-start',backgroundColor:'white'}}>
                 <Text style={{margin:5}}>{item.user.name} {strings.Shared}</Text>
                </View>
                <View style={{flex:10}}>
                {this.createSharedActivity(item)}
                </View>
            </View>
        );
    }

    createContainerStyle(item) {
        if (item.banner) {
            return {
                flex: 1,
                height: 81 * vh,
                width: width,
                overflow: 'hidden',
                backgroundColor: '#b7b7b7',
                // backgroundColor:'#FFF',
                alignItems: 'center',
                flexDirection: 'column',
            }
        }
        return {
            flex: 1,
            height: 71 * vh,

            width: width,
            overflow: 'hidden',
            backgroundColor: '#b7b7b7',
            // backgroundColor:'#FFF',
            alignItems: 'center',
            flexDirection: 'column',
        };
    }
    createSharedActivity(item) {
        const {refresh, like, unlike, showUsers, comment, token, location} = this.props;
        switch (item.shared) {
            case 'PROMOTION':
                return this.createFeedView(<FeedPromotion shared refresh={refresh} token={token} comment={comment}
                                                          location={location}
                                                          navigation={this.props.navigation} item={item.shardeActivity}
                                                          like={like} unlike={unlike}
                                                          showUsers={showUsers}/>)
            case 'MESSAGE':
                return this.createFeedView(<FeedMessage shared token={token} navigation={this.props.navigation}
                                                        item={item.shardeActivity}/>)


            case'POST':
                return this.createFeedView(<FeedPost shared token={token} navigation={this.props.navigation} item={item.shardeActivity} like={actions.like} unlike={actions.unlike}
                                                     showUsers={showUsers} comment={comment}/>)

            default:
                return this.createFeedView(<FeedBusiness shared location={location} token={token} refresh={refresh}
                                                         navigation={this.props.navigation}
                                                         item={item.shardeActivity}
                                                         comment={comment} like={like} unlike={unlike}
                                                         showUsers={showUsers}
                                                         _panResponder={this._panResponder}/>)
        }
    }
    createFeedView(item) {
        if (item) {
            return <View  >
                {item}
            </View>
        }
        return <View></View>
    }

}



