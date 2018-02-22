import CommentsApi from "../api/commet";
import * as actions from "../reducers/reducerActions";
import ActionLogger from './ActionLogger'
import handler from './ErrorHandler'
import * as types from '../sega/segaActions';
import {put} from 'redux-saga/effects'

let commentsApi = new CommentsApi();
let logger = new ActionLogger();

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
            handler.handleSuccses(getState(), dispatch)
        } catch (error) {
            handler.handleError(error, dispatch, 'instance-group-sendMessage\'')
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

export function setNextFeeds(group, instance) {
    return async function (dispatch, getState) {
        try {
            const token = getState().authentication.token;
            const user = getState().user.user;
            if (!user)
                return;
            let groupInstancesComments = [];
            if (getState().commentInstances.groupCommentsOrder[group._id]) {
                groupInstancesComments = getState().commentInstances.groupCommentsOrder[group._id][instance.id];
            }
            if (getState().commentInstances.groupCommentsMaxDone[group._id] && getState().commentInstances.groupCommentsMaxDone[group._id][instance.id] && groupInstancesComments.length > 0) {
                return;
            }
            dispatch({
                type: types.GROUP_INSTANCE_CHAT_SCROLL_UP,
                comments: groupInstancesComments,
                token: token,
                group: group,
                instance: instance,
            });
            handler.handleSuccses(getState(), dispatch)
        } catch (error) {
            handler.handleError(error, dispatch, 'instance-group-setNextFeeds')
            logger.actionFailed('instance-group-setNextFeeds')
        }
    }
}

export function* restartListenForChat( group, instance, entitiesComents, token) {
    if (entitiesComents && entitiesComents[0] && entitiesComents[0]._id) {
        yield put({
            type: types.CANCEL_GROUP_INSTANCE_CHAT_LISTENER,
        });
        yield put({
            type: types.LISTEN_FOR_GROUP_INSTANCE_CHATS,
            token: token,
            group: group,
            instance: instance,
            lastChatId: entitiesComents[entitiesComents.length - 1]._id
        });
    }
}

export function stopListenForChat() {
    return function (dispatch) {
        dispatch({
            type: types.CANCEL_GROUP_INSTANCE_CHAT_LISTENER,
        })
    }
}

export function startListenForChat(group, instance) {
    return function (dispatch, getState) {
        const token = getState().authentication.token;
        if (getState().commentInstances.groupCommentsOrder[group._id] && getState().commentInstances.groupCommentsOrder[group._id][instance.id]) {
            let entitiesComents = getState().commentInstances.groupCommentsOrder[group._id][instance.id];
            dispatch({
                type: types.LISTEN_FOR_GROUP_INSTANCE_CHATS,
                token: token,
                group: group,
                instance: instance,
                lastChatId: entitiesComents[entitiesComents.length -1]
            })
        }
        else {
            dispatch({
                type: types.LISTEN_FOR_GROUP_INSTANCE_CHATS,
                token: token,
                group: group,
                instance: instance,
                lastChatId: 0
            })
        }
    }
}

export function groupChatDone(group, instance) {
    return {
        type: actions.GROUP_COMMENT_INSTANCE_LOADING_DONE,
        loadingDone: true,
        gid: group._id,
        instanceId: instance.id
    }
}

export function groupChatMaxLoad(group, instance) {
    return {
        type: actions.GROUP_COMMENT_INSTANCE_MAX,
        groupId: group._id,
        instanceId: instance.id,
        loadingDone: true,
    }
}

export function groupChatMaxLoadNotReturned(group, instance) {
    return {
        type: actions.GROUP_COMMENT_INSTANCE_MAX,
        groupId: group._id,
        instanceId: instance.id,
        loadingDone: false,
    }
}

export function* updateChatScrollUp(response, group, instance) {
    if (response.length > 0) {
        while (item = response.pop()) {
            console.log(item);
            if (item) {
                yield put({
                    type: actions.UPSERT_GROUP_INSTANCE_COMMENT,
                    item: item,
                    gid: group._id,
                    instanceId: instance.id
                })
            }
        }
        yield put({
            type: actions.GROUP_COMMENT_INSTANCE_CLEAR_MESSAGE,
            groupId: group._id,
            instanceId: instance.id
        });
    }
}

export function* updateChatTop(response, group, instance) {
    if(response.length > 0) {
        while (item = response.pop()) {
            if (item) {
                yield put({
                    type: actions.UPSERT_GROUP_INSTANCE_TOP_COMMENT,
                    item: item,
                    gid: group._id,
                    instanceId: instance.id
                })
            }
        }
    }
    yield put({
        type: actions.GROUP_COMMENT_INSTANCE_CLEAR_MESSAGE,
        groupId: group._id,
        instanceId: instance.id
    });
}
