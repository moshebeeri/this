const initialState = {currentLocation:{}};
import {REHYDRATE} from "redux-persist/constants";
import * as actions from "./reducerActions";

export default function phone(state = initialState, action) {
    console.log(action.type);
    let extendedState = {...state};
    if (action.type === REHYDRATE) {

        // retrive stored data for reducer callApi
        const savedData = action.payload || initialState;
        return {
            ...state, ...savedData.phone
        };
    }

    switch (action.type) {
        case actions.SET_LOCATION:
            return {
                ...state,
                currentLocation: action.currentLocation,
            };

        default:
            return state;
    }
};
