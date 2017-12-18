const initialState = {
    groups: {},
    groupFeedOrder: {},
    groupFeeds: {},
    groupFeedsUnread: {},
    update: false,
    loadingDone: {},
    showTopLoader: {},
    lastFeed: {},
    lastFeedTime: {},
    saving: false
};
import {REHYDRATE} from "redux-persist/constants";
import * as actions from "./reducerActions";

export default function group(state = initialState, action) {
    if (action.type === REHYDRATE) {

        // retrive stored data for reducer callApi
        const savedData = action.payload || initialState;
        return {
            ...state, ...savedData.groups
            , saving: false, showTopLoader: {}
        };
    }
    let imutableState = {...state};
    let currentGroups = imutableState.groups;
    switch (action.type) {
        case actions.UPSERT_SINGLE_GROUP:
            currentGroups[action.group._id] = action.group;
            imutableState.update = !imutableState.update;
            return imutableState;
        case actions.UPSERT_GROUP:
            action.item.forEach(eventItem => {
                if((eventItem.preview.comment && eventItem.preview.comment.created)  ||
                    (eventItem.preview.instance_activity && eventItem.preview.instance_activity.action) ){
                    currentGroups[eventItem._id] = eventItem;
                }
            });
            return imutableState;
        case actions.UPSERT_GROUP_FEEDS_BOTTOM:
            action.groupFeed.forEach(item => {
                if (!imutableState.groupFeeds[action.groupId]) {
                    imutableState.groupFeeds[action.groupId] = {};
                    imutableState.groupFeedOrder[action.groupId] = [];
                }
                imutableState.groupFeeds[action.groupId][item._id] = item;
                if (!imutableState.groupFeedOrder[action.groupId].includes(item._id)) {
                    imutableState.groupFeedOrder[action.groupId].push(item._id);
                }
            });
            imutableState.update = !imutableState.update;
            return imutableState;
        case actions.UPDATE_FEED_GROUP_UNREAD:
            action.feeds.forEach(item => {
                    if (item.activity.post && item.activity.post.creator._id !== action.user._id) {
                        imutableState.groupFeedsUnread[action.groupId] = imutableState.groupFeedsUnread[action.groupId] + 1;
                    }
                    if (item.activity.promotion && item.activity.promotion.creator && item.activity.promotion.creator._id !== action.user._id) {
                        imutableState.groupFeedsUnread[action.groupId] = imutableState.groupFeedsUnread[action.groupId] + 1;
                    }
                }
            );
            return imutableState;
        case actions.UPSERT_GROUP_FEEDS_TOP:
            action.groupFeed.forEach(item => {
                if (!imutableState.groupFeeds[action.groupId]) {
                    imutableState.groupFeeds[action.groupId] = {};
                    imutableState.groupFeedOrder[action.groupId] = [];
                }
                if (!imutableState.groupFeedsUnread[action.groupId]) {
                    imutableState.groupFeedsUnread[action.groupId] = 0;
                }
                imutableState.groupFeeds[action.groupId][item._id] = item;
                if (!imutableState.groupFeedOrder[action.groupId].includes(item._id)) {
                    imutableState.groupFeedOrder[action.groupId].unshift(item._id);
                }
            });
            imutableState.update = !imutableState.update;
            return imutableState;
        case actions.GROIP_CLEAR_UNREAD_POST:
            if (imutableState.groupFeedsUnread[action.gid]) {
                imutableState.groupFeedsUnread[action.gid] = 0;
            }
            return imutableState;
        case actions.GROUP_FEED_LOADING_DONE:
            let loadingDone = imutableState.loadingDone;
            loadingDone[action.groupId] = action.loadingDone;
            return imutableState;
        case actions.GROUP_FEED_SHOWTOPLOADER:
            let topLoader = imutableState.showTopLoader;
            topLoader[action.groupId] = action.showTopLoader;
            return imutableState;
        case actions.GROUP_LAST_FEED_DOWN:
            imutableState.lastFeed[action.groupId] = action.id;
            imutableState.lastFeedTime[action.groupId] = new Date().getTime();
            return imutableState;
        case 'GET_GROUPS_BUSINESS' :
            imutableState['groups' + action.bid] = action.groups;
            return imutableState;
        case actions.GROUP_SAVING:
            return {
                ...state,
                saving: true,
            };
        case actions.GROUP_SAVING_DONE:
            return {
                ...state,
                saving: false,
            };
        default:
            return state;
    }
};