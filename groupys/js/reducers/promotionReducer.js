/**
 * Created by roilandshut on 13/06/2017.
 */
/**
 * Created by roilandshut on 13/06/2017.
 */
/**
 * Created by roilandshut on 08/06/2017.
 */
/**
 * Created by stan229 on 5/27/16.
 */
const initialState = {promotions: {}, savingForm: false};
import {REHYDRATE} from "redux-persist/constants";
import * as actions from "./reducerActions";

export default function promotion(state = initialState, action) {
    console.log(action.type);
    if (action.type === REHYDRATE) {

        // retrive stored data for reducer callApi
        const savedData = action.payload || initialState;
        return {
            ...state, ...savedData.promotions
        };
    }
    let promotionsState = {...state};
    let currentPromotions = promotionsState.promotions;
    switch (action.type) {
        case actions.UPSERT_PROMOTION:
            action.item.forEach(eventItem => {
                if (eventItem.social_state || !currentPromotions[eventItem._id]) {
                    currentPromotions[eventItem._id] = eventItem;
                } else {
                    eventItem.social_state = currentPromotions[eventItem._id].social_state;
                    currentPromotions[eventItem._id] = eventItem;
                }
            });
            return promotionsState;
        case actions.FEED_UPDATE_SOCIAL_STATE:
            if (currentPromotions[action.id]) {
                currentPromotions[action.id].social_state = action.social_state;
            }
            promotionsState.promotions = currentPromotions;
            return promotionsState;
        case actions.PROMOTION_SAVING:
            return {
                ...state,
                savingForm: true,
            };
        case actions.LIKE:
            let item = currentPromotions[action.id];
            if (item) {
                item.social_state.like = true;
                item.social_state.likes = item.social_state.likes + 1;
                return currentPromotions;
            } else {
                return state;
            }
        case actions.UNLIKE:
            let unlikeItem = currentPromotions[action.id];
            if (unlikeItem) {
                unlikeItem.social_state.like = false;
                unlikeItem.social_state.likes = unlikeItem.social_state.likes - 1;
                return currentPromotions;
            } else {
                return state;
            }
        case actions.PROMOTION_SAVING_DONE:
            return {
                ...state,
                savingForm: false,
            };
        case actions.PROMOTION_RESET:
            return {
                ...state,
                savingForm: false,
            };
        case actions.SAVE_PROMOTIONS :
            let currentState = {...state};
            currentPromotions[action.businessId] = action.promotions;
            return currentState;
        default:
            return state;
    }
};