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

        let feeds = groups.groupFeeds;
        let feedsUi = new Map();
        if (!_.isEmpty(feeds)) {
            let feedsList = feeds;
            Object.keys(feedsList).forEach(function (key) {
                let groupFeeds = feedsList[key]
                let groupFeedsArray = Object.keys(groupFeeds).map(key => groupFeeds[key])
                let feeds = groupFeedsArray.map(feed => feedUiConverter.createFeed(feed));

                feedsUi[key] = feeds;

            })


        }
        return feedsUi;

    })


