/**
 * Created by roilandshut on 08/06/2017.
 */
/**
 * Created by stan229 on 5/27/16.
 */
const initialState = {businesses:[],categories:[]};

import store from 'react-native-simple-store';
import { REHYDRATE } from 'redux-persist/constants'
export default function business(state = initialState, action) {

    if (action.type === REHYDRATE){

        // retrive stored data for reducer callApi
        const savedData = action.payload || initialState;

        return {
            ...state, ...savedData.businesses
        };
    }

    console.log(action.type);
    switch (action.type) {

        case 'GET_BUSINESS':
            store.save('businesses', action.businesses);
            return {
                ...state,
                businesses : action.businesses,
            };



        case 'GET_BUSINESS_CATEGORIES' :
            let categoriesState = {...state};
            categoriesState['categories'+ action.language + action.catId] = action.categories;

            return categoriesState;

        default:
            return state;
    }
};