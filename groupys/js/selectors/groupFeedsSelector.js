/**
 * Created by roilandshut on 06/09/2017.
 */
import {createSelector} from "reselect";
import * as assemblers from "../actions/collectionAssembler";
import FeedUiConverter from "../api/feed-ui-converter";

let feedUiConverter = new FeedUiConverter();
const getActivities = (state) => state.activities;
const getPromotions = (state) => state.promotions;
const getUser = (state) => state.user.users;
const getBusinesses = (state) => state.businesses;
const getInstances = (state) => state.instances;
const getProducts = (state) => state.products;
const getStateFeeds = (state) => state.groups;
export const getFeeds = createSelector([getActivities, getPromotions, getUser, getBusinesses, getInstances, getProducts, getStateFeeds],
    (activities, promotions, user, businesses, instances, products, groups) => {
        const collections = {
            activities: activities.activities,
            promotions: promotions.promotions,
            user: user,
            businesses: businesses.businesses,
            products: products.products,
            instances: instances.instances
        };
        let feedsOrder = groups.groupFeedOrder;
        let feeds = groups.groupFeeds;
        let clientMessage = groups.clientMessages;
        let feedsUi = new Map();
        if (!_.isEmpty(feeds)) {
            Object.keys(feedsOrder).forEach(function (groupId) {
                let assembledFeeds = [];
                let groupFeeds = feedsOrder[groupId];
                let groupFeedsArray = groupFeeds.map(feedId => feeds[groupId][feedId])
                assembledFeeds = groupFeedsArray.map(function (feed) {
                    if (feed.activity && (feed.activity.action === 'group_message' || feed.activity.action === 'group_follow')) {
                        return feed;
                    }
                    return assemblers.assembler(feed, collections);
                });
                let newFeedsList = assembledFeeds.map(feed => feedUiConverter.createFeed(feed));
                newFeedsList = newFeedsList.filter(feed => feed.id);
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


