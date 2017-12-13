/**
 * Created by roilandshut on 06/09/2017.
 */
import {createSelector} from "reselect";
import * as assemblers from "../actions/collectionAssembler";
import FeedUiConverter from "../api/feed-ui-converter";
import getStore from "../store";
let feedUiConverter = new FeedUiConverter();

const getStateFeeds = (state) => state.groups;
const getPosts = (state) => state.postForm;
const getInstance = (state) => state.instances;
const store = getStore();
export const getFeeds = createSelector([  getStateFeeds,getPosts,getInstance],
    (groups,post,instances) => {
        const collections = {
            activities: store.getState().activities.activities,
            promotions: store.getState().promotions.promotions,
            user: store.getState().user.users,
            posts:post.posts,
            businesses: store.getState().businesses.businesses,
            instances: instances.instances,
            products: store.getState().products.products
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


