
import React, { Component } from 'react';
import { Image, Platform} from 'react-native';

import { Container, Content, Text, InputGroup, Input,Thumbnail,Button,Picker,Right,Item, Left,Icon,Header,Footer,Body, View,Card,CardItem } from 'native-base';


import GenericFeedManager from '../generic-feed-manager/index'
import MyPromotionFeedItem from '../generic-feed-manager/my-promotion-feed'


import ProfileApi from '../../api/profile'
let profileApi = new ProfileApi();


export default class MyPromotions extends Component {

      constructor(props) {
        super(props);

      }


     async getAll(direction,id){
          let feed = new Array();
          if(id == 'start' || direction=='up'){
               feed = await profileApi.fetch(0,100);
          }
      return feed;
    }

    render() {

        return (
            <GenericFeedManager api={this} title='Feeds' ItemDetail={MyPromotionFeedItem}></GenericFeedManager>

        );
    }

}


