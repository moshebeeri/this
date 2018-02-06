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
            let nonREalized = feedArray.filter(feed => !checkIfRealized(feed))
            let realized = feedArray.filter(feed => checkIfRealized(feed))
            response = nonREalized.map((feed) => {
                let savedinstance = feed;
                if (feed.savedInstance) {
                    savedinstance = feed.savedInstance;
                }
                return feedUiConverter.createSavedPromotion(savedinstance, savedinstance._id)
            });
            response = response.concat(realized.map((feed) => {
                let savedinstance = feed;
                if (feed.savedInstance) {
                    savedinstance = feed.savedInstance;
                }
                return feedUiConverter.createSavedPromotion(savedinstance, savedinstance._id)
            }))
        }
        return response;
    });


function checkIfRealized(feed){
    let savedinstance = feed;
    if(feed.savedInstance){
        savedinstance = feed.savedInstance;
    }
    if(savedinstance.savedData && savedinstance.savedData && savedinstance.savedData.other ){
        return true;
    }
    if(savedinstance.savedData && savedinstance.savedData.punch_card && savedinstance.savedData.punch_card.number_of_punches){
        let remainPunches =  savedinstance.savedData.punch_card.number_of_punches - savedinstance.savedData.punch_card.redeemTimes.length;
        return remainPunches === 0;
    }

    return false;
}