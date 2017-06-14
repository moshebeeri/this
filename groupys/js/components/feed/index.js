
import React, { Component } from 'react';
import { Image, Platform} from 'react-native';

import { actions } from 'react-native-navigation-redux-helpers';
import { Container, Content, Text, InputGroup, Input,Thumbnail,Button,Picker,Right,Item, Left,Icon,Header,Footer,Body, View,Card,CardItem } from 'native-base';
import GenericFeedManager from '../generic-feed-manager/index'
import GenericFeedItem from '../generic-feed-manager/generic-feed'

import { bindActionCreators } from "redux";
import { connect } from 'react-redux';
import * as feedsAction from "../../actions/feeds";
import FeedApi from '../../api/feed'
let feedApi = new FeedApi();
class Feed extends Component {

      constructor(props) {
        super(props);

      }


     async getAll(direction,id){
        let feed = await feedApi.getAll(direction,id);
      return feed;
    }

    fetchFeeds(){
         this.props.fetchFeeds('GET_FEEDS',this.props.feeds.feeds,this);
    }
    fetchTop(id){
        this.props.showTopLoader();
        this.props.fetchTop('GET_FEEDS',this.props.feeds.feeds,id,this);
    }

    render() {

        return (
            <GenericFeedManager showTopTimer={this.props.feeds.showTopLoader} feeds={this.props.feeds.feeds} api={this} title='Feeds' ItemDetail={GenericFeedItem}></GenericFeedManager>

        );
    }



}

export default connect(
    state => ({
        feeds: state.feeds
    }),
    dispatch => bindActionCreators(feedsAction, dispatch)
)(Feed);


