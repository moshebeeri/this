const initialState = {memberCards: []};
import {REHYDRATE} from "redux-persist/constants";
import * as actions from "./reducerActions";
export default function memberCards(state = initialState, action) {
    if (action.type === REHYDRATE) {

        // retrive stored data for reducer callApi
        const savedData = action.payload || initialState;
        return {
            ...state, ...savedData.memberCards
        };
    }
    switch (action.type) {
        case actions.SET_MY_MEMBER_CARDS:
            return {
                ...state,
                memberCards: action.memberCards,
            };
        default:
            return state;
    }
};
