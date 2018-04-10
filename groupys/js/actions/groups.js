import GroupsApi from "../api/groups";
import FeedApi from "../api/feed";
import UserApi from "../api/user";
import PtomotionApi from "../api/promotion";
import imageApi from "../api/image";
import ActivityApi from "../api/activity";
import * as assemblers from "./collectionAssembler";
import * as actions from "../reducers/reducerActions";
import CollectionDispatcher from "./collectionDispatcher";
import ActionLogger from './ActionLogger'
import GroupsComperator from "../reduxComperators/GroupsComperator"
import handler from './ErrorHandler'
import * as types from '../sega/segaActions';
import {put} from 'redux-saga/effects'
import asyncListener from "../api/AsyncListeners";
let groupsApi = new GroupsApi();
let feedApi = new FeedApi();
let promotionApi = new PtomotionApi();
let activityApi = new ActivityApi();
let userApi = new UserApi();
let logger = new ActionLogger();
let groupsComperator = new GroupsComperator();

async function getAll(dispatch, token, state) {
    dispatch({
        type: types.SAVE_GROUPS_REQUEST,
        token: token,
        dispatch: dispatch,
        state: state
    });
}

export function clearUnreadPosts(group) {
    return async function (dispatch) {
        dispatch({
            type: actions.GROIP_CLEAR_UNREAD_POST,
            gid: group._id,
        });
    }
}

async function getByBusinessId(dispatch, bid, token) {
    try {
        let response = await groupsApi.getByBusinessId(bid, token);
        if (response.length > 0) {
            dispatch({
                type: actions.GET_GROUPS_BUSINESS,
                groups: response,
                bid: bid
            });
        }
    } catch (error) {
        handler.handleError(error, dispatch, 'groupsApi.getByBusinessId')
        logger.actionFailed('groupsApi.getByBusinessId')
    }
}

async function getUserFollowers(dispatch, token) {
    try {
        let users = await userApi.getUserFollowers(token);
        dispatch({
            type: 'GET_USER_FOLLOWERS',
            followers: users
        });
    } catch (error) {
        handler.handleError(error, dispatch, 'userApi.getUserFollowers');
        logger.actionFailed('userApi.getUserFollowers')
    }
}

export function fetchGroups() {
    return function (dispatch, getState) {
        const token = getState().authentication.token;
        getAll(dispatch, token, getState());
    }
}

export function fetchBusinessGroups(bid) {
    return function (dispatch, getState) {
        const token = getState().authentication.token;
        getByBusinessId(dispatch, bid, token);
    }
}

export function fetchUsersFollowers() {
    return function (dispatch, getState) {
        const token = getState().authentication.token;
        getUserFollowers(dispatch, token);
    }
}

export function acceptInvitation(group) {
    return async function (dispatch, getState) {
        try {
            const token = getState().authentication.token;
            await groupsApi.acceptInvitation(group, token);
            let groups = await groupsApi.getAll(token);
            groups.forEach(function (group) {
                dispatch({
                    type: actions.UPSERT_SINGLE_GROUP,
                    group: group
                });
            })
        } catch (error) {
            handler.handleError(error, dispatch, 'groupsApi.acceptInvitation');
            logger.actionFailed('groupsApi.acceptInvitation')
        }
    }
}

async function groupTouched(groupId) {
    return async function (dispatch) {
        dispatch({
            type: actions.GROUP_TOUCHED,
            groupId: groupId
        });
    };
}

export function touch(groupId) {
    return function (dispatch, getState) {
        try {
            const token = getState().authentication.token;
            dispatchGroupTOuch(token, groupId, dispatch)
        } catch (error) {
            handler.handleError(error, dispatch, 'groupsApi.touch');
            logger.actionFailed('groupsApi.touch')
        }
    }
}

export function dispatchGroupTOuch(token, groupId, dispatch) {
    groupsApi.touch(groupId, token);
    dispatch({
        type: actions.GROUP_TOUCHED,
        groupId: groupId
    });
}

