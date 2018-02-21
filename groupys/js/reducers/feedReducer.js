const initialState = {
    feeds: {},
    firstTime: true,
    feedView: [],
    loadingDone: false,
    savedfeeds: [],
    showTopLoader: false,
    update: false,
    lastfeed: undefined,
    maxFeeds:10,
    nextBulkLoad:false,
    updated:false,
    upTime:new Date().getTime(),
    renderFeed: true,
    maxFeedReturned: false,
    stopDispatchMaxFeed:false,
    shouldRender:true
};
import {REHYDRATE} from "redux-persist/constants";
import * as actions from "./reducerActions";

export default function feeds(state = initialState, action) {
    if (action.type === REHYDRATE) {

        // retrieve stored data for reducer callApi
        const savedData = action.payload || initialState;
        return {
            ...state,
            ...savedData.feeds,
            showTopLoader: false,
            nextBulkLoad:false,
            shouldRender:true,
            upTime:new Date().getTime()
        };
    }
    let feedstate = {...state};
    let currentFeeds = feedstate.feeds;
    switch (action.type) {

        case actions.FEED_UPDATE_SOCIAL_STATE:
        case actions.LIKE:
        case actions.UNLIKE:
        case actions.SAVE:
        case actions.SHARE:

            return {
                ...state,
                updated:!feedstate.updated,
                renderFeed:true,
                shouldRender:true
            };
        case actions.FIRST_TIME_FEED:
            feedstate.firstTime = false;
            return feedstate;
        case actions.LAST_FEED_DOWN:
            feedstate.lastfeed = action.id;
            return feedstate;
        case actions.UPSERT_FEEDS:
            currentFeeds[action.item._id] = action.item;
            if (action.item && action.item._id && !feedstate.feedView.includes(action.item._id)) {
                feedstate.feedView.push(action.item._id);
            }
            feedstate.feeds = currentFeeds;
            feedstate.renderFeed = true;
            feedstate.shouldRender = true;
            return feedstate;
        case actions.UPSERT_FEEDS_ITEMS:
            action.items.forEach(item => {
                if (item && item._id) {
                    currentFeeds[item._id] = item;
                    if (!feedstate.feedView.includes(item._id)) {
                        feedstate.feedView.push(item._id);
                    }
                }
                feedstate.updated = !feedstate.updated;
            });
            feedstate.feeds = currentFeeds;
            feedstate.renderFeed = true;
            feedstate.shouldRender = true;
            return feedstate;
        case actions.UPSERT_FEEDS_TOP:
            currentFeeds[action.item._id] = action.item;
            if (!feedstate.feedView.includes(action.item._id)) {
                feedstate.feedView.unshift(action.item._id);
            }else{
                feedstate.feedView = feedstate.feedView.filter(item => item !== action.item._id);
                feedstate.feedView.unshift(action.item._id);
            }
            feedstate.feeds = currentFeeds;
            feedstate.renderFeed = true;
            feedstate.shouldRender = true;
            return feedstate;

        case actions.FEED_LOADING_DONE:
            return {
                ...state,
                loadingDone: action.loadingDone,
                shouldRender : true,
            };
        case actions.FEED_SHOW_TOP_LOADER:
            return {
                ...state,
                showTopLoader: action.showTopLoader,
                renderFeed : true,
            };
        case actions.FEEDS_GET_NEXT_BULK:
            return {
                ...state,
                nextBulkLoad: true,
                shouldRender : true
            };
        case actions.FEEDS_GET_NEXT_BULK_DONE:
            return {
                ...state,
                nextBulkLoad: false,
                shouldRender : true,
            };
        case actions.FEEDS_STOP_RENDER:
            return {
                ...state,
                shouldRender: false,
            };

        case actions.FEEDS_START_RENDER:
            return {
                ...state,
                shouldRender: true,
            };


        case actions.FEED_NO_RENDER:
            return {
                ...state,
                shouldRender: false
            };

        case actions.MAX_FEED_RETUNED:
            return {
                ...state,
                maxFeedReturned: true,

            };
        case actions.MAX_FEED_NOT_RETUNED:
            return {
                ...state,
                maxFeedReturned: false,

            };



        default:
            return state;
    }
};

function remove(array, element) {
    return array.filter(e => e !== element);
}
