import ProfilenApi from "../api/profile";
import * as actions from "../reducers/reducerActions";
import ActionLogger from './ActionLogger'
import handler from './ErrorHandler'
import SavedPromotionComperator from "../reduxComperators/SavedPromotionComperator"
import * as types from '../saga/sagaActions';
import asyncListener from "../api/AsyncListeners";
let profileApi = new ProfilenApi();
let logger = new ActionLogger();
let savedPromotionComperator = new SavedPromotionComperator();

export function setNextFeeds() {
    return async function (dispatch, getState) {
        try {
            const token = getState().authentication.token;
            const user = getState().user.user;
            const feeds = getState().myPromotions.feeds;
            if (!user)
                return;
            dispatch({
                type: types.SAVE_MYPROMOTIONS_REQUEST,
                token: token,
                feeds: feeds,
            });
        } catch (error) {
            handler.handleError(error, dispatch, 'mypromotons-setNextFeeds')
            await logger.actionFailed('mypromotons-setNextFeeds')
        }
    }
}

export function stopReneder() {
    return async function (dispatch) {
        dispatch({
            type: actions.SAVED_PROMOTION_STOP_RENDER,
        });
    }
}

export function setFirstTime() {
    return async function (dispatch, getState) {
        try {
            const token = getState().authentication.token;
            const user = getState().user.user;
            const feeds = getState().myPromotions.feeds;
            if (!user)
                return;
            if (!feeds || Object.keys(feeds).length === 0) {
                dispatch({
                    type: types.SAVE_MYPROMOTIONS_REQUEST,
                    token: token,
                    feeds: feeds,
                });
            }
        } catch (error) {
            handler.handleError(error, dispatch, 'mypromotons-setNextFeeds')
            await logger.actionFailed('mypromotons-setNextFeeds')
        }
    }
}

export function setSavedPromotions(response, feedId) {
    return {
        type: actions.UPSERT_SAVED_FEEDS,
        item: response
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
            handler.handleSuccses(getState(), dispatch)
        } catch (error) {
            handler.handleError(error, dispatch, 'mypromotons-fetchTop')
            dispatch({
                type: actions.SAVED_FEED_SHOW_TOP_LOADER,
                showTopLoader: false,
            });
            await logger.actionFailed('mypromotons-fetchTop')
        }
    }
}

async function fetchTopList(token, dispatch) {
    try {
        let response = await profileApi.fetch(token, 0, 10);
        if (response.length === 0) {
            return;
        }
        if (savedPromotionComperator.shuoldAddInstances(response)) {
            dispatch({
                type: actions.FETCH_TOP_SAVED_FEEDS,
                item: response
            });
        }
    } catch (error) {
        handler.handleError(error, dispatch, 'fetchTopList-mainfeeds')
        await logger.actionFailed('fetchTopList-mainfeeds')
    }
}

async function updateInstance(token, dispatch, id) {
    try {
        let response = await profileApi.getSavedInstance(token, id);
        dispatch({
            type: actions.UPDATE_SINGLE_SAVED_INSTANCE,
            item: response
        });
        //TODO check this
        if(response.promotion) {
            asyncListener.syncChange('promotion_' + response.promotion, 'save');
        }
    } catch (error) {
        handler.handleError(error, dispatch, 'fetchTopList-mainfeeds')
        await logger.actionFailed('fetchTopList-mainfeeds')
    }
}

export function updateSavedInstance(item) {
    return async function (dispatch, getState) {
        try {
            const token = getState().authentication.token;
            let response = await profileApi.getSavedInstance(token, item.id);
            //if(savedPromotionComperator.shuoldUpdateInstance(response)) {
            dispatch({
                type: actions.UPDATE_SINGLE_SAVED_INSTANCE,
                item: response
            });
            // }
            handler.handleSuccses(getState(), dispatch)
        } catch (error) {
            handler.handleError(error, dispatch, 'feed-getFeedSocialState')
            await logger.actionFailed('getFeedSocialState')
        }
    }
}

export default {
    fetchTopList,
    updateInstance
}
