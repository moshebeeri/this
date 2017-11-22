/**
 * Created by roilandshut on 06/09/2017.
 */
import {createSelector} from "reselect";
import * as assemblers from "../actions/collectionAssembler";
import FeedUiConverter from "../api/feed-ui-converter";
import getStore from "../store";
let feedUiConverter = new FeedUiConverter();

const getStateFeeds = (state) => state.feeds;
const store = getStore();
export const getFeeds = createSelector([ getStateFeeds],
    (feeds) => {
        const collections = {
            activities: store.getState().activities.activities,
            promotions: store.getState().promotions.promotions,
            user: store.getState().user.users,
            businesses: store.getState().businesses.businesses,
            instances: store.getState().instances.instances,
            products: store.getState().products.products
        };
        let feedsUi = [];
        let feedsOrder = feeds.feedView;
        if (feedsOrder.length > 0) {
            try {
                let feedArray = feedsOrder.map(key => feeds.feeds[key]);
                let assembledFeeds = feedArray.map(function (feed) {
                    return assemblers.assembler(feed, collections);
                });
                feedsUi = assembledFeeds.map(feed => feedUiConverter.createFeed(feed));
                feedsUi = feedsUi.filter(feed => feed);
                feedsUi = feedsUi.filter(filter => filter.id);
            } catch (error) {
                return feedsUi;
            }
        }
        return feedsUi;
    });