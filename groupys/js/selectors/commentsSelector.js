/**
 * Created by roilandshut on 06/09/2017.
 */
import {createSelector} from 'reselect'
import FeedUiConverter from '../api/feed-ui-converter'
const noPic = require('../../images/client_1.png');
let feedUiConverter = new FeedUiConverter();
const getStateFeeds = (state) => state.comments
export const getFeeds = createSelector([getStateFeeds],
    (comments) => {
        let feedsOrder = comments.groupCommentsOrder
        let feeds = comments.groupComments;
        let clientComments = comments.clientMessages;
        let response = {}
        if (!_.isEmpty(feedsOrder)) {
            Object.keys(feedsOrder).forEach(function (groupId) {
                if (!response[groupId]) {
                    response[groupId] = new Array();
                }
                if (feedsOrder[groupId] && feedsOrder[groupId].length > 0) {
                    let lastGroupInstance = feeds[groupId][feedsOrder[groupId][0]].entities.instance;
                    let lastPost = feeds[groupId][feedsOrder[groupId][0]].entities.post;
                    feedsOrder[groupId].forEach(function (feedId) {
                        if (( lastGroupInstance && feeds[groupId][feedId].entities.instance &&
                                feeds[groupId][feedId].entities.instance._id !== lastGroupInstance._id) ||
                            (lastPost && feeds[groupId][feedId].entities.post &&
                                feeds[groupId][feedId].entities.post._id !== lastPost._id) || (
                                lastGroupInstance && feeds[groupId][feedId].entities.post
                            )
                            || (lastPost && feeds[groupId][feedId].entities.instance)) {
                            if (lastGroupInstance) {
                                response[groupId].push({instance: feedUiConverter.createPromotionInstance(lastGroupInstance)});
                            } else {
                                response[groupId].push({instance: feedUiConverter.createPost(lastPost)});
                            }
                            lastGroupInstance = feeds[groupId][feedId].entities.instance;
                            lastPost = feeds[groupId][feedId].entities.post;
                        }
                        response[groupId].push({message: createFeed(feeds[groupId][feedId])});
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
                            response[groupId].unshift({message: createFeed(feed)})
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
