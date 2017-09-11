
import React, { Component } from 'react';
import { Image, Platform} from 'react-native';

import { actions } from 'react-native-navigation-redux-helpers';
import { Container, Content, Text, InputGroup, Input,Thumbnail,Button,Picker,Right,Item, Left,Icon,Header,Footer,Body, View,Card,CardItem } from 'native-base';
import GenericFeedManager from '../generic-feed-manager/index'
import GenericFeedItem from '../generic-feed-manager/generic-feed'

import { bindActionCreators } from "redux";
import { connect } from 'react-redux';
import * as feedsAction from "../../actions/feedsMain";

import { getFeeds } from './feedSelector'


import { createSelector } from 'reselect'



class Feed extends Component {

      constructor(props) {
        super(props);
          const { token } = this.props;


      }



    componentWillMount(){
      //  this.props.actions.setUserFollows();
    }


    render() {
        const { navigation,feedState,feeds,userFollower,actions,token ,user,allstate} = this.props;
        return (
            <GenericFeedManager
                navigation={navigation}

                loadingDone = {feedState.loadingDone}
                showTopLoader={feedState.showTopLoader}
                userFollowers= {userFollower}
                feeds={feeds}
                actions={actions}
                token={token}
                user={user}
                title='Feeds'
                ItemDetail={GenericFeedItem}>

            </GenericFeedManager>

        );
    }



}

const mapStateToProps = state => {
    return {
        feedState:state.feeds,
        token:state.authentication.token,
        userFollower:state.user.followers,
        user:state.user.user,
        feeds: getFeeds(state),
        allstate:state
    }
}

export default connect(
    mapStateToProps,


    (dispatch) => ({
        actions: bindActionCreators(feedsAction, dispatch)
    })
)(Feed);


