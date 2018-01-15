const initialState = {
    comments: [],
    clientMessages: {},
    groupComments: {},
    groupCommentsOrder: {},
    groupLoadingDone: {},
    groupShowTopLoader: {},
    update: false,
    groupLastCall: {}
};
import {REHYDRATE} from "redux-persist/constants";
import * as actions from "./reducerActions";

export default function commentInstances(state = initialState, action) {
    console.log(action.type);
    if (action.type === REHYDRATE) {

        // retrive stored data for reducer callApi
        const savedData = action.payload || initialState;
        return {
            ...state, ...savedData.commentInstances
        };
    }
    let currentState = {...state};
    let clientMessage = currentState.clientMessages;
    switch (action.type) {
        case actions.UPSERT_GROUP_INSTANCE_COMMENT :
            let currentGroupComments = currentState.groupComments;
            if (!currentGroupComments[action.gid]) {
                currentGroupComments[action.gid] = {}
            }
            if (!currentGroupComments[action.gid][action.instanceId]) {
                currentGroupComments[action.gid][action.instanceId] = {}
            }
            currentGroupComments[action.gid][action.instanceId][action.item._id] = action.item;
            if (!currentState.groupCommentsOrder[action.gid]) {
                currentState.groupCommentsOrder[action.gid] = {};
            }
            if (!currentState.groupCommentsOrder[action.gid][action.instanceId]) {
                currentState.groupCommentsOrder[action.gid][action.instanceId] = [];
            }
            if (currentState.groupCommentsOrder[action.gid][action.instanceId].includes(action.item._id)) {
                return state
            }
            currentState.groupCommentsOrder[action.gid][action.instanceId].unshift(action.item._id);
            currentState.update = !currentState.update;
            return currentState;
        case actions.UPSERT_GROUP_INSTANCE_TOP_COMMENT :
            let groupsComment = currentState.groupComments;
            if (!groupsComment[action.gid]) {
                groupsComment[action.gid] = {}
            }
            if (!groupsComment[action.gid][action.instanceId]) {
                groupsComment[action.gid][action.instanceId] = {}
            }
            groupsComment[action.gid][action.instanceId][action.item._id] = action.item;
            if (!currentState.groupCommentsOrder[action.gid]) {
                currentState.groupCommentsOrder[action.gid] = {};
            }
            if (!currentState.groupCommentsOrder[action.gid][action.instanceId]) {
                currentState.groupCommentsOrder[action.gid][action.instanceId] = [];
            }
            if (currentState.groupCommentsOrder[action.gid][action.instanceId].push(action.item._id)) {
                return state
            }
            currentState.groupCommentsOrder[action.gid][action.instanceId].unshift(action.item._id);
            currentState.update = !currentState.update;
            return currentState;
        case actions.GROUP_COMMENT_INSTANCE_LOADING_DONE:
            if (!currentState.groupLoadingDone[action.gid]) {
                currentState.groupLoadingDone[action.gid] = {};
            }
            if (currentState.groupLoadingDone[action.gid][action.instanceId] === action.loadingDone) {
                return state;
            }
            currentState.groupLoadingDone[action.gid][action.instanceId] = action.loadingDone;
            return currentState;
        case actions.GROUP_COMMENT_INSTANCE_LAST_CALL:
            if (!currentState.groupLastCall[action.gid]) {
                currentState.groupLastCall[action.gid] = {}
            }
            currentState.groupLastCall[action.gid][action.instanceId] = action.lastCall;
            return currentState;
        case actions.GROUP_COMMENT_INSTANCE_SHOW_TOP_LOADER:
            if (!currentState.groupShowTopLoader[action.gid]) {
                currentState.groupShowTopLoader[action.gid] = {};
            }
            currentState.groupShowTopLoader[action.gid][action.instanceId] = action.showTopLoader;
            return currentState;
        case actions.GROUP_COMMENT_INSTANCE_ADD_MESSAGE:
            if (!clientMessage[action.groupId]) {
                clientMessage[action.groupId] = {};
            }
            if (!clientMessage[action.groupId][action.instanceId]) {
                clientMessage[action.groupId][action.instanceId] = [];
            }
            clientMessage[action.groupId][action.instanceId].push(action.message);
            return currentState;
        case actions.GROUP_COMMENT_INSTANCE_CLEAR_MESSAGE:
            if (!clientMessage[action.groupId]) {
                clientMessage[action.groupId] = {};
            }
            clientMessage[action.groupId][action.instanceId] = [];
            return currentState;
        default:
            return state;
    }
};