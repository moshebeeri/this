/**
 * Created by roilandshut on 08/06/2017.
 */
import FeedApi from "../api/feed";
import UserApi from "../api/user";
import BusinessApi from "../api/business";
import PtomotionApi from "../api/promotion";
import ActivityApi from "../api/activity";
import * as actions from "../reducers/reducerActions";
import * as assemblers from "./collectionAssembler";
import CollectionDispatcher from "./collectionDispatcher";
import ActionLogger from './ActionLogger'
import FeedUiConverter from "../api/feed-ui-converter";

let feedUiConverter = new FeedUiConverter();
let feedApi = new FeedApi();
let userApi = new UserApi();
let promotionApi = new PtomotionApi();
let activityApi = new ActivityApi();
let businessApi = new BusinessApi();
let logger = new ActionLogger();
import  handler from './ErrorHandler'
import * as errors from '../api/Errors'
async function fetchFeedsFromServer(feeds, dispatch, token, user) {
    try {
        let response = null;
        if (_.isEmpty(feeds)) {
            response = await feedApi.getAll('down', 'start', token, user);
        } else {
            let keys = Object.keys(feeds);
            let id = keys[keys.length - 1];
            response = await feedApi.getAll('down', feeds[id].fid, token, user);
        }
        dispatch({
            type: actions.FEEDS_GET_NEXT_BULK_DONE,
        });
        console.log(response)
        if (!response)
            return;
        if (response.length === 0) {
            dispatch({
                type: actions.MAX_FEED_RETUNED
             })
            return;
        }
        let collectionDispatcher = new CollectionDispatcher();
        let disassemblerItems = response.map(item => assemblers.disassembler(item, collectionDispatcher));
        collectionDispatcher.dispatchEvents(dispatch, updateBusinessCategory, token);
        dispatch({
            type: actions.UPSERT_FEEDS_ITEMS,
            items: disassemblerItems
        });
    } catch (error) {
        handler.handleError(error,dispatch)
        logger.actionFailed('fetchFeedsFromServer')
    }
}

 async function fetchTopList(id, token, user, dispatch) {
    try {
        let response = await feedApi.getAll('up', id, token, user);
        if (!response)
            return;
        if (response.length === 0) {
            return;
        }
        let collectionDispatcher = new CollectionDispatcher();
        let disassemblerItems = response.map(item => assemblers.disassembler(item, collectionDispatcher));
        collectionDispatcher.dispatchEvents(dispatch, updateBusinessCategory, token);
        disassemblerItems.forEach(item => dispatch({
            type: actions.UPSERT_FEEDS_TOP,
            item: item
        }))
    } catch (error) {
        handler.handleError(error,dispatch)
        logger.actionFailed('fetchTopList-mainfeeds')
    }
}


async function updateBusinessCategory(token, businesses, dispatch) {
    try {
        let businessIds = [];
        let filterBusiness = businesses.filter(business => {
            if (businessIds.includes(business._id)) {
                return false;
            }
            businessIds.push(business._id);
            return true;
        });
        if (filterBusiness && filterBusiness.length > 0) {
            let updatedBusinesses = await Promise.all(filterBusiness.map(async (item) => {
                item.categoryTitle = await businessApi.getSubCategory(token, item.subcategory);
                return item;
            }));
            dispatch({
                type: actions.UPSERT_BUSINESS,
                item: updatedBusinesses
            });
        }
    } catch (error) {
        handler.handleError(error,dispatch)
        logger.actionFailed('updateBusinessCategory')
    }
}

