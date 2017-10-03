/**
 * Created by roilandshut on 06/09/2017.
 */
import {createSelector} from 'reselect'
import * as assemblers from '../actions/collectionAssembler';
import FeedUiConverter from '../api/feed-ui-converter'

let feedUiConverter = new FeedUiConverter();
// const getActivities = (state) => state.activities.activities
// const getPromotions = (state) => state.promotions.promotions
// const getUser = (state) => state.user.users
// const getBusinesses = (state) => state.businesses.businesses
// const getInstances = (state) => state.instances.instances
const getStateFeeds = (state) => state.comments
// const getStaate = (state) => state
export const getFeeds = createSelector([getStateFeeds],
    (comments) => {
        let feedsOrder = comments.groupCommentsOrder
        let feeds = comments.groupComments;
        let response = {}
        if (!_.isEmpty(feedsOrder)) {
            Object.keys(feedsOrder).forEach(function (groupId) {
                if (feedsOrder[groupId] && feedsOrder[groupId].length > 0) {
                    feedsOrder[groupId].forEach(function (feedId) {
                        if (!response[groupId]) {
                            response[groupId] = new Array();
                        }
                        response[groupId].push(feedUiConverter.createPromontionInstance(feeds[groupId][feedId]));
                    })
                }
            })
        }
        return response;
    })
/**
 * Created by roilandshut on 14/09/2017.
 */
