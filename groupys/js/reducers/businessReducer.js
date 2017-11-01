const initialState = {
    businesses: {},
    categories: [],
    myBusinesses: {},
    businessesUsers: {},
    businessesProducts: {},
    businessesPromotions: {},
    loading:true,
    update: false,
    selectedBusiness:undefined,
    savingForm:false,
};
import {REHYDRATE} from "redux-persist/constants";
import * as actions from "./reducerActions";

export default function business(state = initialState, action) {
    if (action.type === REHYDRATE) {

        // retrive stored data for reducer callApi
        const savedData = action.payload || initialState;
        return {
            ...state, ...savedData.businesses
        };
    }
    let businessesState = {...state};
    switch (action.type) {
        case actions.UPSERT_BUSINESS:
            let currentbusinesses = businessesState.businesses;
            businessesState.update = !businessesState.update;
            //not all the time we get the business social state in this case we need to make sure we take the social state from the last business
            action.item.forEach(eventItem => {
                if (eventItem.social_state || !currentbusinesses[eventItem._id]) {
                    currentbusinesses[eventItem._id] = eventItem;
                } else {
                    eventItem.social_state = currentbusinesses[eventItem._id].social_state;
                    currentbusinesses[eventItem._id] = eventItem;
                }
            });
            return businessesState;
        case actions.UPSERT_MY_BUSINESS:
            let myCurrentbusinesses = businessesState.myBusinesses;
            businessesState.update = !businessesState.update;
            myCurrentbusinesses[action.item.business._id] = action.item;
            return businessesState;
        case actions.LIKE:
            let item = businessesState.businesses[action.id];
            if (item) {
                item.social_state.like = true;
                item.social_state.likes = item.social_state.likes + 1;
                return businessesState;
            } else {
                return state;
            }
        case actions.UNLIKE:
            let unlikeItem = businessesState.businesses[action.id];
            if (unlikeItem) {
                unlikeItem.social_state.like = false;
                unlikeItem.social_state.likes = unlikeItem.social_state.likes - 1;
                return businessesState;
            } else {
                return state;
            }
        case actions.SHARE:
            let shareItem = businessesState.businesses[action.id];
            if (shareItem) {
                shareItem.social_state.share = true;
                shareItem.social_state.shares = shareItem.social_state.shares + action.shares;
                return businessesState;
            } else {
                return state;
            }
        case actions.SET_BUSINESS_CATEGORIES :
            let categoriesState = {...state};

            categoriesState.categories.language
            if(!categoriesState.categories[action.language]){
                categoriesState.categories[action.language] = {};
            }
            categoriesState.categories[action.language][action.catId] = action.categories;
            return categoriesState;
        case actions.SET_USER_BUSINESS:
            let businessesUsers = businessesState.businessesUsers;
            businessesState.update = !businessesState.update;
            businessesUsers[action.businessId] = action.businessUsers;
            return businessesState;
        case actions.SET_PRODUCT_BUSINESS:
            let businessesProducts = businessesState.businessesProducts;
            businessesState.update = !businessesState.update;
            businessesProducts[action.businessId] = action.businessProducts;
            return businessesState;
        case actions.SET_PROMOTION_BUSINESS:
            let businessesPromotions = businessesState.businessesPromotions;
            businessesState.update = !businessesState.update;
            businessesPromotions[action.businessId] = action.businessesPromotions;
            return businessesState;
        case actions.BUSSINESS_LOADING:
            return {
                ...state,
                loading: true,
            };

        case actions.SELECT_BUSINESS:
            return {
                ...state,
                selectedBusiness: action.selectedBusiness,
            };
        case actions.BUSSINESS_LOADING_DONE:
            return {
                ...state,
                loading: false,
            };
        case actions.SAVING_BUSINESS:
            return {
                ...state,
                savingForm: true,
            };
        case actions.SAVING_BUSINESS_DONE:
            return {
                ...state,
                savingForm: false,
            };
        default:
            return state;
    }
};