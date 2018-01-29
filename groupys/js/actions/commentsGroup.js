import CommentsApi from "../api/commet";
import * as actions from "../reducers/reducerActions";
import ActionLogger from './ActionLogger'

let commentsApi = new CommentsApi();
let logger = new ActionLogger();

export function fetchTop(feeds, token, entity, group) {
    return fetchTopComments(group, entity);
}

export function fetchTopComments(group) {
    return async function (dispatch, getState) {
        try {
            const token = getState().authentication.token;
            if(!getState().comments.groupCommentsOrder[group._id]){
                return;
            }
            let response = await commentsApi.getGroupComments(group, token, 0, 10);
            if (!getState().comments.loadingDone[group._id]) {
                dispatch({
                    type: actions.GROUP_COMMENT_LOADING_DONE,
                    loadingDone: true,
                    gid: group._id,
                });
            }
            if (response.length > 0) {
                if(getState().comments.groupCommentsOrder[group._id] && getState().comments.groupCommentsOrder[group._id].includes(response[0]._id)){
                    return;
                }

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
            logger.actionFailed('commentsApi.getGroupComments')
        }
    }
}

async function refreshComments(dispatch,token,group,user) {
    try {

        let response = await commentsApi.getGroupComments(group, token, 0, 10);

        if (response.length > 0) {
            dispatch({
                type: actions.UPSERT_GROUP_TOP_COMMENT,
                item: response,
                gid: group._id,
                user: user
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
        logger.actionFailed('refreshComments')
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
            logger.actionFailed('sendMessage')
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

export function clearUnreadComments(group) {
    return async function (dispatch,getState) {
        let groupUnred = getState().comments.groupUnreadComments[group._id];
        if(groupUnred && groupUnred > 0) {
            dispatch({
                type: actions.CLEAR_GROUP_COMMENT_UNREAD,
                gid: group._id,
            });
        }
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
                response = await commentsApi.getGroupComments(group, token, comments.length + 1, comments.length + 10);
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
            logger.actionFailed('commentsApi.getGroupComments')
        }
    }
}

export default {
    refreshComments
};