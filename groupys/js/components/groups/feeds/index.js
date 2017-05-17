
import React, { Component } from 'react';
import { Image, Platform} from 'react-native';

import { connect } from 'react-redux';
import { actions } from 'react-native-navigation-redux-helpers';
import { Container, Content, Text, InputGroup, Input,Thumbnail,Button,Picker,Right,Item, Left,Icon,Header,Footer,Body, View,Card,CardItem } from 'native-base';



import login from './general-theme';
import GenericFeedManager from '../../generic-feed-manager/index'
import GenericFeedItem from '../../generic-feed-manager/generic-feed'

var aroma = require('../../../../images/aroma.png');
var aromCafe = require('../../../../images/aroma-cafe.jpeg');
var castro = require('../../../../images/castro.jpg');
var castroBanner = require('../../../../images/castro_final.png');
var myprofile = require('../../../../images/profile.jpeg');
import FeedApi from '../../../api/feed'
let feedApi = new FeedApi();

const feeds2 = [
{
    id:3,
    social:{
        like:true,
        numberLikes: 12,
    },
    logo:{
        require:castro,
    },
    itemTitle: 'All Store 10% off',
    description: 'Total discount',
    banner: {
        require:castroBanner
    },
},
    {
        id:4,
        social:{
            like:true,
            numberLikes: 12,
        },
        logo:{
            require:castro,
        },
        itemTitle: 'All Store 10% off',
        description: 'Total discount',
        banner: {
            require:castroBanner
        },
    },
    {
        id:1,
        social:{
            like:false,
            numberLikes: 10,


        },
        logo:{
            require:myprofile,
        },
        itemTitle: 'Roi share with you',
        description: 'Cafe Discount',

        feed:{
            social:{
                like:false,
                numberLikes: 10,
            },
            logo:{
                require:aroma,
            },
            itemTitle: 'Cafe 20% off',
            description: 'Cafe Discount',
            banner: {
                require:aromCafe
            }
        }
    },
    {
        id: 2,
        social: {
            like: false,
            numberLikes: 12,


        },
        logo: {
            require: aroma,
        },
        itemTitle: 'Cafe 20% off',
        description: 'Cafe Discount',
        banner: {
            require: aromCafe
        }
    }
    // },




];

const feeds = [
        {
            id:1,
            social:{
                like:false,
                numberLikes: 10,


            },
            logo:{
                require:myprofile,
            },
            itemTitle: 'Roi share with you',
            description: 'Cafe Discount',

            feed:{
                social:{
                    like:false,
                    numberLikes: 10,
                },
                logo:{
                    require:aroma,
                },
                itemTitle: 'Cafe 20% off',
                description: 'Cafe Discount',
                banner: {
                    require:aromCafe
                }
            }
        },
    {
        id: 2,
        social: {
            like: false,
            numberLikes: 12,


        },
        logo: {
            require: aroma,
        },
        itemTitle: 'Cafe 20% off',
        description: 'Cafe Discount',
        banner: {
            require: aromCafe
        }
    }
        // },



    ];

export default class GroupFeed extends Component {

  constructor(props) {
    super(props);

  }








     async getAll(direction,id){

      let feed = await feedApi.getAll(direction,id,this.props.navigation.state.params.group._id);
      return feed;
    }






    replaceRoute(route) {
    this.props.replaceAt('login', { key: route }, this.props.navigation.key);
  }

    render() {

        return (
            <GenericFeedManager api={this} title='Feeds' ItemDetail={GenericFeedItem}></GenericFeedManager>

        );
    }

}


