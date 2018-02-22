/**
 * Created by roilandshut on 08/06/2017.
 */
import FeedApi from "../api/feed";
import UserApi from "../api/user";
import PtomotionApi from "../api/promotion";
import ActivityApi from "../api/activity";
import * as actions from "../reducers/reducerActions";
import * as assemblers from "./collectionAssembler";
import CollectionDispatcher from "./collectionDispatcher";
import ActionLogger from './ActionLogger'
import MainFeedReduxComperator from "../reduxComperators/MainFeedComperator"
import handler from './ErrorHandler'
import * as types from '../sega/segaActions';
import {put} from 'redux-saga/effects'

let feedApi = new FeedApi();
let userApi = new UserApi();
let promotionApi = new PtomotionApi();
let activityApi = new ActivityApi();
let feedComperator = new MainFeedReduxComperator();
let logger = new ActionLogger();

async function getUserFollowers(dispatch, token) {
    try {
        let users = await userApi.getUserFollowers(token);
        dispatch({
            type: 'GET_USER_FOLLOWERS',
            followers: users
        });
    } catch (error) {
        handler.handleError(error, dispatch, 'getUserFollowers')
        logger.actionFailed('getUserFollowers')
    }
}

export function fetchUsersFollowers() {
    return function (dispatch, getState) {
        const token = getState().authentication.token;
        getUserFollowers(dispatch, token)
    }
}

export function setNextFeeds(feeds) {
    return async function (dispatch, getState) {
        const token = getState().authentication.token;
        const user = getState().user.user;
        if (!user)
            return;
        if (getState().feeds.maxFeedReturned && getState().feeds.feedView.length > 0) {
            return;
        }
        dispatch({
            type: types.FEED_SCROLL_DOWN,
            feeds: feeds,
            token: token,
            user: user,
        });
        handler.handleSuccses(getState(), dispatch)
    }
}

export function stopMainFeedsListener() {
    return async function (dispatch) {
        dispatch({
            type: types.CANCEL_MAIN_FEED_LISTENER,
        });
    }
}

export function setTopFeeds() {
    return async function (dispatch, getState) {
        const token = getState().authentication.token;
        const user = getState().user.user;
        const feedOrder = getState().feeds.feedView;
        if (!user)
            return;
        dispatch({
            type: types.CANCEL_MAIN_FEED_LISTENER,
        });
        if (feedOrder && feedOrder.length > 0) {
            dispatch({
                type: types.LISTEN_FOR_MAIN_FEED,
                id: feedOrder[0],
                token: token,
                user: user,
            });
        }
        handler.handleSuccses(getState(), dispatch)
    }
}

export function like(id) {
    return async function (dispatch, getState) {
        try {
            const token = getState().authentication.token
            dispatch({
                type: actions.LIKE,
                id: id
            });
            await userApi.like(id, token);
            handler.handleSuccses(getState(), dispatch)
        } catch (error) {
            handler.handleError(error, dispatch, 'like')
            logger.actionFailed('like')
        }
    }
}

export function refresh(id, currentSocialState) {
    return async function (dispatch, getState) {
        try {
            const token = getState().authentication.token;
            if (new Date().getTime() - getState().feeds.upTime < 360000) {
                return;
            }
            let response = await feedApi.getFeedSocialState(id, token);
            if (feedComperator.shouldUpdateSocial(id, response)) {
                dispatch({
                    type: actions.FEED_UPDATE_SOCIAL_STATE,
                    social_state: response,
                    id: id
                });
            }
            dispatch({
                type: actions.FEEDS_START_RENDER,
            });
            handler.handleSuccses(getState(), dispatch)
            // await userApi.like(id, token);
        } catch (error) {
            handler.handleError(error, dispatch, 'feed-getFeedSocialState')
            logger.actionFailed('getFeedSocialState')
        }
    }
}

async function refreshFeedSocialState(state, dispatch, token, id) {
    try {
        let response = await feedApi.getFeedSocialState(id, token);
        if (feedComperator.shouldUpdateSocial(state, id, response)) {
            dispatch({
                type: actions.FEED_UPDATE_SOCIAL_STATE,
                social_state: response,
                id: id
            });
        }
    } catch (error) {
        handler.handleError(error, dispatch, 'refreshFeedSocialState')
        logger.actionFailed('refreshFeedSocialState')
    }
}

