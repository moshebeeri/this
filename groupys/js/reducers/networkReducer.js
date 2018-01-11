const initialState = {offline: false, dimensionsChanged: false};
import * as actions from "./reducerActions";

export default function network(state = initialState, action) {
    switch (action.type) {
        case actions.NETWORK_IS_ONLINE:
            return {
                ...state,
                offline: false,
            };
        case  actions.NETWORK_IS_OFFLINE:
            return {
                ...state,
                offline: true,
            };
        case  actions.DIMENSIONS_CHANGED:
            let imutableState = {...state};
            return {
                ...state,
                dimensionsChanged: !imutableState.dimensionsChanged,
            };
        default:
            return state;
    }
};
