const initialState = {products: {}, categories: [],savingForm:false};
import {REHYDRATE} from "redux-persist/constants";
import * as actions from "./reducerActions";

export default function products(state = initialState, action) {

    if (action.type === REHYDRATE) {

        // retrive stored data for reducer callApi
        const savedData = action.payload || initialState;
        return {
            ...state, ...savedData.products
        };
    }
    let productsState = {...state};
    switch (action.type) {
        case actions.UPSERT_PRODUCTS:
            let currentProducts = productsState.products;
            action.item.forEach(eventItem => {
                currentProducts[eventItem._id] = eventItem;
            });
            return productsState;
        case actions.SET_PRODUCT_CATEGORIES :
            let categoriesState = {...state};
            if(!categoriesState.categories[action.language]){
                categoriesState.categories[action.language] = {};
            }
            categoriesState.categories[action.language][action.catId] = action.categories;
            return categoriesState;
        case actions.PRODUCT_SAVING:
            return {
                ...state,
                savingForm: true,
            };
        case actions.PRODUCT_SAVING_DONE:
            return {
                ...state,
                savingForm: false,
            };
        default:
            return state;
    }
};