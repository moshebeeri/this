import {createSelector} from "reselect";
import FeedUiConverter from "../api/feed-ui-converter";

let feedUiConverter = new FeedUiConverter();
const getStateFeeds = (state) => state.myPromotions
export const getFeeds = createSelector([getStateFeeds],
    (myPromotions) => {
        let feedsOrder = myPromotions.feedOrder
        let feeds = myPromotions.feeds;
        let response = [];
        if (!_.isEmpty(feedsOrder)) {
            let feedArray = feedsOrder.map(feedId => feeds[feedId])

            response = feedArray.map((feed) => {
                let savedinstance = feed;
                if(feed.savedInstance){
                    savedinstance = feed.savedInstance;
                }
                return feedUiConverter.createSavedPromotion(savedinstance, savedinstance._id)
            });
        }
        return response;
    });
