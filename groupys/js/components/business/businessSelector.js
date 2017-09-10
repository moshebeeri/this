/**
 * Created by roilandshut on 06/09/2017.
 */


import { createSelector } from 'reselect'

import * as assemblers from '../../actions/collectionAssembler';
import  FeedUiConverter from '../../api/feed-ui-converter'


export const getFeeds = createSelector( state => {



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