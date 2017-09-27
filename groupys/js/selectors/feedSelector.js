/**
 * Created by roilandshut on 06/09/2017.
 */
import {createSelector} from 'reselect';
import * as assemblers from '../actions/collectionAssembler';
import  FeedUiConverter from '../api/feed-ui-converter'
let feedUiConverter = new FeedUiConverter();
const getActivities = (state) => state.activities;
const getPromotions = (state) => state.promotions;
const getUser = (state) => state.user;
const getBusinesses = (state) => state.businesses;
const getInstances = (state) => state.instances;
const getStateFeeds = (state) => state.feeds;

export const getFeeds = createSelector(  [ getActivities,getPromotions,getUser,getBusinesses,getInstances,getStateFeeds],
          (activities,promotions,user,businesses,instances,feeds) => {

    const collections = {activities:activities.activities,
                        promotions:promotions.promotions,
                        user: user.users,
                        businesses:businesses.businesses,
                        instances:instances.instances};
    let feedsUi = [];
    let feedsOrder = feeds.feedView;
    if (feedsOrder.length > 0) {
        try {

            let feedArray = feedsOrder.map(key => feeds.feeds[key]);
            let assembledFeeds = feedArray.map(function (feed) {
                return assemblers.assembler(feed, collections);
            });
            feedsUi = assembledFeeds.map(feed => feedUiConverter.createFeed(feed));
        }catch (error){

            return feedsUi;
        }

    }
    return feedsUi;

});