export function createGroup(group, navigation) {
    return async function (dispatch, getState) {
        try {
            dispatch({
                type: actions.GROUP_SAVING,
            });
            const token = getState().authentication.token;
            dispatch({
                type: types.SAVE_GROUP,
                group: group,
                token: token
            });
            dispatch({
                type: actions.GROUP_SAVING_DONE,
            });
            navigation.goBack();
        } catch (error) {
            handler.handleError(error, dispatch, 'createGroup')
            logger.actionFailed('groupsApi.createGroup')
        }
    }
}

export function setGroupQrCode(group) {
    return async function (dispatch, getState) {
        try {
            const token = getState().authentication.token;
            dispatch({
                type: actions.REST_GROUP_QRCODE,
            });
            let code = group.qrcode;
            if (code && code.code) {
                code = code.code;
            }
            let response = await imageApi.getQrCodeImage(code, token);
            dispatch({
                type: actions.UPSERT_GROUP_QRCODE,
                group: group,
                qrcodeSource: response.qrcode
            });
        } catch (error) {
            handler.handleError(error, dispatch, 'setBusinessQrCode')
            logger.actionFailed("business_getBusinessQrCodeImage", group._id);
        }
    }
}

export function updateGroup(group, navigation) {
    return async function (dispatch, getState) {
        try {
            dispatch({
                type: actions.GROUP_SAVING,
            });
            const token = getState().authentication.token;
            await groupsApi.updateGroup(group, token);
            await getAll(dispatch, token);
            dispatch({
                type: actions.GROUP_SAVING_DONE,
            });
            navigation.goBack();
        } catch (error) {
            handler.handleError(error, dispatch, 'groupsApi.createGroup')
            logger.actionFailed('groupsApi.createGroup')
        }
    }
}

function uploadGroupPic() {
    return function (dispatch, getState) {
        const token = getState().authentication.token;
        getAll(dispatch, token);
    }
}

export function setNextFeeds(feeds, token, group) {
    return async function (dispatch, getState) {
        const token = getState().authentication.token;
        let showLoadingDone = false;
        if (_.isEmpty(feeds) && !getState().groups.loadingDone[group._id]) {
            dispatch({
                type: actions.GROUP_FEED_LOADING_DONE,
                loadingDone: false,
                groupId: group._id,
            });
            showLoadingDone = true;
        }
        try {
            let response = null;
            if (_.isEmpty(feeds)) {
                response = await feedApi.getAll('down', 'start', token, group);
            } else {
                let keys = Object.keys(feeds);
                let id = keys[keys.length - 1];
                if (feeds[id].id === getState().groups.lastFeed[group._id])
                    return;
                // make sure we call the server for the same group max 1 time in 10 seconds period
                if (getState().groups.lastFeedTime[[group._id]]) {
                    let currentTimeInMils = new Date().getTime();
                    if (currentTimeInMils - getState().groups.lastFeedTime[[group._id]] < 10000) {
                        return
                    }
                }
                dispatch({
                    type: actions.GROUP_LAST_FEED_DOWN,
                    id: feeds[id].id,
                    groupId: group._id,
                });
                response = await feedApi.getAll('down', feeds[id].id, token, group);
            }
            let collectionDispatcher = new CollectionDispatcher();
            let disassemblerItems = response.map(item => {
                if (item.activity && (item.activity.action === 'group_message' || item.activity.action === 'group_follow')) {
                    return item;
                }
                return assemblers.disassembler(item, collectionDispatcher)
            });
            if (disassemblerItems && disassemblerItems.length > 0) {
                collectionDispatcher.dispatchEvents(dispatch);
                dispatch({
                    type: actions.UPSERT_GROUP_FEEDS_BOTTOM,
                    groupId: group._id,
                    groupFeed: disassemblerItems
                })
            }
        } catch (error) {
            handler.handleError(error, dispatch, 'groups-setNextFeeds')
            logger.actionFailed('groups-setNextFeeds')
        }
        if (showLoadingDone && !getState().groups.loadingDone[group._id]) {
            dispatch({
                type: actions.GROUP_FEED_LOADING_DONE,
                loadingDone: true,
                groupId: group._id,
            });
        }
    }
}

