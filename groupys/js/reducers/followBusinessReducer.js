const initialState = {businesses: [], cameraOn: false, searching: false};
import * as actions from "./reducerActions";
export default function business(state = initialState, action) {
    switch (action.type) {
        case actions.SEARCH_BUSINESS:
            return {
                ...state,
                businesses: action.businesses,
            };
        case actions.SHOW_CAMERA :
            return {
                ...state,
                cameraOn: action.cameraOn,
            };
        case actions.SHOW_SEARCH_SPIN :
            return {
                ...state,
                searching: action.searching,
            };
        default:
            return state;
    }
};