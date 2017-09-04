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
const initialState = {promotions:[]};
import store from 'react-native-simple-store';
import { REHYDRATE } from 'redux-persist/constants'


export default function promotion(state = initialState, action) {
    console.log(action.type);
    if (action.type === REHYDRATE){

        // retrive stored data for reducer callApi
        const savedData = action.payload || initialState;

        return {
            ...state, ...savedData.promotions
        };
    }
    switch (action.type) {

        case 'GET_PROMOTIONS' :

            store.save('promotions'+ action.businessId,action.promotions)
            let currentState = {...state};
            currentState['promotions'+ action.businessId] = action.promotions;

            return currentState;


        default:
            return state;
    }
};