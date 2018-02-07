import * as actions from "../reducers/reducerActions";
import PostApi from "../api/post";
import PageRefresher from '../refresh/pageRefresher'
import groupAction from './groups'
import ActionLogger from './ActionLogger'

let postApi = new PostApi();
let logger = new ActionLogger();
import  handler from './ErrorHandler'

export function createPost(post, navigation) {
    return async function (dispatch, getState) {
        try {
            dispatch({
                type: actions.POST_SAVING,
            });
            const token = getState().authentication.token;
            await postApi.createPost(post, uploadPostPic, token);
            PageRefresher.setMainFeedRefresh()
            dispatch({
                type: actions.POST_SAVING_DONE,
            });
            navigation.goBack();
            handler.handleSuccses(getState(),dispatch)
        } catch (error) {
             handler.handleError(error,dispatch)
            logger.actionFailed('posts-createPost')
        }
    }
}

export function createGroupPost(post, navigation, group) {
    return async function (dispatch, getState) {
        try {
            dispatch({
                type: actions.POST_SAVING,
            });
            const token = getState().authentication.token;
            await postApi.createPost(post, uploadPostPic, token);
            if (getState().groups.groupFeedOrder && getState().groups.groupFeedOrder[group._id]
                && getState().groups.groupFeedOrder[group._id].length > 0) {
                groupAction.fetchTopList(getState().groups.groupFeedOrder[group._id][0], token, group, dispatch);
            }
            dispatch({
                type: actions.POST_SAVING_DONE,
            });
            navigation.goBack();
            handler.handleSuccses(getState(),dispatch)
        } catch (error) {
             handler.handleError(error,dispatch)
            logger.actionFailed('posts-createGroupPost')
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
        PageRefresher.setMainFeedRefresh()
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
        handler.handleError(error,dispatch)
        logger.actionFailed('posts-fetchPostById')
    }
}

export default {
    fetchPostById,



};