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
const initialState = {promotions: {},savingForm:false};
import store from "react-native-simple-store";
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
        case actions.PROMOTION_SAVING:
            return {
                ...state,
                savingForm: true,
            };
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