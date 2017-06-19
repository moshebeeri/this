
import React, { Component } from 'react';
import { Image,TextInput, Platform,View} from 'react-native';

import { connect } from 'react-redux';
import { actions } from 'react-native-navigation-redux-helpers';
import { Container,Footer,Icon,Button } from 'native-base';



import GenericFeedManager from '../../generic-feed-manager/index'
import GenericFeedItem from '../../generic-feed-manager/generic-feed'
import styles from './styles'

import FeedApi from '../../../api/feed'
let feedApi = new FeedApi();

import { bindActionCreators } from "redux";

import * as feedsAction from "../../../actions/feeds";

import GroupApi from "../../../api/groups"
let groupApi = new GroupApi();
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
         let groupid = this.props.navigation.state.params.group._id;
         let goupfeeds = 'groups'+ groupid;
         if(!this.props.feeds[goupfeeds]){
             this.props.fetchGroupFeeds(groupid, 'GET_GROUP_FEEDS', new Array(), this);
         }else {
             this.props.fetchGroupFeeds(groupid, 'GET_GROUP_FEEDS', this.props.feeds[goupfeeds], this);
         }
    }
    fetchTop(id){
        let groupid = this.props.navigation.state.params.group._id;
        let groupFeeds = 'groups'+ groupid;

        this.props.fetchGroupTop(groupid,'GET_GROUP_FEEDS',this.props.feeds[groupFeeds],this.props.feeds[groupFeeds][0].id,this);
    }

    async _onPressButton(){
        let groupid = this.props.navigation.state.params.group._id;
        let groupFeeds = 'groups'+ groupid;
        await groupApi.meesage(groupid,this.state.messsage);
        this.props.fetchGroupTop(groupid,'GET_GROUP_FEEDS',this.props.feeds[groupFeeds],this.props.feeds[groupFeeds][0].id,this);
        this.setState({
            messsage:''
        })


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

            <View style={styles.itemborder}>
                <View style={ {backgroundColor:'white',  flexDirection: 'row'}}>
                <TextInput
                    style={styles.item}


                    placeholder="My Message"
                    returnKeyType='done'
                    onChangeText={(messsage) => this.setState({messsage})}
                    value={this.state.messsage}/>
                    <Button   onPress={() => this._onPressButton()} style={styles.icon} iconRight rounded light>

                        <Icon name='send' />
                    </Button>



                </View>
            </View>

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



