import * as actions from "../reducers/reducerActions";

export function selectUser(user) {
    return function (dispatch) {
        dispatch({
            type: actions.USER_SELECT,
            user: user
        });
    }
}

export function unselectUser(user) {
    return function (dispatch) {
        dispatch({
            type: actions.USER_UNSELECT,
            user: user
        });
    }
}

export function resetForm() {
    return function (dispatch) {
        dispatch({
            type: actions.USER_SELECT_RESET,
        });
    }
}