export function fetchTop(feeds, token, user) {
    return async function (dispatch, getState) {
        try {
            if (getState().feeds.showTopLoader) {
                return;
            }
            await dispatch({
                type: actions.FEED_SHOW_TOP_LOADER,
                showTopLoader: true,
            });
            await fetchTopList(feeds[0].id, token, user, dispatch);
            await dispatch({
                type: actions.FEED_SHOW_TOP_LOADER,
                showTopLoader: false,
            });
            handler.handleSuccses(getState(),dispatch)
        } catch (error) {
            if(error === errors.NETWORK_ERROR) {
                dispatch({
                    type: actions.NETWORK_IS_OFFLINE,
                });
            }
            logger.actionFailed('fetchTop')
        }
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
        handler.handleError(error,dispatch)
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
        const token = getState().authentication.token
        const user = getState().user.user
        if (!user)
            return
        let showLoadingDone = false;
        if(getState().feeds.nextBulkLoad){
            return;
        }
        if(feeds.length > 10) {
            dispatch({
                type: actions.FEEDS_GET_NEXT_BULK,
            });
        }

        if(getState().feeds.maxFeedReturned){
            dispatch({
                type: actions.FEEDS_GET_NEXT_BULK_DONE,
            });
            return;
        }
        
        if (_.isEmpty(feeds) && getState().feeds.firstTime) {
            dispatch({
                type: actions.FIRST_TIME_FEED,
            });
            console.log('first time feeds');
            await fetchFeedsFromServer(feeds, dispatch, token, user)
            showLoadingDone = true;
        }
        if (feeds && feeds.length > 0 ) {

            let length = getState().feeds.feedView.length
            let id = getState().feeds.feedView[length - 1]
            dispatch({
                type: actions.LAST_FEED_DOWN,
                id: id,
            });
            await fetchFeedsFromServer(feeds, dispatch, token, user)

        }
        if (showLoadingDone && !getState().feeds.loadingDone) {
            dispatch({
                type: actions.FEED_LOADING_DONE,
                loadingDone: true,
            });
        }

        dispatch({
            type: actions.FEEDS_GET_NEXT_BULK_DONE,
        });
        handler.handleSuccses(getState(),dispatch)
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
            handler.handleSuccses(getState(),dispatch)
        } catch (error) {
            if(error === errors.NETWORK_ERROR) {
                dispatch({
                    type: actions.NETWORK_IS_OFFLINE,
                });
            }
            logger.actionFailed('like')
        }
    }
}

export function refresh(id, currentSocialState) {
    return async function (dispatch, getState) {
        try {
            const token = getState().authentication.token;
            if(new Date().getTime() - getState().feeds.upTime < 360000){
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
            handler.handleSuccses(getState(),dispatch)
            // await userApi.like(id, token);
        } catch (error) {
            if(error === errors.NETWORK_ERROR) {
                dispatch({
                    type: actions.NETWORK_IS_OFFLINE,
                });
            }
            logger.actionFailed('getFeedSocialState')
        }
    }
}


async function refreshFeedSocialState (dispatch, token,id) {
    try {

        let response = await feedApi.getFeedSocialState(id, token);

        dispatch({
            type: actions.FEED_UPDATE_SOCIAL_STATE,
            social_state: response,
            id: id
        });


    } catch (error) {
        handler.handleError(error,dispatch)
        logger.actionFailed('refreshFeedSocialState')
    }
}

export const unlike = (id) => {
    return async function (dispatch, getState) {
        try {
            const token = getState().authentication.token
            await userApi.unlike(id, token);
            dispatch({
                type: actions.UNLIKE,
                id: id
            });
            handler.handleSuccses(getState(),dispatch)
        } catch (error) {
            if(error === errors.NETWORK_ERROR) {
                dispatch({
                    type: actions.NETWORK_IS_OFFLINE,
                });
            }
            logger.actionFailed('unlike')
        }
    }
};

export function saveFeed(id,navigation,feed) {
    return async function (dispatch, getState) {
        try {
            dispatch({
                type: actions.SAVE,
                id: id
            });
           let savedInstance =  await promotionApi.save(id);
            navigation.navigate('realizePromotion', {item: feed,id:savedInstance._id})
            await  promotionApi.getAll();
            handler.handleSuccses(getState(),dispatch)

        } catch (error) {
            if(error === errors.NETWORK_ERROR) {
                dispatch({
                    type: actions.NETWORK_IS_OFFLINE,
                });
            }
            logger.actionFailed('saveFeed')
        }
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
            if(error === errors.NETWORK_ERROR) {
                dispatch({
                    type: actions.NETWORK_IS_OFFLINE,
                });
            }
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
            if(error === errors.NETWORK_ERROR) {
                dispatch({
                    type: actions.NETWORK_IS_OFFLINE,
                });
            }
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

export default {
    nextLoad,
    fetchTopList,
    shareActivity,
    setUserFollows,
    saveFeed,
    unlike,
    like,
    refreshFeedSocialState,


};






