const initialState = {
    feeds: {},
    firstTime: true,
    feedView: [],
    loadingDone: false,
    savedfeeds: [],
    showTopLoader: false,
    update: false,
    lastfeed: undefined
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
            showTopLoader: false
        };
    }
    let feedstate = {...state};
    let currentFeeds = feedstate.feeds;
    switch (action.type) {
        case actions.FIRST_TIME_FEED:
            feedstate.firstTime = false;
            return feedstate;
        case actions.LAST_FEED_DOWN:
            feedstate.lastfeed = action.id;
            return feedstate;
        case actions.UPSERT_FEEDS:
            currentFeeds[action.item._id] = action.item;
            if (!feedstate.feedView.includes(action.item._id)) {
                feedstate.feedView.push(action.item._id);
            }
            feedstate.feeds = currentFeeds;
            return feedstate;
        case actions.UPSERT_FEEDS_ITEMS:
            action.items.forEach(item => {
                currentFeeds[item._id] = item;
                if (!feedstate.feedView.includes(item._id)) {
                    feedstate.feedView.push(item._id);
                }
            });
            feedstate.feeds = currentFeeds;
            return feedstate;
        case actions.UPSERT_FEEDS_TOP:
            currentFeeds[action.item._id] = action.item;
            if (!feedstate.feedView.includes(action.item._id)) {
                feedstate.feedView.unshift(action.item._id);
            }
            feedstate.feeds = currentFeeds;
            return feedstate;
        case actions.FEED_LOADING_DONE:
            return {
                ...state,
                loadingDone: action.loadingDone
            };
        case actions.FEED_SHOW_TOP_LOADER:
            return {
                ...state,
                showTopLoader: action.showTopLoader
            };
        default:
            return state;
    }
};
