import CommentsApi from "../api/commet";
import * as actions from "../reducers/reducerActions";
import ActionLogger from './ActionLogger'
import handler from './ErrorHandler'

let commentsApi = new CommentsApi();
let logger = new ActionLogger();

async function getInstanceGroupComments(state, dispatch, group, instance, size, token) {
    try {
        let response = await commentsApi.getInstanceGroupComments(group, instance, size, token);
        if (response.length > 0) {
            dispatch({
                type: 'GET_INSTANCE_GROUP_COMMENTS',
                comments: response,
                gid: group,
                instanceId: instance
            });
        }
        handler.handleSuccses(state, dispatch)
    } catch (error) {
        handler.handleError(error, dispatch, 'getInstanceGroupComments')
        logger.actionFailed('getInstanceGroupComments');
    }
}

async function getGroupComments(state, dispatch, group, token) {
    try {
        let response = await commentsApi.getGroupComments(group, token, 0, 100);
        if (response.length > 0) {
            dispatch({
                type: 'GET_GROUP_COMMENTS',
                groupcomments: response,
                gid: group,
            });
        }
        handler.handleSuccses(state, dispatch)
    } catch (error) {
        handler.handleError(error, dispatch, 'getGroupComments')
        logger.actionFailed('getGroupComments');
    }
}

async function getEntityComments(state, dispatch, entities, id, token) {
    try {
        let response = await commentsApi.getComment(entities, token);
        dispatch({
            type: 'GET_COMMENTS',
            comments: response,
            id: id,
        });
        handler.handleSuccses(state, dispatch)
    } catch (error) {
        handler.handleError(error, dispatch, 'getComment')
        logger.actionFailed('getComment');
    }
}

export function fetchInstanceGroupComments(group, instance, size) {
    return function (dispatch, getState) {
        const token = getState().authentication.token;
        getInstanceGroupComments(getState(), dispatch, group, instance, size, token);
    }
}

export function fetchEntityComments(entities, id) {
    return function (dispatch, getState) {
        const token = getState().authentication.token;
        getEntityComments(getState(), dispatch, entities, id, token);
    }
}

export function updateEntityComments(id, comment) {
    return function (dispatch) {
        dispatch({
            type: 'UPDATE_COMMENTS',
            comment: comment,
            id: id,
        });
    }
}

export function updateInstanceEntityComments(group, instance, comment) {
    return function (dispatch) {
        dispatch({
            type: 'UPDATE_INSTANCE_COMMENTS',
            comment: comment,
            gid: group,
            instanceId: instance
        });
    }
}

export function fetchGroupComments(group) {
    return function (dispatch, getState) {
        const token = getState().authentication.token;
        dispatch(getGroupComments(getState(), dispatch, group, token));
    }
}

export function setNextFeeds(comments, token, group) {
    return async function (dispatch, getState) {
        try {
            const token = getState().authentication.token;
            const user = getState().user.user;
            if (!user)
                return;
            if (getState().comments.lastCall[group._id]) {
                if (new Date().getTime() - new Date(getState().comments.lastCall[group._id]).getTime() < 10000) {
                    return;
                }
            }
            if (_.isEmpty(comments)) {
                dispatch({
                    type: actions.GROUP_COMMENT_LOADING_DONE,
                    loadingDone: false,
                    gid: group._id
                });
            }
            let response;
            if (comments && comments.length > 0) {
                response = await commentsApi.getGroupComments(group, token, comments[group._id].length, comments[group._id].length + 10);
            } else {
                response = await commentsApi.getGroupComments(group, token, 0, 10);
            }
            dispatch({
                type: actions.GROUP_COMMENT_LAST_CALL,
                lastCall: new Date(),
                gid: group._id
            });
            dispatch({
                type: actions.GROUP_COMMENT_LOADING_DONE,
                loadingDone: true,
                gid: group._id
            });
            if (response.length > 0) {
                response.forEach(item => dispatch({
                    type: actions.UPSERT_GROUP_COMMENT,
                    item: item,
                    gid: group._id,
                }))
            }
            handler.handleSuccses(getState(), dispatch)
        } catch (error) {
            handler.handleError(error, dispatch, 'getGroupComments')
            logger.actionFailed('getGroupComments');
        }
    }
}