/**
 * Created by roilandshut on 06/09/2017.
 */
import {createSelector} from 'reselect'
import FeedUiConverter from '../api/feed-ui-converter'
import InstanceLifeCycle from '../utils/InstanceLifeCycle'

const noPic = require('../../images/client_1.png');
let feedUiConverter = new FeedUiConverter();
const getStateFeeds = (state) => state.comments
const getStateSavedInstances = (state) => state.myPromotions;
export const getFeeds = createSelector([getStateFeeds, getStateSavedInstances],
    (comments, savedPromotion) => {
        let feedsOrder = comments.groupCommentsOrder
        let feeds = comments.groupComments;
        let clientComments = comments.clientMessages;
        let response = {}
        let instanceLifeCycle = new InstanceLifeCycle(savedPromotion.feeds);
        if (!_.isEmpty(feedsOrder)) {
            Object.keys(feedsOrder).forEach(function (groupId) {
                if (!response[groupId]) {
                    response[groupId] = new Array();
                }
                if (feedsOrder[groupId] && feedsOrder[groupId].length > 0) {
                    feedsOrder[groupId].forEach(function (feedId) {
                        let instance = feeds[groupId][feedId].entities.instance;
                        let post = feeds[groupId][feedId].entities.post;
                        if (instance) {
                            instance = feedUiConverter.createPromotionInstance(instance, instanceLifeCycle)
                        }
                        if (post) {
                            post = feedUiConverter.createPost(post)
                        }
                        response[groupId].unshift({
                            id: feedId,
                            instance: instance,
                            post: post,
                            message: createFeed(feeds[groupId][feedId])
                        });
                    })
                }
            })
        }
        if (!_.isEmpty(clientComments)) {
            Object.keys(clientComments).forEach(function (groupId) {
                if (!_.isEmpty(clientComments[groupId])) {
                    if (!response[groupId]) {
                        response[groupId] = [];
                    }
                    clientComments[groupId].forEach(feed => {
                            response[groupId].unshift({id: feed.id, message: createFeed(feed)})
                        }
                    )
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
        date: message.created,
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
