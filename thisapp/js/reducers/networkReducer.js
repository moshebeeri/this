const initialState = {offline: false, dimensionsChanged: false, debugMessage: '', serverVersion: ''};
import * as actions from "./reducerActions";

export default function network(state = initialState, action) {
    switch (action.type) {
        case actions.NETWORK_IS_ONLINE:
            if (state.offline) {
                return {
                    ...state,
                    offline: false,
                };
            } else {
                return state;
            }
        case  actions.NETWORK_IS_OFFLINE:
            return {
                ...state,
                offline: true,
            };
        case  actions.SERVER_VERSION:
            return {
                ...state,
                serverVersion: action.version,
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
