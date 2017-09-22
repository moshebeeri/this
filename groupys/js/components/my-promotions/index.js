
import React, { Component } from 'react';
import { Image, Platform} from 'react-native';

import { Container, Content, Text, InputGroup, Input,Thumbnail,Button,Picker,Right,Item, Left,Icon,Header,Footer,Body, View,Card,CardItem } from 'native-base';


import GenericFeedManager from '../generic-feed-manager/index'
import MyPromotionFeedItem from '../generic-feed-manager/my-promotion-feed'



import { bindActionCreators } from "redux";
import { getFeeds } from '../../selectors/myPromotionsSelector'

import * as promotionAction from "../../actions/myPromotions";
import { connect } from 'react-redux';
class MyPromotions extends Component {

      constructor(props) {
        super(props);
      }




    renderItem(item){
        const { navigation } = this.props;

        return <MyPromotionFeedItem
            item={item.item}
            index = {item.index}
            navigation={navigation}
        />
    }

    render() {
        const { navigation,feeds,userFollower,actions,token,loadingDone,showTopLoader,user } = this.props;

        return (
            <GenericFeedManager
                navigation={navigation}

                loadingDone = {loadingDone}
                showTopLoader={showTopLoader}
                userFollowers= {userFollower}
                feeds={feeds}
                actions={actions}
                token={token}
                entity={user}
                title='Feeds'
                ItemDetail={MyPromotionFeedItem}>

            </GenericFeedManager>

        );
    }

}
const mapStateToProps = state => {
    return {
        userFollower:state.user.followers,
        user:state.user.user,
        feeds: getFeeds(state),
        showTopLoader:state.myPromotions.showTopLoader,
        loadingDone:state.myPromotions.loadingDone,
        myPromotions:state.myPromotions
    }
}

export default connect(
    mapStateToProps,


    (dispatch) => ({
        actions: bindActionCreators(promotionAction, dispatch)
    })
)(MyPromotions);