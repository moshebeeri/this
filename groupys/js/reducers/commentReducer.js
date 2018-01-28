const initialState = {
    comments: [],
    groupComments: {},
    groupCommentsOrder: {},
    groupUnreadComments:{},
    loadingDone: {},
    showTopLoader: {},
    clientMessages: {},
    update: false,
    lastCall: {},
    lastInstanceId: 0
};
import {REHYDRATE} from "redux-persist/constants";
import * as actions from "./reducerActions";

export default function comment(state = initialState, action) {
    if (action.type === REHYDRATE) {

        // retrive stored data for reducer callApi
        const savedData = action.payload || initialState;
        return {
            ...state, ...savedData.comments
        };
    }
    let currentState = {...state};
    let clientMessage = currentState.clientMessages;
    let groupsComment = currentState.groupComments;
    switch (action.type) {
        case actions.UPSERT_GROUP_COMMENT :
            action.item.forEach(comment => {
                if (!groupsComment[action.gid]) {
                    groupsComment[action.gid] = {}
                }
                groupsComment[action.gid][comment._id] = comment;
                if (!currentState.groupCommentsOrder[action.gid]) {
                    currentState.groupCommentsOrder[action.gid] = [];
                }
                if (!currentState.groupCommentsOrder[action.gid].includes(comment._id)) {
                    currentState.groupCommentsOrder[action.gid].push(comment._id);
                }
            });
            currentState.update = !currentState.update;
            currentState.lastInstanceId = groupsComment[action.gid][currentState.groupCommentsOrder[action.gid]
                [currentState.groupCommentsOrder[action.gid].length - 1]].entities.instance._id;
            return currentState;
        case actions.UPSERT_GROUP_TOP_COMMENT :
            action.item.forEach(comment => {
                if (!groupsComment[action.gid]) {
                    groupsComment[action.gid] = {}
                }
                groupsComment[action.gid][comment._id] = comment;
                if (!currentState.groupCommentsOrder[action.gid]) {
                    currentState.groupCommentsOrder[action.gid] = [];
                }
                if (!currentState.groupUnreadComments[action.gid]) {
                    currentState.groupUnreadComments[action.gid] = [];
                }

                if (!currentState.groupCommentsOrder[action.gid].includes(comment._id)) {
                    if(comment.user._id !== action.user._id) {
                        currentState.groupUnreadComments[action.gid] = currentState.groupUnreadComments[action.gid] + 1;
                    }
                    currentState.groupCommentsOrder[action.gid].unshift(comment._id);
                }
            });
            currentState.lastInstanceId = groupsComment[action.gid][currentState.groupCommentsOrder[action.gid]
                [currentState.groupCommentsOrder[action.gid].length - 1]].entities.instance._id;
            currentState.update = !currentState.update;
            return currentState;
        case actions.CLEAR_GROUP_COMMENT_UNREAD:
            if (currentState.groupUnreadComments[action.gid]) {
                currentState.groupUnreadComments[action.gid] = 0;
            }
            return currentState;

        case actions.GROUP_COMMENT_LOADING_DONE:
            currentState.loadingDone[action.gid] = action.loadingDone;
            return currentState;
        case actions.GROUP_COMMENT_LAST_CALL:
            currentState.lastCall[action.gid] = action.lastCall;
            return currentState;
        case actions.GROUP_COMMENT_SHOW_TOP_LOADER:
            currentState.showTopLoader[action.gid] = action.showTopLoader;
            return currentState;
        case actions.GROUP_COMMENT_ADD_MESSAGE:

            if (!clientMessage[action.groupId]) {
                clientMessage[action.groupId] = [];
            }
            clientMessage[action.groupId].push(action.message);
            return currentState;
        case actions.GROUP_COMMENT_CLEAR_MESSAGE:
            if (!clientMessage[action.groupId]) {
                clientMessage[action.groupId] = {};
            }
            clientMessage[action.groupId] = [];
            return currentState;
        default:
            return state;
    }
};