/**
 * Created by roilandshut on 08/06/2017.
 */
/**
 * Created by stan229 on 5/27/16.
 */
const initialState = {activities:{}};


import { REHYDRATE } from 'redux-persist/constants'
import * as actions from './reducerActions';
export default function activities(state = initialState, action) {

    if (action.type === REHYDRATE){

        // retrive stored data for reducer callApi
        const savedData = action.payload || initialState;

        return {
            ...state, ...savedData.activities
        };
    }
    let activityState = {...state};
    console.log(action.type);
    switch (action.type) {
        case actions.UPSERT_ACTIVITY:
            let currentActivities = activityState.activities;

            currentActivities[action.item._id] = action.item;
            return activityState;

        default:
            return state;
    }
};