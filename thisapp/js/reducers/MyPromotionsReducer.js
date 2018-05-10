const initialState = {
    shouldUpdateFeeds: {},
    feeds: {},
    feedToSavedFeed: {},
    feedOrder: [],
    showTopLoader: false,
    update: false,
    lastfeed: undefined,
    lastCall: {},
    firstTime: true,
    shouldRender: true
};
import {REHYDRATE} from "redux-persist/constants";
import * as actions from "./reducerActions";

export default function myPromotions(state = initialState, action) {
    //console.log(action.type);
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
        case actions.SAVE_FEED_UPDATED:
            feedstate.shouldUpdateFeeds[action.id] = false;
            return feedstate;
        case actions.SAVED_FEED_LAST_CALL:
            feedstate.lastCall = action.lastCall;
            return feedstate;
        case actions.FETCH_TOP_SAVED_FEEDS:
            if (action.item) {
                action.item.forEach(item => {
                    currentFeeds[item.savedInstance._id] = item;
                    if (!feedstate.feedOrder.includes(item.savedInstance._id)) {
                        feedstate.feedOrder.push(item.savedInstance._id);
                        feedstate.feedToSavedFeed[item.savedInstance.instance._id] = item.savedInstance._id;
                    }
                });
                feedstate.shouldRender = true;
                return feedstate
            }
            return state;
        case actions.UPSERT_SAVED_FEEDS:
            if (action.item) {
                action.item.forEach(item => {
                    currentFeeds[item.savedInstance._id] = item;
                    if (!feedstate.feedOrder.includes(item.savedInstance._id)) {
                        feedstate.feedOrder.unshift(item.savedInstance._id);
                        feedstate.feedToSavedFeed[item.savedInstance.instance._id] = item.savedInstance._id;
                        feedstate.shouldUpdateFeeds[item.savedInstance._id] = true;
                    }
                });
                feedstate.lastCall = new Date();
                feedstate.shouldRender = true;
                return feedstate
            }
            return state;
        case actions.UPDATE_SINGLE_SAVED_INSTANCE:
            currentFeeds[action.item.savedInstance._id] = action.item;
            feedstate.shouldUpdateFeeds[action.item.savedInstance._id] = true;
            feedstate.shouldRender = true;
            feedstate.update = !feedstate.update
            return feedstate
        case actions.SAVE_PROMOTION_FIRST_TIME_FEED:
            return {
                ...state,
                firstTime: false
            };
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
        case actions.SAVED_PROMOTION_STOP_RENDER:
            return {
                ...state,
                shouldRender: false
            };
        default:
            return state;
    }
};
