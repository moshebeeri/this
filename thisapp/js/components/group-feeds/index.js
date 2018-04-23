import React, {Component} from 'react';
import {Image, Platform} from 'react-native';
import {connect} from 'react-redux';
import {actions} from 'react-native-navigation-redux-helpers';
import {
    Container,
    Content,
    Text,
    InputGroup,
    Input,
    Thumbnail,
    Button,
    Picker,
    Right,
    Item,
    Left,
    Icon,
    Header,
    Footer,
    Body,
    View,
    Card,
    CardItem
} from 'native-base';

const {
    replaceAt,
} = actions;
import GeneralComponentHeader from '../header/index';
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
const feeds2 = [
    {
        id: 3,
        social: {
            like: true,
            numberLikes: 12,
        },
        logo: {
            require: castro,
        },
        itemTitle: 'All Store 10% off',
        description: 'Total discount',
        banner: {
            require: castroBanner
        },
    },
    {
        id: 4,
        social: {
            like: true,
            numberLikes: 12,
        },
        logo: {
            require: castro,
        },
        itemTitle: 'All Store 10% off',
        description: 'Total discount',
        banner: {
            require: castroBanner
        },
    },
    {
        id: 1,
        social: {
            like: false,
            numberLikes: 10,
        },
        logo: {
            require: myprofile,
        },
        itemTitle: 'Roi share with you',
        description: 'Cafe Discount',
        feed: {
            social: {
                like: false,
                numberLikes: 10,
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
        id: 1,
        social: {
            like: false,
            numberLikes: 10,
        },
        logo: {
            require: myprofile,
        },
        itemTitle: 'Roi share with you',
        description: 'Cafe Discount',
        feed: {
            social: {
                like: false,
                numberLikes: 10,
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

class GroupFeed extends Component {
    static propTypes = {
        replaceAt: React.PropTypes.func,
        navigation: React.PropTypes.shape({
            key: React.PropTypes.string,
        }),
    };

    constructor(props) {
        super(props);
    }

    async componentWillMount() {
        this.props.navigateAction('home', this.props.index)
    }

    async getAll(direction, id) {
        return feeds;
    }

    fetchApi(pageOffset, pageSize) {
        return feeds;
        // return new Promise(async function(resolve, reject) {
        //         console.log('featching: '+ pageOffset);
        //
        //     if(pageOffset < 10 && pageOffset % 2 ==0){
        //         await setTimeout(function (x) {
        //             return resolve(feeds2);
        //             ;
        //         }, 0);
        //     }else {
        //         if(pageOffset < 10){
        //             await setTimeout(function (x) {
        //                 return resolve(feeds2);
        //                 ;
        //             }, 0);
        //         }else {
        //
        //             if(pageOffset % 2 ==0){
        //                 await setTimeout(function (x) {
        //                     return resolve(feeds2);
        //                     ;
        //                 }, 0);
        //             }else {
        //                 await setTimeout(function (x) {
        //                     return resolve(feeds2);
        //                     ;
        //                 }, 0);
        //             }
        //         }
        //     }
        //
        //
        //
        // });
        //
    }

    replaceRoute(route) {
        this.props.replaceAt('login', {key: route}, this.props.navigation.key);
    }

    render() {
        return (
            <Container>

                <GeneralComponentHeader showAction={false} current='home' to='home'/>


                <GenericFeedManager loadingDone={this.props.feeds.loadingDone} api={this} title='Feeds'
                                    ItemDetail={GenericFeedItem}></GenericFeedManager>\
                <Footer>

                </Footer>
            </Container>
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
export default connect(mapStateToProps, bindActions)(GroupFeed);
