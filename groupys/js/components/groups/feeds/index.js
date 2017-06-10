
import React, { Component } from 'react';
import { Image, Platform} from 'react-native';

import { connect } from 'react-redux';
import { actions } from 'react-native-navigation-redux-helpers';
import { Container, Content, Text, InputGroup, Input,Thumbnail,Button,Picker,Right,Item, Left,Icon,Header,Footer,Body, View,Card,CardItem } from 'native-base';



import GenericFeedManager from '../../generic-feed-manager/index'
import GenericFeedItem from '../../generic-feed-manager/generic-feed'


import FeedApi from '../../../api/feed'
let feedApi = new FeedApi();

import { bindActionCreators } from "redux";

import * as feedsAction from "../../../actions/feeds";


class GroupFeed extends Component {

  constructor(props) {
    super(props);
      this.state = {

          messsage: '',

      };

  }








     async getAll(direction,id){

      let feed = await feedApi.getAll(direction,id,this.props.navigation.state.params.group._id);
      return feed;
    }



    fetchFeeds(){
        this.props.fetchGroupFeeds(this.props.navigation.state.params.group._id,'GET_GROUP_FEEDS',this.props.feeds.savedfeeds,this);
    }
    fetchTop(id){
        this.props.showGroupTopLoader(this.props.navigation.state.params.group._id);
        this.props.fetchGroupTop(this.props.navigation.state.params.group._id,'GET_GROUP_FEEDS',this.props.feeds.savedfeeds,id,this);
    }




    render() {
        let feeds = this.props.feeds['groups'+this.props.navigation.state.params.group._id];
        if(!feeds){
            feeds = [];
        }

        let showTop = this.props.feeds['showTopLoader'+this.props.navigation.state.params.group._id];
        if(!showTop){
            showTop = false;
        }
        return (
        <Container>

            <GenericFeedManager showTopTimer={showTop} feeds={feeds} api={this} title='Feeds' ItemDetail={GenericFeedItem}></GenericFeedManager>

        </Container>


        );
    }

}

export default connect(
    state => ({
        feeds: state.feeds
    }),
    dispatch => bindActionCreators(feedsAction, dispatch)
)(GroupFeed);



