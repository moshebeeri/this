import * as actions from "../reducers/reducerActions";
import PostApi from "../api/post";
import PageRefresher from '../refresh/pageRefresher'
import ActionLogger from './ActionLogger'
import handler from './ErrorHandler'
import * as types from '../sega/segaActions';
let postApi = new PostApi();
let logger = new ActionLogger();

export function createPost(post, navigation) {
    return async function (dispatch, getState) {
        try {
            dispatch({
                type: actions.POST_SAVING,
            });
            const token = getState().authentication.token;
            await postApi.createPost(post, uploadPostPic, token);
            const user = getState().user.user;
            const feedOrder = getState().feeds.feedView;
            dispatch({
                type: types.CANCEL_MAIN_FEED_LISTENER,
            });
            dispatch({
                type: types.LISTEN_FOR_MAIN_FEED,
                id: feedOrder[0],
                token: token,
                user: user,
            });
            dispatch({
                type: actions.POST_SAVING_DONE,
            });
            navigation.goBack();
            handler.handleSuccses(getState(), dispatch)
        } catch (error) {
            handler.handleError(error, dispatch, 'posts-createPost')
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

            const user = getState().user.user;
            const feedOrder = getState().groups.groupFeedOrder[group._id];
            if(feedOrder){
                dispatch({
                    type: types.CANCEL_GROUP_FEED_LISTENER,
                });
                if (feedOrder && feedOrder.length > 0) {
                    dispatch({
                        type: types.LISTEN_FOR_GROUP_FEED,
                        id: feedOrder[0],
                        group:group,
                        token: token,
                        user: user,
                    });
                }
            }
            dispatch({
                type: actions.POST_SAVING_DONE,
            });
            navigation.goBack();
            handler.handleSuccses(getState(), dispatch)
        } catch (error) {
            handler.handleError(error, dispatch, 'posts-createGroupPost')
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
        handler.handleError(error, dispatch, 'posts-fetchPostById')
        logger.actionFailed('posts-fetchPostById')
    }
}

export default {
    fetchPostById,
};