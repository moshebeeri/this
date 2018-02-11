const initialState = {
    businesses: {},
    categories: [],
    myBusinesses: {},
    myBusinessOrder: [],
    businessesUsers: {},
    businessesProducts: {},
    businessesPromotions: {},
    loading: true,
    update: false,
    selectedBusiness: undefined,
    savingForm: false,
    paymentMessage: '',
    templateBusiness: {},
    businessPictures: [],
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
    let myCurrentbusinesses = businessesState.myBusinesses;
    let currentbusinesses = businessesState.businesses;
    let businessesMap = businessesState.myBusinesses;
    let myBusinessOrder = businessesState.myBusinessOrder;
    let businessesPromotions = businessesState.businessesPromotions;
    let businessesProducts = businessesState.businessesProducts;
    switch (action.type) {
        case actions.UPSERT_BUSINESS:
            businessesState.update = !businessesState.update;
            //not all the time we get the business social state in this case we need to make sure we take the social state from the last business
            action.item.forEach(eventItem => {
                let categoryTitle = eventItem.categoryTitle;
                if (!currentbusinesses[eventItem._id]) {
                    currentbusinesses[eventItem._id] = eventItem;
                }
                if (!categoryTitle && currentbusinesses[eventItem._id]) {
                    categoryTitle = currentbusinesses[eventItem._id].categoryTitle;
                }
                let qrSource;
                if (currentbusinesses[eventItem._id]) {
                    qrSource = currentbusinesses[eventItem._id].qrcodeSource;
                }
                if (eventItem.social_state || !currentbusinesses[eventItem._id]) {
                    currentbusinesses[eventItem._id] = eventItem;
                } else {
                    eventItem.social_state = currentbusinesses[eventItem._id].social_state;
                    currentbusinesses[eventItem._id] = eventItem;
                }
                currentbusinesses[eventItem._id].qrcodeSource = qrSource;
                currentbusinesses[eventItem._id].categoryTitle = categoryTitle;
            });
            return businessesState;
        case actions.UPSERT_MY_BUSINESS:
            action.item.forEach(eventItem => {
                if (!myBusinessOrder.includes(eventItem.business._id)) {
                    myBusinessOrder.push(eventItem.business._id);
                }
                if (businessesMap[eventItem.business._id]) {
                    if (eventItem.business.pictures.length === 0) {
                        eventItem.business.pictures = businessesMap[eventItem.business._id].business.pictures;
                        eventItem.business.logo = businessesMap[eventItem.business._id].business.logo;
                    }
                }
                businessesMap[eventItem.business._id] = eventItem;
            });
            return {
                ...state,
                myBusinesses: businessesMap,
                update: !businessesState.update,
                myBusinessOrder: myBusinessOrder
            };
        case actions.UPSERT_MY_BUSINESS_SINGLE:
            if (!myBusinessOrder.includes(action.item.business._id)) {
                myBusinessOrder.unshift(action.item.business._id);
            }
            businessesMap[action.item.business._id] = action.item;
            return {
                ...state,
                myBusinesses: businessesMap,
                update: !businessesState.update,
                myBusinessOrder: myBusinessOrder
            };
        case actions.BUSINESS_UPLOAD_PIC:
            let businessPic = businessesState.businessPictures;
            businessPic.push(action.item)
            return {
                ...state,
                businessPictures: businessPic,
            };
        case actions.BUSINESS_CLEAR_PIC:
            return {
                ...state,
                businessPictures: [],
            };
        case actions.UPSERT_BUSINESS_QRCODE:
            businessesState.update = !businessesState.update;
            if (currentbusinesses[action.business._id]) {
                currentbusinesses[action.business._id].qrcodeSource = action.qrcodeSource;
            } else {
                currentbusinesses[action.business._id] = action.business;
                currentbusinesses[action.business._id].qrcodeSource = action.qrcodeSource;
            }
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
        case actions.FEED_UPDATE_SOCIAL_STATE:
            if (businessesState.businesses[action.id]) {
                businessesState.businesses[action.id].social_state = action.social_state;
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
            if (!categoriesState.categories[action.language]) {
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

            businessesState.update = !businessesState.update;
            businessesState.update = !businessesState.update;
            if (businessesProducts[action.businessId]) {
                if (action.businessProducts && action.businessProducts.length > 0) {
                    action.businessProducts.forEach(product => {
                        let update = false;
                        let updaeIndex = 0;
                        businessesProducts[action.businessId].forEach((currentProduct, index) => {
                            if (currentProduct._id === product._id) {
                                updaeIndex = index;
                                update = true;
                            }
                        });
                        if (update) {
                            businessesProducts[action.businessId][updaeIndex] = product;
                        } else {
                            businessesProducts[action.businessId].unshift(product);
                        }
                    })
                }
            } else {
                businessesProducts[action.businessId] = action.businessProducts;
            }

            return businessesState;
        case actions.UPSERT_PRODUCT_SINGLE:
            businessesState.update = !businessesState.update;
            if(!businessesProducts[action.businessId]){
                businessesProducts[action.businessId] = []
                businessesProducts[action.businessId].push(action.item)
            }
            else{
                let index =  businessesProducts[action.businessId].findIndex(product => product._id === action.item._id);
                if(index > 0 || index === 0){
                    businessesProducts[action.businessId][index] = action.item
                }
                else{
                    businessesProducts[action.businessId].push(action.item)
                }
            }


            return businessesState;
        case actions.SET_PROMOTION_BUSINESS:

            businessesState.update = !businessesState.update;
            if (businessesPromotions[action.businessId]) {
                if (action.businessesPromotions && action.businessesPromotions.length > 0) {
                    action.businessesPromotions.forEach(promotion => {
                        let update = false;
                        let updaeIndex = 0;
                        businessesPromotions[action.businessId].forEach((currentPromotion, index) => {
                            if (currentPromotion._id === promotion._id) {
                                updaeIndex = index;
                                update = true;
                            }
                        });
                        if (update) {
                            businessesPromotions[action.businessId][updaeIndex] = promotion;
                        } else {
                            businessesPromotions[action.businessId].unshift(promotion);
                        }
                    })
                }
            } else {
                businessesPromotions[action.businessId] = action.businessesPromotions;
            }
            return businessesState;
        case actions.UPSERT_PROMOTION_SINGLE:
            businessesState.update = !businessesState.update;
            if(!businessesPromotions[action.businessId]){
                businessesPromotions[action.businessId] = []
                businessesPromotions[action.businessId].push(action.item)
            }
            else{
                let index =  businessesPromotions[action.businessId].findIndex(promotion => promotion._id === action.item._id);
                if(index > 0 || index === 0){
                    businessesPromotions[action.businessId][index] = action.item
                }
                else{
                    businessesPromotions[action.businessId].push(action.item)
                }
            }


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
        case actions.PAYMENT_SUCCSESS:
            return {
                ...state,
                paymentMessage: action.message,
            };
        case actions.SAVE_BUSINESS_TAMPLATE:
            return {
                ...state,
                templateBusiness: action.templateBusiness,
            };
        default:
            return state;
    }
};