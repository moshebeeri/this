import CommentsApi from "../api/commet";
import asyncListener from "../api/AsyncListeners";
import SyncUtils from "../sync/SyncerUtils";
import * as actions from "../reducers/reducerActions";
import ActionLogger from './ActionLogger'
import handler from './ErrorHandler'
import * as types from '../sega/segaActions';
import {put} from 'redux-saga/effects'

let commentsApi = new CommentsApi();
let logger = new ActionLogger();

export function sendMessage(groupId, message, instanceId) {
    return async function (dispatch, getState) {
        try {
            const token = getState().authentication.token;
            const user = getState().user.user;
            SyncUtils.addGroupChatSync(dispatch, getState(), groupId);
            let messageItem = createMessage(message, user);
            dispatch({
                type: actions.GROUP_COMMENT_ADD_MESSAGE,
                groupId: groupId,
                message: messageItem
            });
            await commentsApi.createComment(groupId, instanceId, message, token);
            if (getState().instances.instances[instanceId] && getState().instances.instances[instanceId].promotion) {
                asyncListener.syncChange('promotion_' + getState().instances.instances[instanceId].promotion, 'add-comment');
            }
            asyncListener.syncChange("group_chat_" + groupId, {comment: message})
            asyncListener.syncChange('group_' + groupId, 'addComment')
            handler.handleSuccses(getState(), dispatch)
        } catch (error) {
            handler.handleError(error, dispatch, 'sendMessage-group');
            await logger.actionFailed('sendMessage');
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

export function setNextFeeds(group) {
    return async function (dispatch, getState) {
        try {
            const token = getState().authentication.token;
            const user = getState().user.user;
            if (!user)
                return;
            const groupcomments = getState().comments.groupCommentsOrder[group._id];
            if (getState().comments.maxCallDone[group._id] && groupcomments.length > 0) {
                return;
            }
            dispatch({
                type: types.GROUP_CHAT_SCROLL_UP,
                comments: groupcomments,
                token: token,
                group: group,
            });
            handler.handleSuccses(getState(), dispatch)
        } catch (error) {
            handler.handleError(error, dispatch, 'commentsApi.getGroupComments')
            await logger.actionFailed('commentsApi.getGroupComments')
        }
    }
}

export function groupChatDone(group) {
    return {
        type: actions.GROUP_COMMENT_LOADING_DONE,
        loadingDone: true,
        gid: group._id,
    }
}

export function groupChatMaxLoad(group) {
    return {
        type: actions.GROUP_COMMENT_MAX,
        gid: group._id,
    }
}

export function groupChatMaxLoaddNotReturned(group) {
    return {
        type: actions.GROUP_COMMENT_MAX_NOT_RETRUNED,
        gid: group._id,
    }
}

export function* updateChatScrollUp(response, group) {
    yield put({
        type: actions.UPSERT_GROUP_COMMENT,
        item: response,
        gid: group._id,
    });
    yield put({
        type: actions.GROUP_COMMENT_CLEAR_MESSAGE,
        groupId: group._id,
    });
}

export function* updateChatTop(response, group, user) {
    yield put({
        type: actions.UPSERT_GROUP_TOP_COMMENT,
        item: response,
        gid: group._id,
        user: user
    });
    yield put({
        type: actions.GROUP_COMMENT_CLEAR_MESSAGE,
        groupId: group._id,
    });
}
