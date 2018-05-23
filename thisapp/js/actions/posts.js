import * as actions from "../reducers/reducerActions";
import PostApi from "../api/post";
import ActionLogger from './ActionLogger'
import handler from './ErrorHandler'
import * as types from '../saga/sagaActions';

let postApi = new PostApi();
let logger = new ActionLogger();

export function createPost(post, navigation) {
    return async function (dispatch, getState) {
        try {
            const token = getState().authentication.token;
            const user = getState().user.user;
            dispatch({
                type: types.SAVE_POST,
                post: post,
                token: token,
                user: user
            })
            navigation.goBack();
            handler.handleSuccses(getState(), dispatch)
        } catch (error) {
            handler.handleError(error, dispatch, 'posts-createPost')
            await logger.actionFailed('posts-createPost')
        }
    }
}

export function createGroupPost(post, navigation, group) {
    return async function (dispatch, getState) {
        try {

            const token = getState().authentication.token;
            const user = getState().user.user;
            dispatch({
                type: types.SAVE_POST,
                post: post,
                token: token,
                group: group,
                user: user
            })
          //  await postApi.createPost(post, uploadPostPic, token);

            navigation.goBack();
            handler.handleSuccses(getState(), dispatch)
        } catch (error) {
            handler.handleError(error, dispatch, 'posts-createGroupPost')
            await logger.actionFailed('posts-createGroupPost')
        }
    }
}

export function resetForm() {
    return async function (dispatch, getState) {
        dispatch({
            type: actions.RESET_POST_FORM,
        });
    }
}

function uploadPostPic() {
    return function (dispatch, getState) {
        const token = getState().authentication.token;
    }
}

async function fetchPostById(id, token, dispatch) {
    try {
        let response = await postApi.getPost(id, token);
        if (!response)
            return;
        dispatch({
            type: actions.UPSERT_POST,
            item: [response]
        });
    } catch (error) {
        handler.handleError(error, dispatch, 'posts-fetchPostById')
        await logger.actionFailed('posts-fetchPostById')
    }
}


export function setPostActivity(activity, group) {
    if(group) {
        return {
            type: actions.SET_TEMP_FEED,
            activity: activity,
            groupId: group._id,
        }
    }

    return {
        type: actions.SET_TEMP_MAIN_FEED,
        activity: activity,

    }
}

