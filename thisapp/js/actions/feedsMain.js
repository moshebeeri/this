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
import handler from './ErrorHandler'
import * as types from '../saga/sagaActions';
import {put} from 'redux-saga/effects'
import SyncerUtils from "../sync/SyncerUtils";

let feedApi = new FeedApi();
let userApi = new UserApi();
let promotionApi = new PtomotionApi();
let activityApi = new ActivityApi();
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
            SyncerUtils.invokeSocialChange(id, getState());
            handler.handleSuccses(getState(), dispatch)
        } catch (error) {
            handler.handleError(error, dispatch, 'like')
            logger.actionFailed('like')
        }
    }
}

export function finishUpdateItem(id) {
    return async function (dispatch) {
        dispatch({
            type: actions.SINGLE_FEED_FINISH_UPDATED,
            id: id
        });
    }
}

export function refresh(id) {
    return async function (dispatch, getState) {
    }
}

export function updateFeed(item) {
    return async function (dispatch, getState) {
        try {
            const token = getState().authentication.token;
            dispatch({
                type: types.FEED_UPDATE_ITEM,
                token: token,
                item: item,
            });
            handler.handleSuccses(getState(), dispatch)
        } catch (error) {
            handler.handleError(error, dispatch, 'feed-getFeedSocialState')
            logger.actionFailed('getFeedSocialState')
        }
    }
}

export function updateSavedInstance(item) {
    return async function (dispatch, getState) {
        try {
            const token = getState().authentication.token;
            dispatch({
                type: types.FEED_UPDATE_SAVED_ITEM,
                token: token,
                item: item,
            });
            handler.handleSuccses(getState(), dispatch)
        } catch (error) {
            handler.handleError(error, dispatch, 'feed-getFeedSocialState')
            logger.actionFailed('getFeedSocialState')
        }
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
            SyncerUtils.invokeSocialChange(id, getState());
            handler.handleSuccses(getState(), dispatch)
        } catch (error) {
            handler.handleError(error, dispatch, 'unlike')
            logger.actionFailed('unlike')
        }
    }
};

export function saveFeed(id,) {
    return async function (dispatch, getState) {
        try {
            // prevent user from saving twice the same instance
            let instance = getState().instances.instances[id];
            if (instance && instance.social_state.saved) {
                return;
            }
            dispatch({
                type: actions.SAVE,
                id: id
            });
            let savedInstance = await promotionApi.save(id);
            dispatch({
                type: types.SAVE_SINGLE_MYPROMOTIONS_REQUEST,
                item: savedInstance,
                feedId: id
            })
            SyncerUtils.invokeSocialChange(id, getState());
            handler.handleSuccses(getState(), dispatch)
        } catch (error) {
            dispatch({
                type: actions.SAVE,
                id: id
            });
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

export function finishUpdate() {
    return async function (dispatch) {
        dispatch({
            type: actions.FEEDS_UPDATED,
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
            SyncerUtils.invokeSocialChange(id, getState());
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

export function updateSocialState(response, feedId) {
    return {
        type: actions.FEED_UPDATE_SOCIAL_STATE,
        social_state: response,
        id: feedId
    }
}

export function* updateFeeds(feeds) {
    if (feeds) {
        let collectionDispatcher = new CollectionDispatcher();
        let disassemblerItems = feeds.map(item => assemblers.disassembler(item, collectionDispatcher));
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

export function* updateFeedsListeners(feeds) {
    if (feeds) {
        let values = Object.values(feeds);
        let feed;
        while (feed = values.pop()) {
            let id;
            let entities
            switch (feed.activity.action) {
                case 'created':
                    id = feed.activity.business._id;
                    entities = [{business: id}];
                    break;
                case 'share':
                    if (feed.activity.activity.instance) {
                        id = feed.activity.activity.instance._id;
                        entities = [{instance: id}];
                    }
                    if (feed.activity.activity.post) {
                        id = feed.activity.activity.post._id;
                        entities = [{post: id}];
                    }
                    break;
                case 'eligible':
                    id = feed.activity.instance._id;
                    entities = [{instance: id}];
                    break;
                case 'post':
                    id = feed.activity.post._id;
                    entities = [{post: id}];
                    break;
            }
            if (id) {
                yield put({
                    type: actions.SOCIAL_STATE_LISTENER,
                    id: id
                });
                SyncerUtils.syncSocialState(id);
                yield put({
                    type: actions.CHAT_LISTENER,
                    id: id,
                    entities: entities
                });
                SyncerUtils.addChatSync(id,entities);
            }
        }
    }
}

export function* updateFollowers(feeds) {
    if (feeds) {
        let feedsObjects = Object.values(feeds);
        let feed;
        while (feed = feedsObjects.pop()) {
            switch (feed.activity.action) {
                case 'created':
                    if (feed.activity.business.social_state.follow) {
                        yield put({
                            type: actions.USER_FOLLOW_BUSINESS,
                            id: feed.activity.business._id
                        })
                    } else {
                        yield put({
                            type: actions.USER_UNFOLLOW_BUSINESS,
                            id: feed.activity.business._id
                        })
                    }
                    break;
                case 'eligible':
                    if (feed.activity.actor_business.social_state.follow) {
                        yield put({
                            type: actions.USER_FOLLOW_BUSINESS,
                            id: feed.activity.actor_business._id
                        })
                    } else {
                        yield put({
                            type: actions.USER_UNFOLLOW_BUSINESS,
                            id: feed.activity.actor_business._id
                        })
                    }
                    break;
            }
        }
    }
}

export function setSavedInstance(response) {
    return {
        type: actions.UPSERT_SAVED_FEEDS,
        savedInstance: response,
    }
}

export function* updateFeedsTop(feeds) {
    if (feeds) {
        let collectionDispatcher = new CollectionDispatcher();
        feeds.forEach(feed => {
            console.log(feed);
        })
        let disassemblerItems = feeds.map(item => assemblers.disassembler(item, collectionDispatcher));
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

export function setVisibleItem(itemId) {
    return function (dispatch) {
        dispatch({
            type: actions.VISIBLE_MAIN_FEED,
            feedId: itemId
        });
    }
}


export default {
    shareActivity,
    saveFeed,
    unlike,
    like,
};






