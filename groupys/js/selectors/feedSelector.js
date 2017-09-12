/**
 * Created by roilandshut on 06/09/2017.
 */


import { createSelector } from 'reselect'

import * as assemblers from '../actions/collectionAssembler';
import  FeedUiConverter from '../api/feed-ui-converter'

let feedUiConverter = new FeedUiConverter();



const getActivities = (state) => state.activities.activities
const getPromotions = (state) => state.promotions.promotions
const getUser = (state) => state.user.users
const getBusinesses = (state) => state.businesses.businesses
const getInstances = (state) => state.instances.instances
const getStateFeeds = (state) => state.feeds.feeds
const getStaate = (state) => state


export const getFeeds = createSelector(  [ getActivities,getPromotions,getUser,getBusinesses,getInstances,getStateFeeds,getStaate],
    (activities,promotions,user,businesses,instances,feeds,allstate) => {
    const collections = {activities:activities,
            promotions:promotions,
            user: user,
            businesses:businesses,
            instances:instances};


    let feedsUi = [];
    if (!_.isEmpty(feeds) && !_.isEmpty(instances) && !_.isEmpty(businesses)  && !_.isEmpty(user) && !_.isEmpty(activities)) {
        let feedsList = feeds;
        let feedArray = Object.keys(feedsList).map(key => feedsList[key])
        let assembledFeeds = feedArray.map(function (feed) {
            return assemblers.assembler(feed, collections);
        })
        feedsUi = assembledFeeds.map(feed => feedUiConverter.createFeed(feed));

    }
    return feedsUi;

})