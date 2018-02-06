import ProfilenApi from "../api/profile";
import * as actions from "../reducers/reducerActions";
import ActionLogger from './ActionLogger'
import  handler from './ErrorHandler'
let profileApi = new ProfilenApi();
let logger = new ActionLogger();

export function setNextFeeds(feeds) {
    return async function (dispatch, getState) {
        try {
            const token = getState().authentication.token;
            const user = getState().user.user;
            if (!user)
                return;
            if (getState().myPromotions.lastCall) {
                if (new Date().getTime() - new Date(getState().myPromotions.lastCall).getTime() < 20000) {
                    return;
                }
            }
            if (_.isEmpty(feeds) && getState().myPromotions.firstTime) {
                dispatch({
                    type: actions.SAVE_PROMOTION_FIRST_TIME_FEED,
                });
            }
            let showLoadingDone = false;
            if (_.isEmpty(feeds) && !getState().myPromotions.loadingDone) {
                dispatch({
                    type: actions.SAVED_FEED_LOADING_DONE,
                    loadingDone: false,
                });
                showLoadingDone = true;
            }
            let response;
            if (feeds && feeds.length > 0) {
                response = await profileApi.fetch(token, feeds.length, feeds.length + 10)
            } else {
                response = await profileApi.fetch(token, 0, 10);
            }
            if (showLoadingDone && !getState().myPromotions.loadingDone) {
                dispatch({
                    type: actions.SAVED_FEED_LOADING_DONE,
                    loadingDone: true,
                });
            }
            if (response.length === 0) {
                return;
            }
            dispatch({
                type: actions.UPSERT_SAVED_FEEDS,
                item: response
            });
        } catch (error) {
            handler.handleError(error, dispatch)
            logger.actionFailed('mypromotons-setNextFeeds')
        }
    }
}

export function fetchTop() {
    return async function (dispatch, getState) {
        try {
            const token = getState().authentication.token;
            const user = getState().user.user;
            if (!user)
                return;
            if (getState().myPromotions.lastCall) {
                if (new Date().getTime() - new Date(getState().myPromotions.lastCall).getTime() < 20000) {
                    return;
                }
            }
            dispatch({
                type: actions.SAVED_FEED_LAST_CALL,
                lastCall: new Date(),
            });
            let response = await profileApi.fetch(token, 0, 10);
            dispatch({
                type: actions.SAVED_FEED_SHOW_TOP_LOADER,
                showTopLoader: true,
            });
            if (response.length === 0) {
                return;
            }
            dispatch({
                type: actions.FETCH_TOP_SAVED_FEEDS,
                item: response
            });
            dispatch({
                type: actions.SAVED_FEED_SHOW_TOP_LOADER,
                showTopLoader: false,
            });
        } catch (error) {
            handler.handleError(error, dispatch)
            dispatch({
                type: actions.SAVED_FEED_SHOW_TOP_LOADER,
                showTopLoader: false,
            });
            logger.actionFailed('mypromotons-fetchTop')
        }
    }
}

async function fetchTopList( token, dispatch) {
    try {


        let response = await profileApi.fetch(token, 0, 10);
        if (response.length === 0) {
            return;
        }
        dispatch({
            type: actions.FETCH_TOP_SAVED_FEEDS,
            item: response
        });
    } catch (error) {
        handler.handleError(error,dispatch)
        logger.actionFailed('fetchTopList-mainfeeds')
    }
}

async function updateInstance( token, dispatch,id) {
    try {


        let response = await profileApi.getSavedInstance(token,id);

        dispatch({
            type: actions.UPDATE_SINGLE_SAVED_INSTANCE,
            item: response
        });
    } catch (error) {
        handler.handleError(error,dispatch)
        logger.actionFailed('fetchTopList-mainfeeds')
    }
}


export default {
    fetchTopList,
    updateInstance
}
