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
const getStateFeeds = (state) => state.commentInstances
// const getStaate = (state) => state
export const getFeeds = createSelector([getStateFeeds],
    (commentInstances) => {
        let feedsOrder = commentInstances.groupCommentsOrder
        let feeds = commentInstances.groupComments;
        let clientMessages = commentInstances.clientMessages;
        let response = {}
        if (!_.isEmpty(feedsOrder)) {
            Object.keys(feedsOrder).forEach(function (groupId) {
                if (!_.isEmpty(feedsOrder[groupId])) {
                    Object.keys(feedsOrder[groupId]).forEach(function (instanceId) {
                        if (feedsOrder[groupId][instanceId] && feedsOrder[groupId][instanceId].length > 0) {
                            feedsOrder[groupId][instanceId].forEach(function (feedId) {
                                if (!response[groupId]) {
                                    response[groupId] = {};
                                }
                                if (!response[groupId][instanceId]) {
                                    response[groupId][instanceId] = new Array();
                                }
                                response[groupId][instanceId].push(createFeed(feeds[groupId][instanceId][feedId]))
                            })
                        }
                    })
                }
            })
        }
        if (!_.isEmpty(clientMessages)) {
            Object.keys(clientMessages).forEach(function (groupId) {
                if (!_.isEmpty(clientMessages[groupId])) {
                    Object.keys(clientMessages[groupId]).forEach(function (instanceId) {
                        if (!response[groupId]) {
                            response[groupId] = {};
                        }
                        if (!response[groupId][instanceId]) {
                            response[groupId][instanceId] = new Array();
                        }
                        clientMessages[groupId][instanceId].forEach(feed => response[groupId][instanceId].unshift(feedUiConverter.createFeed(feed)))
                    });
                }
            });
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
    let name = user.phone_number;
    if (user.name) {
        name = user.name;
    }
    let response = {
        id: message._id,
        actor: user._id,
        showSocial: false,
        description: message.message,
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
