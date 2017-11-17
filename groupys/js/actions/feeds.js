/**
 * Created by roilandshut on 08/06/2017.
 */
import GroupsApi from "../api/groups";
import UserApi from "../api/user";
import store from "react-native-simple-store";

let groupsApi = new GroupsApi();
let userApi = new UserApi();

async function fetchList(action, feeds, api, dispatch, groupid) {
    try {
        let response = null;
        if (feeds.length === 0) {
            response = await api.getAll('down', 'start');
        } else {
            response = await api.getAll('down', feeds[feeds.length - 1].id);
        }
        if (!response) {
            dispatchDone(dispatch, action, groupid);
            return
        }
        if (response.length > 0 && feeds.length > 0) {
            feeds = addToRows(feeds, response, false);
        } else {
            feeds = response;
        }
        if (feeds.length > 0) {
            if (groupid) {
                dispatch({
                    type: action,
                    feeds: feeds,
                    showTopLoader: false,
                    groupid: groupid
                });
            } else {
                dispatch({
                    type: action,
                    feeds: feeds,
                    showTopLoader: false
                });
            }
            return;
        }
        dispatchDone(dispatch, action, groupid);
    } catch (error) {
        dispatch({
            type: actions.NETWORK_IS_OFFLINE,
        });
    }
}

function dispatchDone(dispatch, action, groupid) {
    switch (action) {
        case 'GET_FEEDS':
            dispatch({
                type: 'FEED_LOADING_DONE',
            });
            break;
        case 'GET_SAVED_FEEDS':
            dispatch({
                type: 'SAVED_FEED_LOADING_DONE',
            });
            break;
        case 'GET_GROUP_FEEDS':
            dispatch({
                type: 'GROUP_FEEDS_LOAD_DONE',
                groupid: groupid
            });
            break;
    }
}

async function getFeedsFromStore(dispatch) {
    try {
        let response = await store.get('feeds');
        if (response) {
            dispatch({
                type: 'GET_FEEDS_FROM_STORE',
                feeds: response,
            });
        }
    } catch (error) {
        console.log(error);
    }
}

async function getSavedFeedsFromStore(dispatch) {
    try {
        let response = await store.get('savedFeeds');
        if (response) {
            dispatch({
                type: 'GET_SAVED_FEEDS_FROM_STORE',
                feeds: response,
            });
        }
    } catch (error) {
        console.log(error);
    }
}

async function getGroupFeedsFromStore(dispatch, group) {
    try {
        let response = await store.get('groups' + group);
        if (response) {
            dispatch({
                type: 'GET_GROUP_FEEDS_FROM_STORE',
                groupid: group,
                feeds: response,
            });
        }
    } catch (error) {
        console.log(error);
    }
}

function addToRows(feeds, response, top) {
    let currentRows = feeds;
    let newFeeds = response.filter(function (feed) {
        let filtered = currentRows.filter(function (currentFeed) {
            return currentFeed.id === feed.id;
        });
        return filtered.length === 0;
    });
    if (newFeeds.length > 0) {
        if (top) {
            currentRows = newFeeds.concat(feeds);
        } else {
            currentRows = feeds.concat(newFeeds)
        }
    }
    return currentRows;
}

async function fetchTopList(action, feeds, id, api, dispatch, groupid) {
    try {
        if (feeds && feeds.length > 0) {
            feeds = feeds.filter(function (feed) {
                return feed.id
            });
            if (id === feeds[0].id) {
                let response = await api.getAll('up', feeds[0].fid);
                if (response.length > 0) {
                    feeds = addToRows(feeds, response, true);
                    dispatch({
                        type: action,
                        feeds: feeds,
                        showTopLoader: false,
                        groupid: groupid
                    });
                } else {
                    dispatch({
                        type: action,
                        feeds: {},
                        showTopLoader: false,
                        groupid: groupid
                    });
                }
            }
        }
    } catch (error) {
        console.log(error);
    }
}

export function fetchFeedsFromStore() {
    return function (dispatch) {
        dispatch(getFeedsFromStore(dispatch));
    }
}

export function fetchSavedFeedsFromStore() {
    return function (dispatch) {
        dispatch(getSavedFeedsFromStore(dispatch));
    }
}

export function fetchFeeds(action, feeds, api) {
    return function (dispatch) {
        dispatch(fetchList(action, feeds, api, dispatch, null));
    }
}

export function fetchTop(action, feeds, id, api) {
    return function (dispatch) {
        dispatch(fetchTopList(action, feeds, id, api, dispatch, null));
    }
}

export function fetchGroupFeeds(groupid, action, feeds, api) {
    return function (dispatch) {
        dispatch(fetchList(action, feeds, api, dispatch, groupid));
    }
}

export function fetchGroupFeedsFromStore(groupid) {
    return function (dispatch) {
        dispatch(getGroupFeedsFromStore(dispatch, groupid));
    }
}

export function fetchGroupTop(groupid, action, feeds, id, api) {
    return function (dispatch) {
        fetchTopList(action, feeds, id, api, dispatch, groupid);
    }
}

export function showTopLoader() {
    return function (dispatch) {
        dispatch({
            type: 'SHOW_TOP_LOADER'
        });
    }
}

export function hideTopLoader() {
    return function (dispatch) {
        dispatch({
            type: 'HIDE_TOP_LOADER'
        });
    }
}

export function showSavedTopLoader() {
    return function (dispatch) {
        dispatch({
            type: 'SHOW_SAVED_TOP_LOADER'
        });
    }
}

export function showGroupTopLoader(groupid) {
    return function (dispatch) {
        dispatch({
            type: 'SHOW_GROUP_TOP_LOADER',
            groupid: groupid
        });
    }
}

async function getUserFollowers(dispatch) {
    try {
        let users = await userApi.getUserFollowers();
        dispatch({
            type: 'GET_USER_FOLLOWERS',
            followers: users
        });
    } catch (error) {
        console.log(error);
    }
}

async function getUser(dispatch) {
    try {
        let user = await userApi.getUser();
        dispatch({
            type: 'GET_USER',
            user: user
        });
    } catch (error) {
        console.log(error);
    }
}

export function updateHomeFeed(feed) {
    return function (dispatch) {
        dispatch({
            type: 'UPDATE_HOME_FEED',
            feed: feed
        });
    }
}

export function updateGroupFeed(feed, group) {
    return function (dispatch) {
        dispatch({
            type: 'UPDATE_GROUP_FEED',
            feed: feed,
            group: group
        });
    }
}

export function fetchUsers() {
    return function (dispatch) {
        dispatch(getUser(dispatch,));
    }
}

export function fetchUsersFollowers() {
    return function (dispatch) {
        dispatch(getUserFollowers(dispatch,));
    }
}

export function nextLoad() {
    return function (dispatch) {
        dispatch({
            type: 'FEED_LOADING',
        });
    }
}

export function fetchGroups() {
    return function (dispatch) {
        getAll(dispatch);
    }
}

export function directAddMessage(group, message) {
    return function (dispatch) {
        dispatch({
            type: 'DIRECT_ADD_GROUP_FEED',
            feed: message,
            group: group
        });
    }
}

async function getAll(dispatch) {
    try {
        let response = await groupsApi.getAll();
        if (response.length > 0) {
            dispatch({
                type: 'GET_GROUPS',
                groups: response,
            });
        }
    } catch (error) {
        console.log(error);
    }
}



