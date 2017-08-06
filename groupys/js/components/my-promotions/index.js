
import React, { Component } from 'react';
import { Image, Platform} from 'react-native';

import { Container, Content, Text, InputGroup, Input,Thumbnail,Button,Picker,Right,Item, Left,Icon,Header,Footer,Body, View,Card,CardItem } from 'native-base';


import GenericFeedManager from '../generic-feed-manager/index'
import MyPromotionFeedItem from '../generic-feed-manager/my-promotion-feed'


import ProfileApi from '../../api/profile'
let profileApi = new ProfileApi();

import { bindActionCreators } from "redux";

import * as feedsAction from "../../actions/feeds";
import { connect } from 'react-redux';
class MyPromotions extends Component {

      constructor(props) {
        super(props);
        this.props.fetchSavedFeedsFromStore();

      }


     async getAll(direction,id){
          let feed = new Array();
          if(id == 'start' || direction=='up'){
               feed = await profileApi.fetch(0,100);
          }
      return feed;
    }


    fetchFeeds(){
        this.props.fetchFeeds('GET_SAVED_FEEDS',this.props.feeds.savedfeeds,this);
    }
    fetchTop(id){
        this.props.showSavedTopLoader();
        this.props.fetchTop('GET_SAVED_FEEDS',this.props.feeds.savedfeeds,id,this);
    }


    nextLoad(){

    }

    render() {

        return (


            <GenericFeedManager navigation={this.props.navigation} loadingDone = {this.props.feeds.savedloadingDone} showTopTimer={this.props.feeds.savedShowTopLoader} feeds={this.props.feeds.savedfeeds} api={this} title='Feeds' ItemDetail={MyPromotionFeedItem}></GenericFeedManager>

        );
    }

}
export default connect(
    state => ({
        feeds: state.feeds
    }),
    dispatch => bindActionCreators(feedsAction, dispatch)
)(MyPromotions);

