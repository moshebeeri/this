/**
 * Created by roilandshut on 06/09/2017.
 */
import {createSelector} from "reselect";
import * as assemblers from "../actions/collectionAssembler";
import FeedUiConverter from "../api/feed-ui-converter";
import getStore from "../store";
import InstanceLifeCycle from '../utils/InstanceLifeCycle'

let feedUiConverter = new FeedUiConverter();
const getStateFeeds = (state) => state.groups;
const getPosts = (state) => state.postForm;
const getInstance = (state) => state.instances;
const getPromotion = (state) => state.promotions;
const getStateSavedInstances = (state) => state.myPromotions;
const store = getStore();
export const getFeeds = createSelector([getStateFeeds, getPosts, getInstance, getPromotion, getStateSavedInstances],
    (groups, post, instances, promotions, savedPromotion) => {
        const collections = {
            activities: store.getState().activities.activities,
            promotions: promotions.promotions,
            user: store.getState().user.users,
            posts: post.posts,
            businesses: store.getState().businesses.businesses,
            instances: instances.instances,
            products: store.getState().products.products
        };
        let feedsOrder = groups.groupFeedOrder;
        let feeds = groups.groupFeeds;
        let tempFeeds = groups.tempGroupFeeds;
        let clientMessage = groups.clientMessages;
        let feedsUi = new Map();
        let instanceLifeCycle = new InstanceLifeCycle(savedPromotion.feeds,true);
        if (!_.isEmpty(feeds)) {
            Object.keys(feedsOrder).forEach(function (groupId) {
                let groupFeeds = feedsOrder[groupId];
                let groupFeedsArray = groupFeeds.map(feedId => feeds[groupId][feedId])
                let assembledFeeds = groupFeedsArray.map(function (feed) {
                    if (feed.activity && (feed.activity.action === 'group_message' || feed.activity.action === 'group_follow')) {
                        return feed;
                    }
                    return assemblers.assembler(feed, collections);
                });
                if(tempFeeds[groupId]){
                    assembledFeeds = tempFeeds[groupId].concat(assembledFeeds);
                }
                let newFeedsList = assembledFeeds.map(feed => feedUiConverter.createFeed(feed, instanceLifeCycle));
                newFeedsList = newFeedsList.filter(feed => feed);
                newFeedsList = newFeedsList.filter(feed => feed.id);
                newFeedsList = newFeedsList.filter(feed => !feed.blocked);
                feedsUi[groupId] = newFeedsList;
            })
        }
        if (!_.isEmpty(clientMessage)) {
            Object.keys(clientMessage).forEach(function (groupId) {
                let clientMessageFeeds = []
                clientMessage[groupId].forEach(feed => clientMessageFeeds.unshift(feedUiConverter.createFeed(feed)));
                if (feedsUi[groupId]) {
                    feedsUi[groupId] = feedsUi[groupId].concat(clientMessageFeeds);
                } else {
                    feedsUi[groupId] = clientMessageFeeds;
                }
            });
        }
        return feedsUi;
    })


