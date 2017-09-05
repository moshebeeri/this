
import React, { Component } from 'react';
import { Image, Platform} from 'react-native';

import { actions } from 'react-native-navigation-redux-helpers';
import { Container, Content, Text, InputGroup, Input,Thumbnail,Button,Picker,Right,Item, Left,Icon,Header,Footer,Body, View,Card,CardItem } from 'native-base';
import GenericFeedManager from '../generic-feed-manager/index'
import GenericFeedItem from '../generic-feed-manager/generic-feed'

import { bindActionCreators } from "redux";
import { connect } from 'react-redux';
import * as feedsAction from "../../actions/feedsMain";
import FeedApi from '../../api/feed'
import * as assemblers from '../../actions/collectionAssembler';

import  FeedUiConverter from '../../api/feed-ui-converter'
let feedUiConverter = new FeedUiConverter();
let feedApi = new FeedApi();
class Feed extends Component {

      constructor(props) {
        super(props);
         // this.props.fetchUsers();
         // this.props.fetchUsersFollowers();

      }



    clone(obj){
       return JSON.parse(JSON.stringify(obj));
    }


    render() {
        const { navigation,state,statePromotion,stateBusinesses ,stateInstances,stateActivities,stateUsers,actions } = this.props;

        let promotions = this.clone(statePromotion);
        let businesses = this.clone(stateBusinesses);
        let instances = this.clone(stateInstances);
        let activities = this.clone(stateActivities);
        let users = this.clone(stateUsers);

        let collections = {promotions,businesses,instances,users,activities}

        let feedsUi = [];
        if(!_.isEmpty(state.feeds)) {
            let feedsList = state.feeds;
            let feedArray = Object.keys(feedsList).map(key=>this.clone(feedsList[key]))
            let assembledFeeds = feedArray.map(function (feed) {
                return assemblers.assembler(feed,collections);
            })
            feedsUi = assembledFeeds.map(feed => feedUiConverter.createFeed(feed));

        }
        return (
            <GenericFeedManager
                navigation={navigation}

                loadingDone = {state.loadingDone}
                showTopLoader={state.showTopLoader}
                userFollowers= {stateUsers.followers}
                feeds={feedsUi}
                actions={actions}
                title='Feeds'
                ItemDetail={GenericFeedItem}>

            </GenericFeedManager>

        );
    }



}

export default connect(
    state => ({
        allstore:state,
        state: state.feeds,
        stateUsers: state.user.user,
        statePromotion:state.promotions.promotions,
        stateBusinesses:state.businesses.businesses,
        stateInstances:state.instances.instances,
        stateActivities:state.activities.activities,

    }),

    (dispatch) => ({
        actions: bindActionCreators(feedsAction, dispatch)
    })
)(Feed);


