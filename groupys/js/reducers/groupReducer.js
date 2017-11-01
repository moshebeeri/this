 const initialState = {
    groups: {},
    groupFeedOrder: {},
    groupFeeds: {},
    update: false,
    loadingDone: {},
    showTopLoader: {},
    clientMessages: {},
    lastFeed: {},
    lastFeedTime: {}
};
import {REHYDRATE} from "redux-persist/constants";
import * as actions from "./reducerActions";

export default function group(state = initialState, action) {
    if (action.type === REHYDRATE) {

        // retrive stored data for reducer callApi
        const savedData = action.payload || initialState;
        return {
            ...state, ...savedData.groups
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
                currentGroups[eventItem._id] = eventItem;
            });
            return imutableState;

        case actions.UPSERT_GROUP_FEEDS_BOTTOM:
            if (!imutableState.groupFeeds[action.groupId]) {
                imutableState.groupFeeds[action.groupId] = {};
                imutableState.groupFeedOrder[action.groupId] = [];
            }
            imutableState.groupFeeds[action.groupId][action.groupFeed._id] = action.groupFeed;
            if (!imutableState.groupFeedOrder[action.groupId].includes(action.groupFeed._id)) {
                imutableState.groupFeedOrder[action.groupId].push(action.groupFeed._id);
            }
            imutableState.update = !imutableState.update;
            return imutableState;
        case actions.UPSERT_GROUP_FEEDS_TOP:
            if (!imutableState.groupFeeds[action.groupId]) {
                imutableState.groupFeeds[action.groupId] = {};
                imutableState.groupFeedOrder[action.groupId] = [];
            }
            imutableState.groupFeeds[action.groupId][action.groupFeed._id] = action.groupFeed;
            if (!imutableState.groupFeedOrder[action.groupId].includes(action.groupFeed._id)) {
                imutableState.groupFeedOrder[action.groupId].unshift(action.groupFeed._id);
            }
            imutableState.update = !imutableState.update;
            return imutableState;
        case actions.GROUP_FEED_LOADING_DONE:
            let loadingDone = imutableState.loadingDone;
            loadingDone[action.groupId] = action.loadingDone;
            return imutableState;
        case actions.GROUP_FEED_SHOWTOPLOADER:
            let topLoader = imutableState.showTopLoader;
            topLoader[action.groupId] = action.showTopLoader;
            return imutableState;
        case actions.GROUP_ADD_MESSAGE:
            let clientMessage = imutableState.clientMessages;
            if (!clientMessage[action.groupId]) {
                clientMessage[action.groupId] = [];
            }
            clientMessage[action.groupId].unshift(action.message);
            return imutableState;
        case actions.GROUP_CLEAN_MESSAGES:
            imutableState.clientMessages[action.groupId] = [];
            return imutableState;
        case actions.GROUP_LAST_FEED_DOWN:
            imutableState.lastFeed[action.groupId] = action.id;
            imutableState.lastFeedTime[action.groupId] = new Date().getTime();
            return imutableState;
        case 'GET_GROUPS_BUSINESS' :
            imutableState['groups' + action.bid] = action.groups;
            return imutableState;
        default:
            return state;
    }
};