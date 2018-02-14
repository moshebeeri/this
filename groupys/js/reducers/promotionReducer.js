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
const initialState = {promotions: {}, savingForm: false,loadingDone:{},promotionPictures:[],savingFormFailed:false};
import {REHYDRATE} from "redux-persist/constants";
import * as actions from "./reducerActions";

export default function promotion(state = initialState, action) {
    console.log(action.type);
    if (action.type === REHYDRATE) {

        // retrive stored data for reducer callApi
        const savedData = action.payload || initialState;
        return {
            ...state, ...savedData.promotions,savingForm:false,savingFormFailed:false
        };
    }
    let promotionsState = {...state};
    let currentPromotions = promotionsState.promotions;
    switch (action.type) {
        case actions.PROMOTION_RESET:
            return {
                ...state,
                savingForm: false,
                savingFormFailed:false
            };


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
        case actions.PROMOTION_SAVING_FAILED:
            return {
                ...state,
                savingFormFailed: true,
            };
        case actions.PROMOTION_RESET:
            return {
                ...state,
                savingForm: false,
            };
        case actions.PROMOTION_LOADING_DONE:
            promotionsState.loadingDone[action.businessId] = true
            return promotionsState;
        case actions.PROMOTION_UPLOAD_PIC:
            let promotionPic = promotionsState.promotionPictures;
            promotionPic.push(action.item)
            return {
                ...state,
                promotionPictures: promotionPic,
            };

        case actions.PROMOTION_CLEAR_PIC:
            return {
                ...state,
                promotionPictures: [],
            };

        case actions.SAVE_PROMOTIONS :
            let currentState = {...state};
            currentPromotions[action.businessId] = action.promotions;
            return currentState;
        default:
            return state;
    }
};