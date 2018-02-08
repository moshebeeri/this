const initialState = {offline: false, dimensionsChanged: false,debugMessage:''};
import * as actions from "./reducerActions";

export default function network(state = initialState, action) {
    switch (action.type) {
        case actions.NETWORK_IS_ONLINE:
            return {
                ...state,
                offline: false,
            };
        case action.TIME_OUT:
            return {
                 ...state,
                 debugMessage:action.debugMessage
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
