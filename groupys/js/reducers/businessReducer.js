/**
 * Created by roilandshut on 08/06/2017.
 */
/**
 * Created by stan229 on 5/27/16.
 */
const initialState = {businesses:{},categories:[],myBusinesses:{},businessesUsers:{},businessesProducts:{},update:false};

import store from 'react-native-simple-store';
import { REHYDRATE } from 'redux-persist/constants'
import * as actions from './reducerActions';
export default function business(state = initialState, action) {

    if (action.type === REHYDRATE){

        // retrive stored data for reducer callApi
        const savedData = action.payload || initialState;

        return {
            ...state, ...savedData.businesses
        };
    }
    let businessesState = {...state};
    console.log(action.type);
    switch (action.type) {
        case actions.UPSERT_BUSINESS:
            let currentbusinesses = businessesState.businesses;
            businessesState.update = !businessesState.update
            currentbusinesses[action.item._id] = action.item;
            return businessesState;
        case actions.UPSERT_MY_BUSINESS:
            let myCurrentbusinesses = businessesState.myBusinesses;
            businessesState.update = !businessesState.update
            myCurrentbusinesses[action.item.business._id] = action.item;

            return businessesState;
        case actions.LIKE:
            let item = businessesState.businesses[action.id]
            if(item){
                item.social_state.like = true;
                item.social_state.likes =  item.social_state.likes + 1;
                return businessesState;
            }else{
                return state;
            }
        case actions.UNLIKE:
            let unlikeItem = businessesState.businesses[action.id]
            if(unlikeItem){
                unlikeItem.social_state.like = false;
                unlikeItem.social_state.likes =  unlikeItem.social_state.likes - 1;
                return businessesState;
            }else{
                return state;
            }
        case actions.SHARE:
            let shareItem = businessesState.businesses[action.id];
            if(shareItem){
                shareItem.social_state.share = true;
                shareItem.social_state.shares =  shareItem.social_state.shares + action.shares;
                return businessesState;
            }else{
                return state;
            }




        case 'GET_BUSINESS_CATEGORIES' :
            let categoriesState = {...state};
            categoriesState['categories'+ action.language + action.catId] = action.categories;

            return categoriesState;
        case actions.SET_USER_BUSINESS:
            let businessesUsers = businessesState.businessesUsers;
            businessesState.update = !businessesState.update

            businessesUsers[action.businessId] = action.businessUsers;
            return businessesState;
        case actions.SET_PRODUCT_BUSINESS:
            let businessesProducts = businessesState.businessesProducts;
            businessesState.update = !businessesState.update

            businessesProducts[action.businessId] = action.businessProducts;
            return businessesState;
        default:
            return state;
    }
};