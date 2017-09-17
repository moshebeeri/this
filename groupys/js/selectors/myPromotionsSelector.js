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
const getStateFeeds = (state) => state.myPromotions
// const getStaate = (state) => state


export const getFeeds = createSelector(  [ getStateFeeds],
    (myPromotions) => {
        let feedsOrder = myPromotions.feedOrder
        let feeds = myPromotions.feeds;
        let response = []
        if (!_.isEmpty(feedsOrder)) {
            Object.keys(feedsOrder).forEach(function (groupId) {

                let feedArray = feedsOrder.map(feedId => feeds[feedId])



                 response =  feedArray.map(feed => feedUiConverter.createSavedPomotion(feed));


            })


        }
        return response;

    })


/**
 * Created by roilandshut on 14/09/2017.
 */
