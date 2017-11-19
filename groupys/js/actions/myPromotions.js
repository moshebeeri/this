import ProfilenApi from "../api/profile";
import * as actions from "../reducers/reducerActions";

let profileApi = new ProfilenApi();

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
            dispatch({
                type: actions.NETWORK_IS_OFFLINE,
            });
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
            dispatch({
                type: actions.NETWORK_IS_OFFLINE,
            });
            dispatch({
                type: actions.SAVED_FEED_SHOW_TOP_LOADER,
                showTopLoader: false,
            });
        }
    }
}