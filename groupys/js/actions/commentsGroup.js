import CommentsApi from "../api/commet";
import * as actions from "../reducers/reducerActions";

let commentsApi = new CommentsApi();

export function fetchTop(feeds, token, entity, group) {
    return fetchTopComments(group, entity);
}

export function fetchTopComments(group) {
    return async function (dispatch, getState) {
        try {
            const token = getState().authentication.token;
            let response = await commentsApi.getGroupComments(group, token, 0, 10);
            if (!getState().comments.loadingDone[group._id]) {
                dispatch({
                    type: actions.GROUP_COMMENT_LOADING_DONE,
                    loadingDone: true,
                    gid: group._id,
                });
            }
            if (response.length > 0) {
                dispatch({
                    type: actions.UPSERT_GROUP_TOP_COMMENT,
                    item: response,
                    gid: group._id,
                });
                dispatch({
                    type: actions.GROUP_COMMENT_CLEAR_MESSAGE,
                    groupId: group._id,
                });
            }
        } catch (error) {

            dispatch({
                type: actions.NETWORK_IS_OFFLINE,
            });
        }
    }
}

export function sendMessage(groupId, message) {
    return async function (dispatch, getState) {
        try {
            const token = getState().authentication.token;
            const user = getState().user.user;
            const instanceId = getState().comments.lastInstanceId;
            let messageItem = createMessage(message, user);
            dispatch({
                type: actions.GROUP_COMMENT_ADD_MESSAGE,
                groupId: groupId,
                message: messageItem
            });
            commentsApi.createComment(groupId, instanceId, message, token)
        } catch (error) {
            dispatch({
                type: actions.NETWORK_IS_OFFLINE,
            });
        }
    }
}

function createMessage(message, user) {
    return {
        activity: {
            actor_user: user,
            message: message,
            action: 'group_message',
            timestamp: new Date().toLocaleString(),
        },
        _id: Math.random(),
    }
}

export function setNextFeeds(comments, group) {
    return async function (dispatch, getState) {
        try {
            const token = getState().authentication.token;
            const user = getState().user.user;
            if (!user)
                return;

            let response;

            if (comments && comments.length > 0) {
                response = await commentsApi.getGroupComments(group, token, comments.length, comments.length + 10);
            } else {
                response = await commentsApi.getGroupComments(group, token, 0, 10);
            }

            if (!getState().comments.loadingDone[group._id]) {
                dispatch({
                    type: actions.GROUP_COMMENT_LOADING_DONE,
                    loadingDone: true,
                    gid: group._id,
                });
            }
            if (response.length > 0) {

                dispatch({
                    type: actions.UPSERT_GROUP_COMMENT,
                    item: response,
                    gid: group._id,
                });
                dispatch({
                    type: actions.GROUP_COMMENT_LAST_CALL,
                    lastCall: new Date(),
                    gid: group._id,
                });
            }
        } catch (error) {
            dispatch({
                type: actions.NETWORK_IS_OFFLINE,
            });
        }
    }
}