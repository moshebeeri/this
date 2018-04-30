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
    lastGroupQrcode: '',
    visibleGroup: '',
    visibleFeeds: [],
    maxFeedReturned: {},
    touch: false,
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
    let immutableState = {...state};
    let currentGroups = immutableState.groups;
    switch (action.type) {
        case actions.UPSERT_SINGLE_GROUP:
            currentGroups[action.group._id] = action.group;
            immutableState.update = !immutableState.update;
            return immutableState;
        case actions.UPSERT_GROUP:
            action.item.forEach(eventItem => {
                if (!eventItem.preview) {
                    if (eventItem.pictures.length === 0 && currentGroups[eventItem._id]) {
                        eventItem.pictures = currentGroups[eventItem._id].pictures
                    }
                    currentGroups[eventItem._id] = eventItem;
                } else {
                    if ((eventItem.preview.comment && eventItem.preview.comment.created) || (eventItem.preview.post && eventItem.preview.post.created) ||
                        (eventItem.preview.instance_activity && eventItem.preview.instance_activity.action)) {
                        currentGroups[eventItem._id] = eventItem;
                    }
                }
            });
            return immutableState;
        case actions.UPSERT_GROUP_FEEDS_BOTTOM:
            action.groupFeed.forEach(item => {
                if (!immutableState.groupFeeds[action.groupId]) {
                    immutableState.groupFeeds[action.groupId] = {};
                    immutableState.groupFeedOrder[action.groupId] = [];
                }
                immutableState.groupFeeds[action.groupId][item._id] = item;
                if (!immutableState.groupFeedOrder[action.groupId].includes(item._id)) {
                    immutableState.groupFeedOrder[action.groupId].push(item._id);
                }
            });
            immutableState.update = !immutableState.update;
            return immutableState;
        case actions.UPDATE_FEED_GROUP_UNREAD:
            action.feeds.forEach(item => {
                    if (item.activity.post && item.activity.post.creator._id !== action.user._id) {
                        immutableState.groupFeedsUnread[action.groupId] = immutableState.groupFeedsUnread[action.groupId] + 1;
                    }
                    if (item.activity.promotion && item.activity.promotion.creator && item.activity.promotion.creator._id !== action.user._id) {
                        immutableState.groupFeedsUnread[action.groupId] = immutableState.groupFeedsUnread[action.groupId] + 1;
                    }
                }
            );
            return immutableState;
        case actions.UPSERT_GROUP_FEEDS_TOP:
            action.groupFeed.forEach(item => {
                if (!immutableState.groupFeeds[action.groupId]) {
                    immutableState.groupFeeds[action.groupId] = {};
                    immutableState.groupFeedOrder[action.groupId] = [];
                }
                if (!immutableState.groupFeedsUnread[action.groupId]) {
                    immutableState.groupFeedsUnread[action.groupId] = 0;
                }
                immutableState.groupFeeds[action.groupId][item._id] = item;
                if (!immutableState.groupFeedOrder[action.groupId].includes(item._id)) {
                    immutableState.groupFeedOrder[action.groupId].unshift(item._id);
                }
            });
            immutableState.update = !immutableState.update;
            return immutableState;
        case actions.GROIP_CLEAR_UNREAD_POST:
            if (immutableState.groupFeedsUnread[action.gid]) {
                immutableState.groupFeedsUnread[action.gid] = 0;
            }
            return immutableState;
        case actions.GROUP_FEED_LOADING_DONE:
            let loadingDone = immutableState.loadingDone;
            loadingDone[action.groupId] = action.loadingDone;
            return immutableState;
        case actions.GROUP_FEED_SHOWTOPLOADER:
            let topLoader = immutableState.showTopLoader;
            topLoader[action.groupId] = action.showTopLoader;
            return immutableState;
        case actions.GROUP_LAST_FEED_DOWN:
            immutableState.lastFeed[action.groupId] = action.id;
            immutableState.lastFeedTime[action.groupId] = new Date().getTime();
            return immutableState;
        case actions.UPSERT_GROUP_QRCODE:
            currentGroups[action.group._id].qrcodeSoruce = action.qrcodeSource;
            immutableState.lastGroupQrcode = action.qrcodeSource;
            immutableState.update = !immutableState.update;
            return immutableState;
        case actions.REST_GROUP_QRCODE:
            immutableState.lastGroupQrcode = ''
            immutableState.update = !immutableState.update;
            return immutableState;
        case actions.GET_GROUPS_BUSINESS :
            immutableState['groups' + action.bid] = action.groups;
            return immutableState;
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
        case actions.VISIBLE_FEED:
            return {
                ...state,
                visibleGroup: action.feedId,
            };
        case actions.GROUP_TOUCHED:
            Object.keys(currentGroups).forEach(groupId => {
                if (!currentGroups[groupId].touched)
                    currentGroups[action.groupId].touched = new Date().getTime()
            });
            if (currentGroups[action.groupId])
                currentGroups[action.groupId].touched = new Date().getTime();
            immutableState.update = !immutableState.update;
            return immutableState;
        case actions.VISIBLE_GROUP_FEED:
            let visitedFeeds = [];
            let idIndex = immutableState.groupFeedOrder[action.groupId].findIndex(element => {
                    if (element === action.feedId) {
                        return true;
                    }
                    return false;
                }
            );
            if (idIndex === 0) {
                visitedFeeds.push(immutableState.groupFeedOrder[action.groupId][0]);
            } else {
                visitedFeeds.push(immutableState.groupFeedOrder[action.groupId][idIndex - 1]);
                visitedFeeds.push(immutableState.groupFeedOrder[action.groupId][idIndex]);
            }
            return {
                ...state,
                visibleFeeds: visitedFeeds,
            };
        case actions.MAX_GROUP_FEED_RETUNED:
            immutableState.maxFeedReturned[action.group] = true;
            return immutableState;
        case actions.MAX_GROUP_FEED_NOT_RETUNED:
            immutableState.maxFeedReturned[action.group] = false;
            return immutableState;
        default:
            return state;
    }
};