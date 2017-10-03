const initialState = {validationMessage: ''};
import * as actions from "./../reducerActions";

export default function loginForm(state = initialState, action) {
    switch (action.type) {
        case actions.CHANGE_PASSWORD_FAILED :
            return {
                ...state,
                validationMessage: action.message,
            };
        case actions.CHANGE_PASSWORD_CLEAR :
            return {
                ...state,
                validationMessage: action.message,
            };
        default:
            return state;
    }
};