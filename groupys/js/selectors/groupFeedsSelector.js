/**
 * Created by roilandshut on 06/09/2017.
 */


import { createSelector } from 'reselect'

import * as assemblers from '../actions/collectionAssembler';
import  FeedUiConverter from '../api/feed-ui-converter'

let feedUiConverter = new FeedUiConverter();



// const getActivities = (state) => state.activities.activities
// const getPromotions = (state) => state.promotions.promotions
// const getUser = (state) => state.user.users
// const getBusinesses = (state) => state.businesses.businesses
// const getInstances = (state) => state.instances.instances
const getStateFeeds = (state) => state.groups
// const getStaate = (state) => state


export const getFeeds = createSelector(  [ getStateFeeds],
    (groups) => {
        let feedsOrder = groups.groupFeedOrder
        let feeds = groups.groupFeeds;
        let clientMessage = groups.clientMessages
        let feedsUi = new Map();
        if (!_.isEmpty(feeds)) {
            Object.keys(feedsOrder).forEach(function (groupId) {
                let groupFeeds = feedsOrder[groupId]
                let groupFeedsArray = groupFeeds.map(feedId => feeds[groupId][feedId])
                if(clientMessage && clientMessage[groupId] &&  clientMessage[groupId].length > 0) {
                    clientMessage[groupId].forEach(feed =>  groupFeedsArray.unshift(feed))

                }


               const newFeedsList = groupFeedsArray.map(feed => feedUiConverter.createFeed(feed));

                feedsUi[groupId] = newFeedsList;

            })


        }
        return feedsUi;

    })


