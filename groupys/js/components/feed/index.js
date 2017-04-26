
import React, { Component } from 'react';
import { Image, Platform} from 'react-native';

import { connect } from 'react-redux';
import { actions } from 'react-native-navigation-redux-helpers';
import { Container, Content, Text, InputGroup, Input,Thumbnail,Button,Picker,Right,Item, Left,Icon,Header,Footer,Body, View,Card,CardItem } from 'native-base';

const {
  replaceAt,
} = actions;


import login from './general-theme';
import GenericFeedManager from '../generic-feed-manager/index'
import GenericFeedItem from '../generic-feed-manager/generic-feed'

var aroma = require('../../../images/aroma.png');
var aromCafe = require('../../../images/aroma-cafe.jpeg');
var castro = require('../../../images/castro.jpg');
var castroBanner = require('../../../images/castro_final.png');
var myprofile = require('../../../images/profile.jpeg');
import FeedApi from '../../api/feed'
let feedApi = new FeedApi();

const feeds = [
        {
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
            social:{
                like:false,
                numberLikes: 12,



            },
            logo:{
                require:aroma,
            },
            itemTitle: 'Cafe 20% off',
            description: 'Cafe Discount',
            banner: {
                require:aromCafe
            }
        },
        {
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


    ];

class Feed extends Component {

  static propTypes = {
    replaceAt: React.PropTypes.func,
    navigation: React.PropTypes.shape({
      key: React.PropTypes.string,
    }),
  };

  constructor(props) {
    super(props);

  }






    async componentWillMount(){
        this.props.navigateAction('home',this.props.index)
    }


     getAll(){
        feedApi.getAll();
      return feeds;
    }


    fetchApi(pageOffset,pageSize ) {

        return feedApi.getAll();
        // return new Promise(function(resolve, reject) {
        //     resolve(feeds);
        // });


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


function bindActions(dispatch) {
  return {
    replaceAt: (routeKey, route, key) => dispatch(replaceAt(routeKey, route, key)),
  };
}

const mapStateToProps = state => ({
  navigation: state.cardNavigation,
});

export default connect(mapStateToProps, bindActions)(Feed);