export const unlike = (id) => {
    return async function (dispatch, getState) {
        try {
            const token = getState().authentication.token
            dispatch({
                type: actions.UNLIKE,
                id: id
            });
            await userApi.unlike(id, token);
            handler.handleSuccses(getState(), dispatch)
        } catch (error) {
            handler.handleError(error, dispatch, 'unlike')
            logger.actionFailed('unlike')
        }
    }
};

export function saveFeed(id, navigation, feed) {
    return async function (dispatch, getState) {
        try {
            dispatch({
                type: actions.SAVE,
                id: id
            });
            let savedInstance = await promotionApi.save(id);
            navigation.navigate('realizePromotion', {item: feed, id: savedInstance._id})
            dispatch({
                type: types.SAVE_SINGLE_MYPROMOTIONS_REQUEST,
                item: savedInstance
            })
            handler.handleSuccses(getState(), dispatch)
        } catch (error) {
            handler.handleError(error, dispatch, 'saveFeed')
            logger.actionFailed('saveFeed')
        }
    }
}

export function stopRender() {
    return async function (dispatch) {
        dispatch({
            type: actions.FEEDS_STOP_RENDER,
        })
    }
}

export function setUserFollows() {
    return async function (dispatch, getState) {
        try {
            const token = getState().authentication.token
            let response = await userApi.getUserFollowers(token);
            dispatch({
                type: actions.USER_FOLLOW,
                followers: response
            });
        } catch (error) {
            handler.handleError(error, dispatch, 'getUserFollowers')
            logger.actionFailed('getUserFollowers')
        }
    }
}

export function shareActivity(id, activityId, users, token) {
    return async function (dispatch, getState) {
        try {
            users.forEach(function (user) {
                activityApi.shareActivity(user, activityId, token)
            })
            dispatch({
                type: actions.SHARE,
                id: id,
                shares: users.length
            });
        } catch (error) {
            handler.handleError(error, dispatch, 'shareActivity')
            logger.actionFailed('shareActivity')
        }
    }
}

export function nextLoad() {
    return function (dispatch, getState) {
        dispatch({
            type: 'FEED_LOADING',
        });
    }
}

export function stopReneder() {
    return function (dispatch, getState) {
        dispatch({
            type: actions.FEED_NO_RENDER,
        });
    }
}

export function loadingFeeds() {
    return {
        type: actions.FIRST_TIME_FEED,
    }
}

export function loadingFeedsDone() {
    return {
        type: actions.FEED_LOADING_DONE,
        loadingDone: true,
    }
}

export function scrolling() {
    return {
        type: actions.FEEDS_GET_NEXT_BULK,
    }
}

export function renderFeed() {
    return {
        type: actions.FEEDS_START_RENDER,
    }
}

export function stopScrolling() {
    return {
        type: actions.FEEDS_GET_NEXT_BULK_DONE,
    }
}

export function maxFeedReturned() {
    return {
        type: actions.MAX_FEED_RETUNED,
    }
}

export function maxFeedNotReturned() {
    return {
        type: actions.MAX_FEED_NOT_RETUNED,
    }
}

export function* updateFeeds(feeds) {
    if (feeds) {
        let filteredFeeds = feeds.filter(feed => feedComperator.filterFeed(feed));
        let collectionDispatcher = new CollectionDispatcher();
        let disassemblerItems = filteredFeeds.map(item => assemblers.disassembler(item, collectionDispatcher));
        let keys = Object.keys(collectionDispatcher.events);
        let eventType;
        while (eventType = keys.pop()) {
            yield put({
                type: eventType,
                item: collectionDispatcher.events[eventType]
            });
        }
        yield put({
            type: actions.UPSERT_FEEDS_ITEMS,
            items: disassemblerItems
        })
        yield put({
            type: actions.FEEDS_START_RENDER,
        })
    }
}

export function* updateFeedsTop(feeds) {
    if (feeds) {
        let filteredFeeds = feeds.filter(feed => feedComperator.filterFeed(feed));
        let collectionDispatcher = new CollectionDispatcher();
        let disassemblerItems = filteredFeeds.map(item => assemblers.disassembler(item, collectionDispatcher));
        let keys = Object.keys(collectionDispatcher.events);
        let eventType;
        while (eventType = keys.pop()) {
            yield put({
                type: eventType,
                item: collectionDispatcher.events[eventType]
            });
        }
        while (feedItem = disassemblerItems.pop()) {
            yield put({
                type: actions.UPSERT_FEEDS_TOP,
                item: feedItem
            });
        }
    }
}

export default {
    nextLoad,
    shareActivity,
    setUserFollows,
    saveFeed,
    unlike,
    like,
    refreshFeedSocialState,
};






