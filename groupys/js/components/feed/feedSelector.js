/**
 * Created by roilandshut on 06/09/2017.
 */


import { createSelector } from 'reselect'

import * as assemblers from '../../actions/collectionAssembler';
import  FeedUiConverter from '../../api/feed-ui-converter'

let feedUiConverter = new FeedUiConverter();
export const getFeeds = createSelector( state => {

    const collections = {activities:state.activities.activities,
            promotions:state.promotions.promotions,
            user: state.user.user,
            businesses:state.businesses.businesses,
            instances:state.instances.instances};


    let feedsUi = [];
    if (!_.isEmpty(state.feeds.feeds)) {
        let feedsList = state.feeds;
        let feedArray = Object.keys(feedsList).map(key => feedsList[key])
        let assembledFeeds = feedArray.map(function (feed) {
            return assemblers.assembler(feed, collections);
        })
        feedsUi = assembledFeeds.map(feed => feedUiConverter.createFeed(feed));

    }
    return feedsUi;

})