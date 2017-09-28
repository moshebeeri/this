const initialState = {feeds: {}, feedOrder: [], showTopLoader: false, update: false, lastfeed: undefined, lastCall: {}};
import {REHYDRATE} from "redux-persist/constants";
import * as actions from "./reducerActions";
export default function myPromotions(state = initialState, action) {
    console.log(action.type);
    if (action.type === REHYDRATE) {

        // retrive stored data for reducer callApi
        const savedData = action.payload || initialState;
        return {
            ...state,
            ...savedData.myPromotions,
            loadingDone: true,
            showTopLoader: false
        };
    }
    let feedstate = {...state};
    let currentFeeds = feedstate.feeds;
    switch (action.type) {
        case actions.SAVED_LAST_FEED_DOWN:
            feedstate.lastfeed = action.id;
            return feedstate;
        case actions.SAVED_FEED_LAST_CALL:
            feedstate.lastCall = action.lastCall;
            return feedstate;
        case actions.FETCH_TOP_SAVED_FEEDS:
            currentFeeds[action.item.instance._id] = action.item;
            if (feedstate.feedOrder.includes(action.item.instance._id)) {
                return state
            }
            feedstate.feedOrder.unshift(action.item.instance._id);
            return feedstate;
        case actions.UPSERT_SAVED_FEEDS:
            currentFeeds[action.item.instance._id] = action.item;
            if (feedstate.feedOrder.includes(action.item.instance._id)) {
                return state
            }
            feedstate.feedOrder.push(action.item.instance._id);
            return feedstate;
        case actions.SAVED_FEED_LOADING_DONE:
            return {
                ...state,
                loadingDone: action.loadingDone
            };
        case actions.SAVED_FEED_SHOW_TOP_LOADER:
            return {
                ...state,
                showTopLoader: action.showTopLoader
            };
        default:
            return state;
    }
};