export function sendMessage(groupId, message) {
    return async function (dispatch, getState) {
        const token = getState().authentication.token;
        const user = getState().user.user;
        let messageItem = createMessage(message, user);
        dispatch({
            type: actions.GROUP_ADD_MESSAGE,
            groupId: groupId,
            message: messageItem
        });
        try {
            groupsApi.meesage(groupId, message, token)
        } catch (error) {
            handler.handleError(error, dispatch, 'groups-sendMessage')
            logger.actionFailed('groups-sendMessage')
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

async function fetchTopList(id, token, group, dispatch, user) {
    try {
        if (!id) {
            return;
        }
        let response = await feedApi.getAll('up', id, token, group);
        if (!response)
            return;
        if (response.length === 0) {
            return;
        }
        let collectionDispatcher = new CollectionDispatcher();
        let disassemblerItems = response.map(item => {
            if (item.activity && (item.activity.action === 'group_message' || item.activity.action === 'group_follow')) {
                return item;
            }
            return assemblers.disassembler(item, collectionDispatcher)
        });
        collectionDispatcher.dispatchEvents(dispatch)
        dispatch({
            type: actions.UPSERT_GROUP_FEEDS_TOP,
            groupId: group._id,
            groupFeed: disassemblerItems,
            user: user
        });
        dispatch({
            type: actions.UPDATE_FEED_GROUP_UNREAD,
            feeds: response,
            user: user,
        })
    } catch (error) {
        handler.handleError(error, dispatch, 'groups-fetchTopList')
        logger.actionFailed('groups-fetchTopList')
    }
}

export function setFeeds(group, feeds) {
    if (_.isEmpty(feeds)) {
        return setNextFeeds(feeds, undefined, group)
    }
    return async function (dispatch, getState) {
        const token = getState().authentication.token;
        const user = getState().user.user;
        await fetchTopList(feeds[0].id, token, group, dispatch, user)
    }
}

export function fetchTop(feeds, token, group) {
    return async function (dispatch, getState) {
        const token = getState().authentication.token;
        if (getState().groups.showTopLoader[group._id]) {
            return;
        }
        dispatch({
            type: actions.GROUP_FEED_SHOWTOPLOADER,
            groupId: group._id,
            showTopLoader: true,
        });
        const user = getState().user.user;
        await fetchTopList(feeds[0].id, token, group, dispatch, user);
        dispatch({
            type: actions.GROUP_FEED_SHOWTOPLOADER,
            groupId: group._id,
            showTopLoader: false,
        });
    }
}

export function like(id) {
    return async function (dispatch, getState) {
        try {
            const token = getState().authentication.token;
            dispatch({
                type: actions.LIKE,
                id: id
            });

            await userApi.like(id, token);
            if(getState().instances.instances[id]  &&  getState().instances.instances[id].promotion) {
                asyncListener.syncChange('promotion_' + getState().instances.instances[id].promotion, 'like');
            }
            asyncListener.syncChange('social_'+id,'like' )
        } catch (error) {
            handler.handleError(error, dispatch, 'groups-like')
            logger.actionFailed('groups-like')
        }
    }
}

export const unlike = (id) => {
    return async function (dispatch, getState) {
        try {
            const token = getState().authentication.token;
            await userApi.unlike(id, token);
            dispatch({
                type: actions.UNLIKE,
                id: id
            });
            if(getState().instances.instances[id]  &&  getState().instances.instances[id].promotion) {
                asyncListener.syncChange('promotion_' + getState().instances.instances[id].promotion, 'un-like');
            }
            asyncListener.syncChange('social_'+id,'un-like' )
        } catch (error) {
            handler.handleError(error, dispatch, 'groups-unlike')
            logger.actionFailed('groups-unlike')
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
            //navigation.navigate('realizePromotion', {item: feed, id: savedInstance._id})
            dispatch({
                type: types.SAVE_SINGLE_MYPROMOTIONS_REQUEST,
                item: savedInstance
            })
            asyncListener.syncChange('social_'+id,'saved' )
            if(getState().instances.instances[id]  &&  getState().instances.instances[id].promotion) {
                asyncListener.syncChange('promotion_' + getState().instances.instances[id].promotion, 'save');
            }
            handler.handleSuccses(getState(), dispatch)
        } catch (error) {
            handler.handleError(error, dispatch, 'groups-saveFeed')
            logger.actionFailed('groups-saveFeed')
        }
    }
}

export function shareActivity(id, activityId, users, token) {
    return async function (dispatch, getState) {
        try {
            users.forEach(function (user) {
                activityApi.shareActivity(user, activityId, token)
            })
            asyncListener.syncChange('social_'+id,'shared' )
            handler.handleSuccses(getState(), dispatch)
        } catch (error) {
            handler.handleError(error, dispatch, 'groups-shareActivity')
            logger.actionFailed('groups-shareActivity')
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
            if (response) {
                if (response.likes === currentSocialState.likes &&
                    response.shares === currentSocialState.shares &&
                    response.comments === currentSocialState.comments) {
                    return;
                }
            }
            dispatch({
                type: actions.FEED_UPDATE_SOCIAL_STATE,
                social_state: response,
                id: id
            });
            handler.handleSuccses(getState(), dispatch)
            // await userApi.like(id, token);
        } catch (error) {
            handler.handleError(error, dispatch, 'groups-refresh')
            logger.actionFailed('groups-refresh')
        }
    }
}

export function searchGroup(group) {
    return function (dispatch, getState) {
        const token = getState().authentication.token;
        dispatchSearchGroups(dispatch, group, token);
    }
}

async function dispatchSearchGroups(dispatch, business, token) {
    try {
        dispatch({type: actions.SHOW_SEARCH_SPIN, searching: true});
        let response = await groupsApi.searchGroup(business, token);
        dispatch({type: actions.SEARCH_GROUPS, groups: response});
    } catch (error) {
        handler.handleError(error, dispatch, 'dispatchSearchGroups')
    }
}

export function joinGroup(groupId) {
    return async function (dispatch, getState) {
        try {
            const token = getState().authentication.token;
            await groupsApi.join(groupId, token);
            dispatch({type: actions.RESET_FOLLOW_FORM})
        } catch (error) {
            handler.handleError(error, dispatch, 'joinGroup');
        }
    }
}

export function setGroups(response, state, dispatch) {
    return {
        type: actions.UPSERT_GROUP,
        item: response,
    }
}

export function setGroup(response) {
    return {
        type: actions.UPSERT_SINGLE_GROUP,
        group: response,
    }
}

export function setSocialState(item) {
    return async function (dispatch, getState) {
        try {
            const token = getState().authentication.token;
            let feedInstance = getState().instances.instances[item.id];
            dispatch({
                type: types.FEED_SET_SOCIAL_STATE,
                token: token,
                feed: feedInstance,
                id: item.id
            });
            handler.handleSuccses(getState(), dispatch)
        } catch (error) {
            handler.handleError(error, dispatch, 'feed-getFeedSocialState')
            logger.actionFailed('getFeedSocialState')
        }
    }
}

export function setVisibleItem(itemId, groupId) {
    return function (dispatch) {
        dispatch({
            type: actions.VISIBLE_GROUP_FEED,
            feedId: itemId,
            groupId: groupId
        });
    }
}

export function clearReplyInstance() {
    return function (dispatch) {
        dispatch({
            type: actions.GROUP_CLEAR_COMMENT_INSTANCE,
        });
    }
}

export function setReplayInstance(item) {
    return function (dispatch) {
        dispatch({
            type: actions.GROUP_COMMENT_INSTANCE,
            instance: item
        });
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

export function setTopFeeds(group) {
    return async function (dispatch, getState) {
        const token = getState().authentication.token;
        const user = getState().user.user;
        const feedOrder = getState().groups.groupFeedOrder[group._id];
        if (feedOrder) {
            if (!user)
                return;
            dispatch({
                type: types.CANCEL_GROUP_FEED_LISTENER,
            });
            if (feedOrder && feedOrder.length > 0) {
                dispatch({
                    type: types.LISTEN_FOR_GROUP_FEED,
                    id: feedOrder[0],
                    group: group,
                    token: token,
                    user: user,
                });
            }
            handler.handleSuccses(getState(), dispatch)
        }
    }
}

export function* updateFeedsTop(feeds, group, user) {
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
            type: actions.UPSERT_GROUP_FEEDS_TOP,
            groupId: group._id,
            groupFeed: disassemblerItems,
            user: user
        });
        asyncListener.syncChange('group_' + groupId, 'addActivity');
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

export default {
    getAll,
    fetchTopList,
};