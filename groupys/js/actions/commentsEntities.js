import CommentsApi from "../api/commet";
import * as actions from "../reducers/reducerActions";
import ActionLogger from './ActionLogger'
import handler from './ErrorHandler'
import * as types from '../sega/segaActions';
import {put} from 'redux-saga/effects'
import asyncListener from "../api/AsyncListeners";
let commentsApi = new CommentsApi();
let logger = new ActionLogger();

export function fetchTop(feeds, token, entities, generalId) {
    return fetchTopComments(entities, generalId);
}

export function fetchTopComments(entities, generalId) {
    return async function (dispatch, getState) {
        try {
            const token = getState().authentication.token;
            if (getState().entityComments.lastCall[generalId]) {
                if (new Date().getTime() - new Date(getState().entityComments.lastCall[generalId]).getTime() < 10000) {
                    return;
                }
            }
            dispatch({
                type: actions.ENTITIES_COMMENT_LAST_CALL,
                lastCall: new Date(),
                generalId: generalId,
            });
            let response = await commentsApi.getComment(entities, token, 0);
            dispatch({
                type: actions.ENTITIES_COMMENT_LOADING_DONE,
                loadingDone: true,
                generalId: generalId,
            });
            dispatch({
                type: actions.ENTITIES_COMMENT_INSTANCE_CLEAR_MESSAGE,
                generalId: generalId,
            });
            if (response.length > 0) {
                response.forEach(item => dispatch({
                    type: actions.UPSERT_ENTITIES_TOP_COMMENT,
                    item: item,
                    generalId: generalId,
                }))
            }
            handler.handleSuccses(getState(), dispatch)
        } catch (error) {
            handler.handleError(error, dispatch, 'fetchTopComments')
            logger.actionFailed('fetchTopComments')
        }
    }
}

export function sendMessage(entities, generalId, message) {
    return async function (dispatch, getState) {
        const token = getState().authentication.token;
        const user = getState().user.user;
        try {
            await commentsApi.createGlobalComment(entities, message, token)
            let messageItem = createMessage(message, user);
            dispatch({
                type: actions.ENTITIES_COMMENT_INSTANCE_ADD_MESSAGE,
                generalId: generalId,
                message: messageItem
            });
            asyncListener.syncChange('social_'+generalId,"addComment" )
            asyncListener.syncChange('instanceMessage_'+generalId,message )
            handler.handleSuccses(getState(), dispatch)
        } catch (error) {
            handler.handleError(error, dispatch, 'createGlobalComment')
            logger.actionFailed('createGlobalComment')
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

export function setNextFeeds(entities, generalId) {
    return async function (dispatch, getState) {
        try {
            const token = getState().authentication.token;
            const user = getState().user.user;
            if (!user)
                return;
            const comments = getState().entityComments.entityCommentsOrder[generalId];
            if (comments && getState().entityComments.maxLoadingDone[generalId] && comments.length > 0) {
                return;
            }
            dispatch({
                type: types.FEED_CHAT_SCROLL_UP,
                token: token,
                generalId: generalId,
                entities: entities,
                comments: comments
            });
            handler.handleSuccses(getState(), dispatch)
        } catch (error) {
            handler.handleError(error, dispatch, 'commentsApi.getComment')
            logger.actionFailed('commentsApi.getComment')
        }
    }
}

export function* updateChatScrollUp(response, generalId) {
    if (response.length > 0) {
        while (item = response.pop()) {
            if(item) {
                yield put({
                    type: actions.UPSERT_ENTITIES_COMMENT,
                    item: item,
                    generalId: generalId,
                })
            }
        }
        yield put({
            type: actions.ENTITIES_COMMENT_INSTANCE_CLEAR_MESSAGE,
            generalId: generalId,
        });
    }
}

export function* updateChatTop(response, generalId,) {
    if (response.length > 0) {
        while (item = response.pop()) {
            if(item) {
                yield put({
                    type: actions.UPSERT_ENTITIES_TOP_COMMENT,
                    item: item,
                    generalId: generalId,
                })
            }
        }
        yield put({
            type: actions.ENTITIES_COMMENT_INSTANCE_CLEAR_MESSAGE,
            generalId: generalId,
        });
    }
}

export function feedChatDone(generalId) {
    return {
        type: actions.ENTITIES_COMMENT_LOADING_DONE,
        loadingDone: true,
        generalId: generalId
    }
}

export function feedChatMaxLoad(generalId) {
    return {
        type: actions.ENTITIES_COMMENT_MAX_LOADING_DONE,
        loadingDone: true,
        generalId: generalId
    }
}

export function feedChatMaxLoaddNotReturned(generalId) {
    return {
        type: actions.ENTITIES_COMMENT_MAX_LOADING_DONE,
        loadingDone: false,
        generalId: generalId
    }
}

