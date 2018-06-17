/**
 * Created by roilandshut on 06/09/2017.
 */
import {createSelector} from 'reselect'
import * as assemblers from '../actions/collectionAssembler';
import FeedUiConverter from '../api/feed-ui-converter'
const noPic = require('../../images/client_1.png');
let feedUiConverter = new FeedUiConverter();
// const getActivities = (state) => state.activities.activities
// const getPromotions = (state) => state.promotions.promotions
// const getUser = (state) => state.user.users
// const getBusinesses = (state) => state.businesses.businesses
// const getInstances = (state) => state.instances.instances
const getStateFeeds = (state) => state.entityComments
// const getStaate = (state) => state
export const getFeeds = createSelector([getStateFeeds],
    (commentInstances) => {
        let feedsOrder = commentInstances.entityCommentsOrder
        let feeds = commentInstances.entityComments;
        let clientMessages = commentInstances.clientMessages;
        let response = {}
        if (!_.isEmpty(feedsOrder)) {
            Object.keys(feedsOrder).forEach(function (generalId) {
                if (!_.isEmpty(feedsOrder[generalId])) {
                    feedsOrder[generalId].forEach(function (feedId) {
                        if (!response[generalId]) {
                            response[generalId] = new Array();
                        }
                        let feed = createFeed(feeds[generalId][feedId]);
                        if(feed) {
                            response[generalId].push(feed)
                        }
                    })
                }
            })
        }
        if (clientMessages) {
            Object.keys(clientMessages).forEach(function (generalId) {
                if (!response[generalId]) {
                    response[generalId] = new Array();
                }
                clientMessages[generalId].forEach(feed => response[generalId].unshift(feedUiConverter.createFeed(feed)))
            })
        }
        return response;
    })

function createFeed(message) {
    let user = undefined
    if (message.activity) {
        user = message.activity.actor_user;
        message = message.activity;
    } else {
        user = message.user;
    }
    if(!user){
        return undefined;
    }

    let name = user.phone_number;
    if (user.name) {
        name = user.name;
    }
    let response = {
        id: message._id,
        key: message._id,
        actor: user._id,
        showSocial: false,
        description: message.message,
        date:message.created,
    }
    if (user.pictures && user.pictures.length > 0) {
        response.logo = {
            uri: user.pictures[user.pictures.length - 1].pictures[0]
        }
    } else {
        response.logo = noPic;
    }
    response.name = name;
    response.itemType = 'MESSAGE';
    return response;
}

/**
 * Created by roilandshut on 14/09/2017.
 */
