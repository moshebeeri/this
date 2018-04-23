import {createSelector} from "reselect";
import FeedUiConverter from "../api/feed-ui-converter";
import InstanceLifeCycle from '../utils/InstanceLifeCycle'

let feedUiConverter = new FeedUiConverter();
const getStateFeeds = (state) => state.myPromotions
export const getFeeds = createSelector([getStateFeeds],
    (myPromotions) => {
        let feedsOrder = myPromotions.feedOrder
        let feeds = myPromotions.feeds;
        if(_.isEmpty(feedsOrder)){
            feedsOrder = Object.keys(feeds);
        }
        let instanceLifeCycle = new InstanceLifeCycle(myPromotions.feeds);
        let response = [];
        if (!_.isEmpty(feedsOrder)) {
            let feedArray = feedsOrder.map(feedId => feeds[feedId])
            let nonREalized = feedArray.filter(feed => instanceLifeCycle.nonRealize(getInstanceId(feed)));
            let inActive = feedArray.filter(feed => !instanceLifeCycle.isExpired(getInstanceId(feed)) &&
                !instanceLifeCycle.isActive(getInstanceId(feed)) &&
                !instanceLifeCycle.isReedemed(getInstanceId(feed)));

            let realized = feedArray.filter(feed => instanceLifeCycle.isReedemed(getInstanceId(feed)));
            let expired = feedArray.filter(feed => instanceLifeCycle.isExpired(getInstanceId(feed)));
            response = nonREalized.map((feed) => {
                let savedinstance = feed;
                if (feed.savedInstance) {
                    savedinstance = feed.savedInstance;
                }
                return feedUiConverter.createSavedPromotion(savedinstance, savedinstance._id, instanceLifeCycle)
            });
            response = response.concat(inActive.map((feed) => {
                let savedinstance = feed;
                if (feed.savedInstance) {
                    savedinstance = feed.savedInstance;
                }
                return feedUiConverter.createSavedPromotion(savedinstance, savedinstance._id, instanceLifeCycle)
            }))
            response = response.concat(realized.map((feed) => {
                let savedinstance = feed;
                if (feed.savedInstance) {
                    savedinstance = feed.savedInstance;
                }
                return feedUiConverter.createSavedPromotion(savedinstance, savedinstance._id, instanceLifeCycle)
            }))
            response = response.concat(expired.map((feed) => {
                let savedinstance = feed;
                if (feed.savedInstance) {
                    savedinstance = feed.savedInstance;
                }
                return feedUiConverter.createSavedPromotion(savedinstance, savedinstance._id, instanceLifeCycle)
            }))
        }
        return response;
    });

function getInstanceId(feed) {
    let savedinstance = feed;
    if (feed.savedInstance) {
      return feed.savedInstance._id;
    }
    return savedinstance.instance._id
}