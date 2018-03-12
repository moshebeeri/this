/**
 * Created by roilandshut on 06/09/2017.
 */
import {createSelector} from "reselect";
import * as assemblers from "../actions/collectionAssembler";
import FeedUiConverter from "../api/feed-ui-converter";
import getStore from "../store";

let feedUiConverter = new FeedUiConverter();
const getStateFeeds = (state) => state.feeds;
const getStatePosts = (state) => state.postForm;
const getStateBusiness = (state) => state.businesses;
const getStatePromotions = (state) => state.promotions;
const getStateSavedInstances = (state) => state.myPromotions;
const getMainTab = (state) => state.mainTab;
const store = getStore();
export const getFeeds = createSelector([getStateFeeds, getStatePosts, getStateBusiness, getStatePromotions, getStateSavedInstances, getMainTab],
    (feeds, posts, businesses, promotions, savedPromotion, mainTab) => {
        const collections = {
            activities: store.getState().activities.activities,
            promotions: promotions.promotions,
            user: store.getState().user.users,
            posts: posts.posts,
            businesses: businesses.businesses,
            instances: store.getState().instances.instances,
            products: store.getState().products.products
        };
        let feedsUi = [];
        let feedsOrder = feeds.feedView;
        let savedInstancesIds = [];
        if (savedPromotion.feeds) {
            savedInstancesIds = Object.values(savedPromotion.feeds).map(savedFeed => {
                if(savedFeed.savedInstance) {
                    return savedFeed.savedInstance.instance._id
                }
                return savedFeed.instance._id
            });
        }
        if (feedsOrder.length > 0) {
            try {
                let feedArray = feedsOrder.map(key => feeds.feeds[key]);
                let assembledFeeds = feedArray.map(function (feed) {
                    return assemblers.assembler(feed, collections);
                });
                feedsUi = assembledFeeds.map(feed => {
                    try {
                        return feedUiConverter.createFeed(feed, savedInstancesIds);
                    } catch (err) {
                        console.error(err);
                        return undefined;
                    }
                });
                feedsUi = feedsUi.filter(feed => feed);
                feedsUi = feedsUi.filter(filter => filter.id);
                feedsUi = feedsUi.filter(filter => !filter.blocked);
                if (store.getState().render.currentScreen !== 'home') {
                    feedsUi = feedsUi.slice(0, 10)
                    return feedsUi;
                }

                return feedsUi;
            } catch (err) {
                console.error(err)
                return feedsUi;
            }
        }
        return feedsUi;
    });