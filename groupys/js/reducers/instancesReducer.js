/**
 * Created by roilandshut on 08/06/2017.
 */
/**
 * Created by stan229 on 5/27/16.
 */
const initialState = {instances: {}};
import {REHYDRATE} from "redux-persist/constants";
import * as actions from "./reducerActions";
export default function instances(state = initialState, action) {
    if (action.type === REHYDRATE) {

        // retrive stored data for reducer callApi
        const savedData = action.payload || initialState;
        return {
            ...state, ...savedData.instances
        };
    }
    let currentState = {...state};
    switch (action.type) {
        case actions.UPSERT_INSTANCE:
            let currentInstances = currentState.instances;
            currentInstances[action.item._id] = action.item;
            return currentState;
        case actions.LIKE:
            let item = currentState.instances[action.id];
            if (item) {
                item.social_state.like = true;
                item.social_state.likes = item.social_state.likes + 1;
                return currentState;
            } else {
                return state;
            }
        case actions.UNLIKE:
            let unlikeItem = currentState.instances[action.id];
            if (unlikeItem) {
                unlikeItem.social_state.like = false;
                unlikeItem.social_state.likes = unlikeItem.social_state.likes - 1;
                return currentState;
            } else {
                return state;
            }
        case actions.SHARE:
            let shareItem = currentState.instances[action.id];
            if (shareItem) {
                shareItem.social_state.share = true;
                shareItem.social_state.shares = shareItem.social_state.shares + action.shares;
                return currentState;
            } else {
                return state;
            }
        case actions.SAVE:
            let sabeItem = currentState.instances[action.id];
            if (sabeItem) {
                sabeItem.social_state.saved = true;
                return currentState;
            } else {
                return state;
            }
        default:
            return state;
    }
};