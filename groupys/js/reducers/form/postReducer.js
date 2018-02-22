/**
 * Created by roilandshut on 13/06/2017.
 */
/**
 * Created by roilandshut on 08/06/2017.
 */
/**
 * Created by stan229 on 5/27/16.
 */
const initialState = {failedMessage: '', saving: false, posts: {}, updated: false};
import * as actions from './../reducerActions';
import {REHYDRATE} from 'redux-persist/constants'

export default function postForm(state = initialState, action) {
    if (action.type === REHYDRATE) {

        // retrieve stored data for reducer callApi
        const savedData = action.payload || initialState;
        return {
            ...state,
            ...savedData.postForm,
        };
    }
    let currentState = {...state};
    switch (action.type) {
        case actions.UPSERT_POST:
            let currentPosts = currentState.posts;
            action.item.forEach(eventItem => {
                currentPosts[eventItem._id] = eventItem;
            });
            return currentState;
        case actions.RESET_POST_FORM:
            return {
                ...state,
                saving:false,
            };
        case actions.POST_SAVING :
            return {
                ...state,
                saving: true,
            };
        case actions.POST_SAVING_DONE :
            return {
                ...state,
                saving: false,
            };
        case actions.LIKE:
            let item = currentState.posts[action.id];
            if (item) {
                currentState.updated = !currentState.updated;
                item.social_state.like = true;
                item.social_state.likes = item.social_state.likes + 1;
                return currentState;
            } else {
                return state;
            }
        case actions.UNLIKE:
            let unlikeItem = currentState.posts[action.id];
            if (unlikeItem) {
                currentState.updated = !currentState.updated;
                unlikeItem.social_state.like = false;
                unlikeItem.social_state.likes = unlikeItem.social_state.likes - 1;
                return currentState;
            } else {
                return state;
            }
        case actions.SHARE:
            let shareItem = currentState.posts[action.id];
            if (shareItem) {
                currentState.updated = !currentState.updated;
                shareItem.social_state.share = true;
                shareItem.social_state.shares = shareItem.social_state.shares + action.shares;
                return currentState;
            } else {
                return state;
            }
        case actions.FEED_UPDATE_SOCIAL_STATE:
            if (action.social_state && currentState.posts[action.id]) {
                currentState.posts[action.id].social_state = action.social_state;
                return currentState;
            } else {
                return state;
            }
        default:
            return state;
    }
};