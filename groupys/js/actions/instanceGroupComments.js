import CommentsApi from "../api/commet";
import * as actions from "../reducers/reducerActions";
import ActionLogger from './ActionLogger'

let commentsApi = new CommentsApi();
let logger = new ActionLogger();

export function fetchTop(feeds, token, entity, group) {
    return fetchTopComments(group, entity);
}

export function fetchTopComments(group, instance) {
    return async function (dispatch, getState) {
        try {
            const token = getState().authentication.token;
            if (getState().commentInstances.groupLastCall[group._id] && getState().commentInstances.groupLastCall[group._id][instance.id]) {
                if (new Date().getTime() - new Date(getState().commentInstances.groupLastCall[group._id][instance.id]).getTime() < 10000) {
                    return;
                }
            }
            dispatch({
                type: actions.GROUP_COMMENT_INSTANCE_LAST_CALL,
                lastCall: new Date(),
                gid: group._id,
                instanceId: instance.id
            });
            let response = await commentsApi.getInstanceGroupComments(group._id, instance.id, 0, token);
            dispatch({
                type: actions.GROUP_COMMENT_INSTANCE_LOADING_DONE,
                loadingDone: true,
                gid: group._id,
                instanceId: instance.id
            });
            dispatch({
                type: actions.GROUP_COMMENT_INSTANCE_CLEAR_MESSAGE,
                groupId: group._id,
                instanceId: instance.id
            });
            if (response.length > 0) {
                response.forEach(item => dispatch({
                    type: actions.UPSERT_GROUP_INSTANCE_TOP_COMMENT,
                    item: item,
                    gid: group._id,
                    instanceId: instance.id
                }))
            }
        } catch (error) {
            dispatch({
                type: actions.NETWORK_IS_OFFLINE,
            });
            logger.actionFailed('instance-group-fetchTopComments')
        }
    }
}

export function sendMessage(groupId, instanceId, message) {
    return async function (dispatch, getState) {
        try {
            const token = getState().authentication.token;
            const user = getState().user.user;
            commentsApi.createComment(groupId, instanceId, message, token)

            let messageItem = createMessage(message, user);
            dispatch({
                type: actions.GROUP_COMMENT_INSTANCE_ADD_MESSAGE,
                instanceId: instanceId,
                groupId: groupId,
                message: messageItem
            });
        } catch (error) {
            dispatch({
                type: actions.NETWORK_IS_OFFLINE,
            });
            logger.actionFailed('instance-group-sendMessage')
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

export function setNextFeeds(comments, group, instance) {
    return async function (dispatch, getState) {
        try {
            const token = getState().authentication.token;
            const user = getState().user.user;
            if (!user)
                return;
            if (getState().commentInstances.groupLastCall[group._id] && getState().commentInstances.groupLastCall[group._id][instance.id]) {
                if (new Date().getTime() - new Date(getState().commentInstances.groupLastCall[group._id][instance.id]).getTime() < 10000) {
                    return;
                }
            }
            let response;
            if (comments && comments.length > 0) {
                response = await commentsApi.getInstanceGroupComments(group._id, instance.id, comments.length, token);
            } else {
                response = await commentsApi.getInstanceGroupComments(group._id, instance.id, 0, token);
            } feeds[groupId][feedsOrder[groupId][0]]
            dispatch({
                type: actions.GROUP_COMMENT_INSTANCE_LOADING_DONE,
                loadingDone: true,
                gid: group._id,
                instanceId: instance.id
            });
            if (response.length > 0) {
                response.forEach(item => dispatch({
                    type: actions.UPSERT_GROUP_INSTANCE_COMMENT,
                    item: item,
                    gid: group._id,
                    instanceId: instance.id
                }));
                dispatch({
                    type: actions.GROUP_COMMENT_INSTANCE_LAST_CALL,
                    lastCall: new Date(),
                    gid: group._id,
                    instanceId: instance.id
                });
            }
        } catch (error) {
            dispatch({
                type: actions.NETWORK_IS_OFFLINE,
            });
            logger.actionFailed('instance-group-setNextFeeds')
        }
    }
}