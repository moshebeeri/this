import GroupsApi from "../api/groups";
import FeedApi from "../api/feed";
import UserApi from "../api/user";
import PtomotionApi from "../api/promotion";
import ActivityApi from "../api/activity";
import * as assemblers from "./collectionAssembler";
import * as actions from "../reducers/reducerActions";
import CollectionDispatcher from "./collectionDispatcher";

let groupsApi = new GroupsApi();
let feedApi = new FeedApi();
let promotionApi = new PtomotionApi();
let activityApi = new ActivityApi();
let userApi = new UserApi();

async function getAll(dispatch, token) {
    try {
        let response = await groupsApi.getAll(token);
        if (response.length > 0) {
            response.forEach(function (group) {
                dispatch({
                    type: actions.UPSERT_SINGLE_GROUP,
                    group: group,
                });
            })
        }
    } catch (error) {
        dispatch({
            type: actions.NETWORK_IS_OFFLINE,
        });
    }
}

async function getByBusinessId(dispatch, bid, token) {
    try {
        let response = await groupsApi.getByBusinessId(bid, token);
        if (response.length > 0) {
            dispatch({
                type: 'GET_GROUPS_BUSINESS',
                groups: response,
                bid: bid
            });
        }
    } catch (error) {
        dispatch({
            type: actions.NETWORK_IS_OFFLINE,
        });
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
        dispatch({
            type: actions.NETWORK_IS_OFFLINE,
        });
    }
}

export function fetchGroups() {
    return function (dispatch, getState) {
        const token = getState().authentication.token;
        getAll(dispatch, token);
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

export function acceptInvatation(group) {
    return async function (dispatch, getState) {
        try {
            const token = getState().authentication.token;
            await groupsApi.acceptInvatation(group, token);
            let groups = await groupsApi.getAll(token);
            groups.forEach(function (group) {
                dispatch({
                    type: actions.UPSERT_SINGLE_GROUP,
                    group: group
                });
            })
        } catch (error) {
            dispatch({
                type: actions.NETWORK_IS_OFFLINE,
            });
        }
    }
}

export function touch(groupid) {
    return function (dispatch, getState) {
        try {
            const token = getState().authentication.token;
            groupsApi.touch(groupid, token);
        } catch (error) {
            dispatch({
                type: actions.NETWORK_IS_OFFLINE,
            });
        }
    }
}

export function createGroup(group) {
    return async function (dispatch, getState) {
        try {
            const token = getState().authentication.token;
            await groupsApi.createGroup(group, uploadGroupPic, token);
            getAll(dispatch, token);
        } catch (error) {
            dispatch({
                type: actions.NETWORK_IS_OFFLINE,
            });
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
                disassemblerItems.forEach(item => dispatch({
                    type: actions.UPSERT_GROUP_FEEDS_BOTTOM,
                    groupId: group._id,
                    groupFeed: item
                }))
            }
        } catch (error) {
            dispatch({
                type: actions.NETWORK_IS_OFFLINE,
            });
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
            dispatch({
                type: actions.NETWORK_IS_OFFLINE,
            });
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

async function fetchTopList(id, token, group, dispatch) {
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
        disassemblerItems.forEach(item => dispatch({
            type: actions.UPSERT_GROUP_FEEDS_TOP,
            groupId: group._id,
            groupFeed: item
        }));
        dispatch({
            type: actions.GROUP_CLEAN_MESSAGES,
            groupId: group._id,
        });
    } catch (error) {
        dispatch({
            type: actions.NETWORK_IS_OFFLINE,
        });
    }
}

export function setFeeds(group, feeds) {
    if (_.isEmpty(feeds)) {
        return setNextFeeds(feeds, undefined, group)
    }
    return async function (dispatch, getState) {
        const token = getState().authentication.token;
        const clientMessages = getState().groups.clientMessages[group._id];
        let id = getNextFeedId(feeds, clientMessages);
        await fetchTopList(id, token, group, dispatch)
    }
}

export function getFeedTopId(feeds, clientMessages) {
    let index = 0;
    let clientIds = clientMessages.map(message => message.id);
    while (clientIds.includes(feeds[index].id)) {
        index++;
    }
    return feeds[index].id
}

function getNextFeedId(feeds, clientMessages) {
    let id = feeds[0].id;
    if (!id) {
        let index = 1;
        while (!feeds[index].id || index > feeds.length) {
            index++
        }
        id = feeds[index].id;
    }
    if (clientMessages) {
        id = getFeedTopId(feeds, clientMessages)
    }
    return id;
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
        const clientMessages = getState().groups.clientMessages[group._id];
        let id = getNextFeedId(feeds, clientMessages);
        await fetchTopList(id, token, group, dispatch);
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
        } catch (error) {
            dispatch({
                type: actions.NETWORK_IS_OFFLINE,
            });
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
        } catch (error) {
            dispatch({
                type: actions.NETWORK_IS_OFFLINE,
            });
        }
    }
};

export function saveFeed(id) {
    return async function (dispatch) {
        try {
            dispatch({
                type: actions.SAVE,
                id: id
            });
            await promotionApi.save(id);
        } catch (error) {
            dispatch({
                type: actions.NETWORK_IS_OFFLINE,
            });
        }
    }
}

export function shareActivity(id, activityId, users, token) {
    return async function (dispatch) {
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
            dispatch({
                type: actions.NETWORK_IS_OFFLINE,
            });
        }
    }
}