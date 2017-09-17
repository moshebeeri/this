/**
 * Created by roilandshut on 13/06/2017.
 */
/**
 * Created by roilandshut on 08/06/2017.
 */
/**
 * Created by stan229 on 5/27/16.
 */
const initialState = {products:{},categories:[]};
import store from 'react-native-simple-store';
import { REHYDRATE } from 'redux-persist/constants'
import * as actions from './reducerActions';

export default function products(state = initialState, action) {
    console.log(action.type);
    if (action.type === REHYDRATE){

        // retrive stored data for reducer callApi
        const savedData = action.payload || initialState;

        return {
            ...state, ...savedData.products
        };
    }

     let productsState = {...state};
    switch (action.type) {
        case actions.UPSERT_PRODUCTS:
            let currentProducts =productsState.products;

            currentProducts[action.item._id] = action.item;
            return productsState;

        case actions.SET_PRODUCT_CATEGORIES :
            let categoriesState = {...state};
            categoriesState['categories'+ action.language + action.catId] = action.categories;

            return categoriesState;

        case 'GET_BUSINESS_PRODUCTS' :

            let currentState = {...state};
            store.save('products'+ action.businessId,action.products)
            currentState['products'+ action.businessId] = action.products;

            return currentState;
        default:
            return state;
    }
};