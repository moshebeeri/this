const initialState = {activities: {}};
import {REHYDRATE} from "redux-persist/constants";
import * as actions from "./reducerActions";

export default function activities(state = initialState, action) {
    if (action.type === REHYDRATE) {

        // retrive stored data for reducer callApi
        const savedData = action.payload || initialState;
        return {
            ...state, ...savedData.activities
        };
    }
    let activityState = {...state};
    //      console.log(action.type);
    let currentActivities = activityState.activities;
    switch (action.type) {
        case actions.UPSERT_ACTIVITY:
            action.item.forEach(eventItem => {
                currentActivities[eventItem._id] = eventItem;
            });
            return activityState;
        case actions.REMOVE_FEED:
            if(currentActivities[action.activityId]) {
                currentActivities[action.activityId].blocked = true;
            }
            return activityState;
        default:
            return state;
    }
};