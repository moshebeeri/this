/**
 * Created by roilandshut on 06/09/2017.
 */


import { createSelector } from 'reselect'

import * as assemblers from '../actions/collectionAssembler';
import  FeedUiConverter from '../api/feed-ui-converter'

let feedUiConverter = new FeedUiConverter();



 const getActivities = (state) => state.activities
const getPromotions = (state) => state.promotions
const getUser = (state) => state.user.users
 const getBusinesses = (state) => state.businesses
 const getInstances = (state) => state.instances
const getStateFeeds = (state) => state.groups
// const getStaate = (state) => state


export const getFeeds = createSelector(  [ getActivities,getPromotions,getUser,getBusinesses,getInstances,getStateFeeds],
    (activities,promotions,user,businesses,instances,groups) => {
        const collections = {activities:activities.activities,
            promotions:promotions.promotions,
            user: user,
            businesses:businesses.businesses,
            instances:instances.instances};

        let feedsOrder = groups.groupFeedOrder
        let feeds = groups.groupFeeds;
        let clientMessage = groups.clientMessages
        let feedsUi = new Map();
        if (!_.isEmpty(feeds)) {
            Object.keys(feedsOrder).forEach(function (groupId) {
                let groupFeeds = feedsOrder[groupId]
                let groupFeedsArray = groupFeeds.map(feedId => feeds[groupId][feedId])
                let assembledFeeds = groupFeedsArray.map(function (feed) {
                    if(feed.activity && (feed.activity.action =='group_message' || feed.activity.action == 'group_follow')){
                        return feed;
                    }
                    return assemblers.assembler(feed, collections);
                })
                if(clientMessage && clientMessage[groupId] &&  clientMessage[groupId].length > 0) {
                    clientMessage[groupId].forEach(feed =>  assembledFeeds.unshift(feed))

                }


               let newFeedsList = assembledFeeds.map(feed => feedUiConverter.createFeed(feed));
                newFeedsList = newFeedsList.filter(feed =>feed.id);
                feedsUi[groupId] = newFeedsList;

            })


        }
        return feedsUi;

    })


